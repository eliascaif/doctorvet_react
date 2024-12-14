import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import PetsIcon from "@mui/icons-material/Pets";

const ListItemRectangle = ({ id, name, thumb_url }) => {
  return (
    <Box
      sx={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '8px',
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
      }}
    >
      {/* Imagen de la mascota */}
      <Avatar
          src={thumb_url || undefined}
          alt={name}
          sx={{ width: 50, height: 50, marginRight: '8px' }}
      >
        {!thumb_url && <PetsIcon />}
      </Avatar>
      {/* Información de la mascota */}
      <Box sx={{ flex: 1 }}>
          <Typography
              variant="caption"
              noWrap
              sx={{ display: 'block', marginBottom: '4px' }}
          >
              {name}
          </Typography>

          {/* <Typography
              variant="caption"
              noWrap
          >
              {name}
          </Typography> */}
      </Box>
    </Box>
  );
};

export default ListItemRectangle;