import React from 'react';
import { Box, Grid, Typography, Divider, Avatar, Stack } from '@mui/material';
import { formatDate } from '../utils/lib';
//import { useConfig } from '../providers/ConfigProvider';

const PetRecentListItem = ({pet, onClick, isMultiUser = false}) => {
  //const { config } = useConfig();

  return (
    <Box
      onClick={() => onClick(pet)} 
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
            src={pet.thumb_url}
          />
        </Grid>
        
        {/* Name */}
        <Grid item xs>
          <Typography 
            variant="subtitle1" 
            noWrap
            sx={{ mb: 0.5 }}
          >
            {pet.name}
          </Typography>

        </Grid>

        {/* Last Visit and Reason */}
        <Box
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
            {formatDate(pet.last_visit)}
          </Typography>
          <Typography 
            variant="caption" 
            noWrap
          >
            {pet.reason_es}
          </Typography>
          {isMultiUser == 1 && (
            <Typography 
              variant="caption" 
              noWrap
            >
              {pet.user.name}
            </Typography>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default PetRecentListItem;
