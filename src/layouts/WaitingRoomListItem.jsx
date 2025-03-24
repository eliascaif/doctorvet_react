import React from 'react';
import { Box, Grid, Typography, Avatar, IconButton } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const WaitingRoomListItem = ({ room, onClick, onComplete, onDelete }) => {
  const handleClick = () => {
    onClick(room.pet);
  };

  const handleComplete = (e) => {
    e.stopPropagation();
    onComplete(room);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(room);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{ 
        px: 2, 
        py: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Thumbnail */}
        <Grid item>
          <Avatar 
            sx={{ width: 56, height: 56, bgcolor: 'grey.800' }} 
            alt="Thumbnail"
            src={room.pet.thumb_url}
          >
            {!room.pet.thumb_url && <PetsIcon sx={{ fontSize: 32 }} />}
          </Avatar>
        </Grid>
        
        {/* Name and Owner */}
        <Grid item xs>
          <Typography 
            variant="subtitle1" 
            noWrap
          >
            {room.pet.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            noWrap
            // sx={{ mb: 0.5 }}
          >
            De: {room.owner.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            noWrap
            // sx={{ mb: 0.5 }}
          >
            {`Atiende ${room.pre_attended_by_user.name} en ${room.site}`}
          </Typography>
        </Grid>

        {/* Site */}
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
          }}
        >          
          <Typography 
            variant="caption" 
            noWrap
          >
            {room.site}
          </Typography>
        </Box> */}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={handleComplete}
            sx={{ color: 'grey.500' }}
          >
            <CheckIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleDelete}
            sx={{ color: 'grey.500' }}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      </Grid>
    </Box>
  );
};

export default WaitingRoomListItem; 