import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function ClinicHeaderItem({ title, subtitle, age, thumbUrl }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        //padding: 1, // equivalente a android:padding="8dp"
        width: '100%',
      }}
    >
      {/* Imagen de avatar */}
      {/* backgroundColor: 'background.default', */}
      <Avatar
        sx={{
          width: 35,
          height: 35,
        }}
      >
        {!thumbUrl && (
          <PersonIcon />
        )}
      </Avatar>

      {/* Contenedor del texto */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 2, // equivalente a android:layout_marginStart="8dp"
          flex: 1, // esto hace que el texto ocupe el resto del espacio
        }}
      >
        {/* Título */}
        <Typography
          variant="h6"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: 13, // equivalente a android:textSize="13sp"
            fontWeight: 'bold',
          }}
        >
          {title}
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="body2"
          sx={{
            fontSize: 12, // equivalente a TextAppearance.AppCompat.Caption
            color: 'text.secondary',
          }}
        >
          {subtitle}
        </Typography>

        {/* Edad (visible si se pasa como prop) */}
        {age && (
          <Typography
            variant="body2"
            sx={{
              fontSize: 12, // equivalente a TextAppearance.AppCompat.Caption
              color: 'text.secondary',
            }}
          >
            {age}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ClinicHeaderItem;
