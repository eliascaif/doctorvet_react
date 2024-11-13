import React from 'react';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ListItemOkCancelVet = (props) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      padding={1}
      borderBottom="1px solid #dadada"
      width="100%"
    >
      {/* Imagen de Perfil */}
      <Avatar
        sx={{ width: 60, height: 60, marginRight: 1 }}
        src={props.url} // Cambia esto al path de tu imagen
        alt="Vet Thumbnail"
      />

      {/* Información de la Veterinaria */}
      <Box flex={1} ml={1}>
        <Typography variant="subtitle1" gutterBottom>
          Vet name
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Vet email
        </Typography>
        <Typography variant="caption" display="block">
          Vet region
        </Typography>
      </Box>

      {/* Estado */}
      <Box display="flex" alignItems="center" mr={2}>
        <Typography variant="caption">
          Solicitud Pendiente
        </Typography>
      </Box>

      {/* Íconos de Aceptar o Cancelar */}
      <Box display="flex" alignItems="center">
        <CheckCircleIcon
          sx={{
            width: 42,
            height: 42,
            visibility: 'hidden', // Cambia a 'visible' cuando sea necesario
            marginRight: 1,
          }}
          color="primary"
        />
        <CancelIcon
          sx={{
            width: 42,
            height: 42,
            visibility: 'hidden', // Cambia a 'visible' cuando sea necesario
          }}
          color="error"
        />
      </Box>
    </Box>
  );
};

export default ListItemOkCancelVet;
