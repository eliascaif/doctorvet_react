// ProfileItem.js
import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ProfileItem = ({ name = "SELECCIONAR", onRemove }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        paddingY: '4px',
      }}
    >
      {/* Avatar Thumbnail */}
      <Avatar
        sx={{
          width: 42,
          height: 42,
        }}
      >
        <AccountCircleIcon fontSize="large" />
      </Avatar>

      {/* Text */}
      <Typography
        variant="caption"
        sx={{
          flex: 1,
          marginX: '8px',
          color: 'text.secondary', // Material-UI caption color
        }}
      >
        {name}
      </Typography>

      {/* Remove Icon */}
      <IconButton
        onClick={onRemove}
        sx={{
          width: 42,
          height: 42,
          marginLeft: '16px',
          marginRight: '4px',
        }}
      >
        <CancelIcon />
      </IconButton>
    </Box>
  );
};

export default ProfileItem;
