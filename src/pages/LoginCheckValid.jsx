import React, { useState } from 'react';
import {
  Button,
  Typography,
  CircularProgress,
  Dialog,
  Box,
  Container,
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../providers/SnackBarProvider';
import { strings } from '../constants/strings';
import { handleError } from '../utils/lib';

function LoginCheckValid() {
  const location = useLocation();
  // const { pre_access_token, email } = location.state || {};
  // const [preAccessToken, SetPreAccessToken] = location.state.preAccessToken;
  // const [email, SetEmail] = location.state.email;

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); 
  const preAccessToken = searchParams.get("pre_access_token");

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const info = `Revisa ${email} para continuar`;

  const handleCheckAccount = async () => {
    setIsLoading(true);

    try {
      const params = {
        check_for_valid_account_web: '',
        pre_access_token: preAccessToken,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}users`, null, { params: params });
      //console.log(response);

      if (response.data.data == 1)
        // navigate('/login-choice', { state: { email: email, pre_access_token: preAccessToken } });
        navigate(`/login-choice?email=${encodeURIComponent(email)}&pre_access_token=${encodeURIComponent(preAccessToken)}`);
      else
        showSnackbar(info);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }  
  };

  const handleUseAnotherAccount = async () => {
    setIsLoading(true);

    try {
      const params = {
        delete_unverified_account: '',
        email: email,
      };

      const response = await axios.delete(`${import.meta.env.VITE_API_URL}users`, { params: params });
      navigate('/');
    } catch (error) {
      handleError(error);
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

          <Typography variant="h6">{info}</Typography>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckAccount}
              disabled={isLoading}
              fullWidth
            >
              {strings.continuar}
            </Button>
          </Box>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUseAnotherAccount}
              disabled={isLoading}
              fullWidth
            >
              {strings.usar_otra_cuenta}
            </Button>
          </Box>
        </Box>

        {isLoading && (
          <CircularProgress
            size={42}
            sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
          />
        )}

        <Dialog open={isLoading} />

      </Box>
    </Container>
  );
}

export default LoginCheckValid;
