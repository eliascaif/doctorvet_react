import React from 'react';
import { Box, List, Typography } from '@mui/material';
import OwnerRecentListItem from './OwnerRecentListItem';

const OwnersRecentList = ({owners, onClick, onPetClick, isMultiUser}) => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}>

        <Typography 
          variant="caption" 
          noWrap 
          sx={{ 
            ml: 2,
            mt: 4,
          }}
        >
          Últimos movimientos
        </Typography>

      <List>
        {owners.map((owner) => (
          <OwnerRecentListItem
            key={owner.id}
            owner={owner}
            onClick={onClick}
            onPetClick={onPetClick}
            isMultiUser={isMultiUser}
          />
        ))}
      </List>
    </Box>
  );
};

export default OwnersRecentList;
