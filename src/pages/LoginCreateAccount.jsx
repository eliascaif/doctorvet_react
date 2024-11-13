import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  CircularProgress,
  Box,
  Container,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../providers/SnackBarProvider';
import { strings } from '../constants/strings';
import * as lib from '../utils/lib';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginCreateAccount = () => {
  const navigate = useNavigate();

  const showSnackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const recaptcha = useRef();

  const [name, setName] = useState('');
  const [errorName, setErrorName] = useState('');
  const nameRef = useRef(null);

  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const emailRef = useRef(null);

  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const passwordRef = useRef(null);

  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [errorPasswordRepeat, setErrorPasswordRepeat] = useState('');
  const passwordRepeatRef = useRef(null);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!lib.validateNonEmpty(name, setErrorName, nameRef) || 
        !lib.validateEmail(email, setErrorEmail, emailRef) || 
        !lib.validatePassword(password, setErrorPassword, passwordRef) || 
        !validatePasswordRepeat())
      return;

    const captchaValue = recaptcha.current.getValue()
    if (!captchaValue) {
      showSnackbar('Valida que eres humano.');
      return;
    }

    const validCaptcha = lib.verifyCaptchaToken(captchaValue);
    if (!validCaptcha) {
      showSnackbar('Error al procesar captcha.');
      return;
    }
  
    setIsLoading(true);

    const userData = {
      name: name,
      email: email,
      password: password,
      login_type: 'EMAIL',
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}users?create_account`, userData);
      //console.log(response);
      navigate('/login-check-valid', { state: { email: email, pre_access_token: response.data.data.pre_access_token } });
    } catch (error) {
      lib.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordRepeat = () => {
    if (password !== passwordRepeat) {
      setErrorPasswordRepeat('Las contraseñas no coinciden');
      passwordRepeatRef.current.focus();
      return false;
    }

    setErrorPasswordRepeat('');
    return true;
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-container">
        <Box 
          className="login-form" 
          padding={3} 
          boxShadow={3}
          component="form"
          onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errorName)}
            helperText={errorName}
            inputRef={nameRef}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errorEmail}
            helperText={errorEmail}
            inputRef={emailRef}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorPassword}
            helperText={errorPassword}
            inputRef={passwordRef}
          />
          <TextField
            label="Repetir Contraseña"
            type="password"
            margin="normal"
            fullWidth
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            error={Boolean(errorPasswordRepeat)}
            helperText={errorPasswordRepeat}
            inputRef={passwordRepeatRef}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />

          <Box display="flex" justifyContent="center" mt={2}>
            <ReCAPTCHA 
              ref={recaptcha} 
              sitekey={import.meta.env.VITE_RECAPCHA_SITE_KEY} 
            />
          </Box>

          <Box mt={4}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? <CircularProgress size={24} /> : 'Continuar'}
            </Button>
          </Box>

        </Box>
      </Box>
    </Container>
  );
};

export default LoginCreateAccount;
