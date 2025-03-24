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
import { useNavigate } from 'react-router-dom';
import { handleError } from '../../utils/lib';
import { useAuth } from '../../providers/AuthProvider';
import ListItemVet from '../../layouts/ListItemVet';
import { useConfig } from '../../providers/ConfigProvider';

const ViewVetChange = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const [vets, setVets] = useState([]);
  const { reloadConfig } = useConfig();

  //const { login } = useAuth();
    
  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}users?user_vets_by_token`, 
        { withCredentials: true },
      );
      setVets(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchVets();
  };

  const handleSelectVet = async (vet) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}users?change_vet_web`,
        { id: vet.id },
        { withCredentials: true }
      );

      localStorage.clear();
      await reloadConfig();
      navigate('/main');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
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

    </Container>
  );
};

export default ViewVetChange;
