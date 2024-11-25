import React, { useState, useRef } from 'react';
import { TextField, Button, CircularProgress, Container, Box } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from '../providers/SnackBarProvider';
import * as lib from '../utils/lib';
import './styles.css';
import ReCAPTCHA from 'react-google-recaptcha';

function LoginForgotPassword() {    
  
  const showSnackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const recaptcha = useRef();

  const [email, setEmail] = useState('');
  const [errorEmail, setEmailError] = useState('');
  const emailRef = useRef(null);
 
  const handleSubmit = async() => {
    if (!lib.validateEmail(email, setEmailError, emailRef))
      return;

    const captchaValue = recaptcha.current.getValue();
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
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}users?forgot_account_web`, { email });
      console.log(response);

      if (response.data.status == 'SUCCESS') 
        showSnackbar(`Revisa el correo ${email} para continuar`);

    } catch (error) {
      lib.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="login-container">
        <Box 
          className="login-form" 
          padding={3} 
          boxShadow={3}
          >

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
}

export default LoginForgotPassword;