import React, { useState, useRef, useEffect } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Container,
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as lib from '../utils/lib';

const LoginForgotPassword2 = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const passwordRef = useRef(null);

  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [errorPasswordRepeat, setErrorPasswordRepeat] = useState('');
  const passwordRepeatRef = useRef(null);

  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!lib.validatePassword(password, setErrorPassword, passwordRef) || 
        !validatePasswordRepeat())
      return;
  
    setIsLoading(true);

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}users?forgot_account_3`, userData);
      console.log(response);

      navigate('/');
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

export default LoginForgotPassword2;
