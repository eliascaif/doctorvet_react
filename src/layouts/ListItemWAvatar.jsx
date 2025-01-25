import React from 'react';
import { Box, Avatar, ListItemText, ListItemAvatar } from '@mui/material';
import { capitalizeFirstLetter } from '../utils/lib';

const ListItemWAvatar = ({ primary, secondary, thumbUrl }) => {  

  const avatarContent = capitalizeFirstLetter(primary?.charAt(0) || '');

  return (
    <Box display="flex" alignItems="center" width="100%">
      <ListItemAvatar>
        <Avatar 
          alt={capitalizeFirstLetter(primary)} 
          src={thumbUrl}>
            {!thumbUrl && avatarContent}
        </Avatar>

      </ListItemAvatar>
      <ListItemText 
        primary={primary} 
        secondary={secondary || ''} 
        // sx={{ marginLeft: 0 }} // Espacio entre el avatar y el texto
      />
    </Box>
  );
};

export default ListItemWAvatar;


