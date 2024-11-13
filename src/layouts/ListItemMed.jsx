import React from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';

const ListItemMed = ({ vet, onSelect }) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          paddingX: 1,
          paddingY: 1,
          alignItems: 'flex-start',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#f5f5f5' },
        }}
        onClick={() => onSelect(vet)}
      >
        {/* Imagen (Thumbnail) */}
        <Avatar
          sx={{ width: 42, height: 42, margin: 1, bgcolor: 'grey.500' }}
          src={vet.imageUrl}
          alt={vet.name}
        />
        {/* Contenedor de texto */}
        <Box sx={{ flexGrow: 1, marginTop: 1 }}>
          {/* Título */}
          <Typography
            variant="subtitle1"
            sx={{ margin: 1 }}
          >
            {vet.name}
          </Typography>
          {/* Subtítulo */}
          <Typography
            variant="caption"
            sx={{ marginX: 1, marginBottom: 1 }}
            noWrap
          >
            {vet.email}
          </Typography>
        </Box>
      </Box>
      {/* Divisor */}
      <Divider sx={{ marginX: 1 }} />
    </>
  );
};

export default ListItemMed;
