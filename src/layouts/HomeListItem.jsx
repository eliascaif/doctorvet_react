import React from 'react';
import { Card, Box, Typography, Avatar } from '@mui/material';
import * as MuiIcons from '@mui/icons-material';

const HomeListItem = ({notification, onClick}) => {
  // Función para obtener el icono dinámicamente
  const getIcon = (iconName) => {
    // Si no hay nombre de icono, retornamos null
    if (!iconName) return null;
    
    // Obtenemos el componente del icono
    const IconComponent = MuiIcons[iconName];
    
    // Si existe el icono, lo retornamos con color
    return IconComponent ? <IconComponent sx={{ color: 'grey.700', fontSize: 28 }} /> : null;
  };

  const isDailySummary = notification.notification_type === 'DAILY_SUMMARY';

  return (
    <Card
      onClick={() => onClick(notification)}
      sx={{
        width: '100%',
        margin: '16px 0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          justifyContent: isDailySummary ? 'center' : 'flex-start',
        }}
      >
        {getIcon(notification.icon) && (
          <Avatar
            sx={{
              width: 35,
              height: 35,
              bgcolor: 'transparent',
              display: 'flex',
            }}
          >
            {getIcon(notification.icon)}
          </Avatar>
        )}
        <Typography
          sx={{
            marginX: 1,
            flex: isDailySummary ? 'initial' : 1,
            textAlign: isDailySummary ? 'center' : 'left',
          }}
          variant="subtitle1"
        >
          {notification.notification_es}
        </Typography>
      </Box>
    </Card>
  );
};

export default HomeListItem;
