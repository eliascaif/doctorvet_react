import React from 'react';
import { Typography, Container, Box } from '@mui/material';
import './styles.css';

function LoginForgotPassword2() {    
  
  const info = 'Revisa tu cuenta de correo para continuar';
 
  return (
    <Container maxWidth="sm">
      <Box className="login-container">
        <Box 
          className="login-form" 
          padding={3} 
          boxShadow={3}
          >

          <Typography variant="h6">{info}</Typography>
        
        </Box>
      </Box>
    </Container>
  );
}

export default LoginForgotPassword2;