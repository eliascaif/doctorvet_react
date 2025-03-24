import React from 'react';
import { Box, Avatar, ListItemText, ListItemAvatar, IconButton, ButtonBase } from '@mui/material';
import { capitalizeFirstLetter } from '../utils/lib';
import CloseIcon from '@mui/icons-material/Close';

const ListItemWAvatarRemove = ({ 
  primary, 
  secondary, 
  thumbUrl, 
  avatarContent, 
  onDelete,
  onClick
}) => {  

  // 1. Eliminar la condición redundante !thumbUrl dentro del avatar por defecto
  const defaultAvatar = <Avatar alt={capitalizeFirstLetter(primary)}>{avatarContent}</Avatar>;

  return (
    <Box display="flex" alignItems="center" width="100%" justifyContent="space-between" sx={{ marginTop: 2 }}>
      <ButtonBase onClick={onClick} sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <ListItemAvatar>
            {thumbUrl ? (
              <Avatar alt={capitalizeFirstLetter(primary)} src={thumbUrl} />
            ) : (
              defaultAvatar
            )}
          </ListItemAvatar>
          <ListItemText 
            primary={primary} 
            secondary={secondary || ''} 
            sx={{ textAlign: "left" }} 
          />
        </Box>
      </ButtonBase>

      {onDelete && (
        <IconButton onClick={onDelete}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ListItemWAvatarRemove;