import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { handleError } from '../utils/lib';
import { useAuth } from '../providers/AuthProvider';
import ListItemVet from '../layouts/ListItemVet';

const LoginChoice = () => {
  const location = useLocation();

  //const { pre_access_token } = location.state || {};
  //const { preAccessToken, email } = location.state || {};

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); 
  const preAccessToken = searchParams.get("pre_access_token");
  
  const navigate = useNavigate();
  // const [preAccessToken, SetPreAccessToken] = useState(location.state.pre_access_token || {});
  // const [email, SetEmail] = useState(location.state.email || {});

  const [isLoading, setIsLoading] = useState(true);

  const [vets, setVets] = useState([]);

  const { login } = useAuth();
    
  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    setIsLoading(true);

    try {
      const params = {
        user_vets_web: '',
        pre_access_token: preAccessToken,
      };
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}users`, { params: params })
      // console.log(response);
      setVets(response.data.data);
    } catch (error) {
      handleError(error);
      //invalid token
      if (error.response.data.message == 'invalid token')
        navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchVets();
  };

  const handleSelectVet = async (vet) => {
    setIsLoading(true);

    vet.pre_access_token = preAccessToken;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}users?email_auth_web`,
        { vet: { id: vet.id }, pre_access_token: preAccessToken },
        { withCredentials: true }
      );
      //console.log(response);

      login();
      navigate('/main');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVet = () => {
    // navigate('/edit-vet', { state: { pre_access_token: preAccessToken, isInitCreate: 1 } });
    navigate(`/edit-vet?isInitCreate=1&pre_access_token=${encodeURIComponent(preAccessToken)}`);
  };

  const handleSearchVet = () => {
    // navigate('/search-vet', { state: { pre_access_token: preAccessToken, email: email } });
    // navigate(`/search-vet?email=${encodeURIComponent(email)}&pre_access_token=${encodeURIComponent(preAccessToken)}`);
    navigate(`/search-vet?email=${encodeURIComponent(email)}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, position: 'relative' }}>
      {/* Indicador de carga */}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Título y botón de refrescar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Elige establecimiento
        </Typography>
        <IconButton onClick={handleRefresh}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Lista de veterinarias */}
      <Box sx={{ maxHeight: 300, overflow: 'auto', backgroundColor: '#f5f5f5', minHeight: 300 }}>
      {vets.map((vet) => (
        <ListItemVet key={vet.id} vet={vet} onClick={handleSelectVet} />
      ))}
    </Box>

      {/* Sección de acciones */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Presiona sobre el establecimiento con el que vas a trabajar. Si no ves
          ningún establecimiento en el cuadro de arriba, puedes crear tu propia
          veterinaria/pet shop/veterinaria móvil.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          fullWidth
          onClick={handleCreateVet}
        >
          Crear establecimiento
        </Button>
        <Typography variant="body1" sx={{ mt: 4, mb: 2 }}>
          Si no tienes tu propia veterinaria, puedes unirte a una veterinaria que
          conozcas y en la que trabajes. En este modo, se le enviará una solicitud
          de unión al dueño de la veterinaria en la que trabajas.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSearchVet}
        >
          Unirse a establecimiento
        </Button>
      </Box>
    </Container>
  );
};

export default LoginChoice;
