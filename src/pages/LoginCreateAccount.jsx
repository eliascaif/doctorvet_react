import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Container,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../providers/SnackBarProvider';
import * as lib from '../utils/lib';
import ReCAPTCHA from 'react-google-recaptcha';
import { ErrorSharp } from '@mui/icons-material';

const LoginCreateAccount = () => {
  const navigate = useNavigate();

  const showSnackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const recaptcha = useRef();

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    passwordRepeat: useRef(null),
  });

  const [name, setName] = useState('');
  // const [errorName, setErrorName] = useState('');
  // const nameRef = useRef(null);

  const [email, setEmail] = useState('');
  // const [errorEmail, setErrorEmail] = useState('');
  // const emailRef = useRef(null);

  const [password, setPassword] = useState('');
  // const [errorPassword, setErrorPassword] = useState('');
  // const passwordRef = useRef(null);

  const [passwordRepeat, setPasswordRepeat] = useState('');
  // const [errorPasswordRepeat, setErrorPasswordRepeat] = useState('');
  // const passwordRepeatRef = useRef(null);

  useEffect(() => {
    refs.name.current.focus();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!lib.validateNonEmpty('name', name, setErrors, refs.name) || 
        !lib.validateEmail('email', email, setErrors, refs.email) || 
        !lib.validatePassword('password', password, setErrors, refs.password) || 
        !validatePasswordRepeat())
      return;

    const captchaValue = recaptcha.current.getValue()
    if (!captchaValue) {
      showSnackbar('Presiona sobre \'No soy un robot\'');
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
      let error = {
        ['passwordRepeat']: 'Las contraseñas no coinciden'
      };
      setErrors(error);
      refs.passwordRepeat.current.focus();
      return false;
    }

    setErrors({});
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
            error={!!errors.name}
            helperText={errors.name}
            inputRef={refs.name}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            inputRef={refs.email}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            inputRef={refs.password}
          />
          <TextField
            label="Repetir Contraseña"
            type="password"
            margin="normal"
            fullWidth
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            error={!!errors.passwordRepeat}
            helperText={errors.passwordRepeat}
            inputRef={refs.passwordRepeat}
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
