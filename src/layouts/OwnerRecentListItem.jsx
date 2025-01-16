import React from 'react';
import { Box, Grid, Typography, Divider, Avatar, Stack } from '@mui/material';
import { formatDate } from '../utils/lib';

const OwnerRecentListItem = ({owner, onClick, onPetClick, isMultiUser = false}) => {
  return (
    <Box
      onClick={() => onClick(owner)} 
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
            src={owner.thumb_url}
          />
        </Grid>
        
        {/* Name and Email/Phone */}
        <Grid item xs>
          <Typography 
            variant="subtitle1" 
            noWrap
            sx={{ mb: 0.5 }}
          >
            {owner.name}
          </Typography>

          <Stack 
            direction="row" 
            spacing={1} 
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Typography 
              variant="caption" 
              noWrap 
              sx={{ flex: 1 }}
            >
              {owner.email}
            </Typography>
            <Typography 
              variant="caption" 
              noWrap 
              sx={{ flex: 1 }}
            >
              {owner.phone}
            </Typography>
          </Stack>
        </Grid>

        {/* Last Visit, Reason and user */}
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
            {formatDate(owner.last_visit)}
          </Typography>
          <Typography 
            variant="caption" 
            noWrap
          >
            {owner.reason_es}
          </Typography>
          {isMultiUser == 1 && (
            <Typography 
              variant="caption" 
              noWrap
            >
              {owner.user.name}
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Pets */}
      <Box 
        sx={{
          display: 'flex',
          overflowX: 'auto',
          mt: 2,
          mb: 1,
          px: 1,
          whiteSpace: 'nowrap',
          ml: 8,
        }}
      >
        <Box 
          sx={{ 
            display: 'inline-flex', 
            gap: 2,
          }}
        >
          {owner.pets.map((pet) => (
            <Typography
              onClick={(event) => onPetClick(event, pet)}
              variant="subtitle2" 
            >
              {pet.name}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default OwnerRecentListItem;
