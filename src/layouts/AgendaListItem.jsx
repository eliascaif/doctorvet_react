import React from 'react';
import { Box, Grid, Typography, Avatar, IconButton } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateReplaceHour } from '../utils/lib';

const AgendaListItem = ({ item, onClick, onComplete, onDelete, onPostpone }) => {
  const handleClick = () => {
    onClick(item.pet);
  };

  const handleComplete = (e) => {
    e.stopPropagation();
    onComplete(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(item);
  };

  const handlePostpone = (e) => {
    e.stopPropagation();
    onPostpone(item);
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
            src={item.pet.thumb_url}
          >
            {!item.pet.thumb_url && <PetsIcon sx={{ fontSize: 32 }} />}
          </Avatar>
        </Grid>
        
        {/* Name and Owner */}
        <Grid item xs>
          <Typography 
            variant="subtitle1" 
            noWrap
          >
            {item.pet.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            noWrap
            // sx={{ mb: 0.5 }}
          >
            De: {item.owner.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            noWrap
            // sx={{ mb: 0.5 }}
          >
            {`${item.event_name} ${formatDateReplaceHour(item.begin_time)}. ${item.user.name}`} 
          </Typography>

        </Grid>

        {/* Event and Time */}
        {/* <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            textAlign: 'right',
            mr: 2
          }}
        >          
          <Typography 
            variant="caption" 
            noWrap
          >
            {item.event_name}
          </Typography>
          <Typography 
            variant="caption" 
            noWrap
          >
            {formatDateReplaceHour(item.begin_time)}
          </Typography>
        </Box> */}

        {/* Action Buttons */}
        <Grid item>
          <IconButton 
            size="small" 
            onClick={handlePostpone}
            sx={{ mr: 1 }}
          >
            <ArrowForwardIcon />
          </IconButton>
          {onComplete && (
            <IconButton 
              size="small" 
              onClick={handleComplete}
              sx={{ mr: 1 }}
            >
              <CheckIcon />
            </IconButton>
          )}
          {onDelete && (
            <IconButton 
              size="small" 
              onClick={handleDelete}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgendaListItem; 