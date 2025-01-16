import React from 'react';
import { Box, Typography, Divider, Avatar, Grid } from '@mui/material';
import StoreIcon from "@mui/icons-material/Store";

const ListItemVet = ({ vet, onClick }) => {  
  return (
    <Box
      onClick={() => onClick(vet)} 
      sx={{ 
        px: 2, 
        py: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 5,
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Thumbnail */}
        <Grid item>
          <Avatar 
            sx={{ width: 56, height: 56, bgcolor: 'grey.800' }} 
            alt="Thumbnail"
            src={vet.thumb_url}
          >
            {!vet.thumb_url && <StoreIcon/>}
          </Avatar>
        </Grid>
        
        {/* Name and Email/Phone */}
        <Grid item xs>
          <Typography 
            variant="subtitle1" 
            noWrap
            sx={{ mb: 0.5 }}
          >
            {vet.name}
          </Typography>

          <Typography 
              variant="caption" 
              noWrap 
              sx={{ flex: 1 }}
            >
              {vet.email}
            </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  
  
  
  
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

export default ListItemVet;
