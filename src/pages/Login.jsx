import React, { useState, useRef } from 'react';
import { TextField, Button, CircularProgress, Container, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../providers/SnackBarProvider';
import * as lib from '../utils/lib';
import './styles.css';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {    
  const navigate = useNavigate();
  
  const showSnackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const recaptcha = useRef();

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    email: useRef(null),
    password: useRef(null),
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!lib.validateEmail('email', email, setErrors, refs.email) || 
        !lib.validatePassword('password', password, setErrors, refs.password))
      return;

    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      showSnackbar('Presiona sobre \'No soy un robot\'');
      return;
    } 
    
    const validCaptcha = lib.verifyCaptchaToken(captchaValue);
    if (!validCaptcha) {
      showSnackbar('Error al procesar captcha');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}users?email_pre_auth_web`,
        { email, password }
      );
      //console.log(response);
      
      switch (response.data.data.state) {
        case 'ACCOUNT_WAITING_FOR_EMAIL_CHECK':
          // navigate('/login-check-valid', { state: { email: email, pre_access_token: response.data.data.pre_access_token } });
          navigate(`/login-check-valid?email=${encodeURIComponent(email)}&pre_access_token=${encodeURIComponent(response.data.data.pre_access_token)}`);
          break;

        case 'VALID':
        case 'ACCOUNT_WAITING_FOR_VET_ASSOCIATION':
          // navigate('/login-choice', { state: { email: email, pre_access_token: response.data.data.pre_access_token } });
          navigate(`/login-choice?email=${encodeURIComponent(email)}&pre_access_token=${encodeURIComponent(response.data.data.pre_access_token)}`);
          break;
      }
    } catch (error) {
      if (error.response /*&& error.response.status == 404*/)
        showSnackbar('Login inválido');

      lib.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const captchaValue = recaptcha.current.getValue()
    if (!captchaValue) {
      showSnackbar('Presiona sobre \'No soy un robot\'');
      return;
    }
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

          <Typography variant="h5" gutterBottom className="login-title">
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            inputRef={refs.email}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            inputRef={refs.password}
          />
          
          <Box display="flex" justifyContent="center" mt={1}>
            <ReCAPTCHA 
              ref={recaptcha} 
              sitekey={import.meta.env.VITE_RECAPCHA_SITE_KEY} 
            />
          </Box>

          <Box mt={2}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? <CircularProgress size={24} /> : 'Ingresar'}
            </Button>
          </Box>

          <Box mt={2} display="flex" justifyContent="center">
            <Button
              startIcon={<GoogleIcon />}
              variant="outlined"
              onClick={handleGoogleLogin}
              fullWidth
            >
              Login with Google
            </Button>
          </Box>

          <Box mt={4} display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="body2"
              color="primary"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/login-create-account')}
              >
              Crear cuenta
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/login-forgot-password')}
              >
              Olvidé mi contraseña
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(`${import.meta.env.VITE_WEB_URL}privacy-policy.html`, '_blank')}
              >
                Política de privacidad
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;