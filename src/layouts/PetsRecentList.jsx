import React from 'react';
import { Box, List, Typography } from '@mui/material';
import PetRecentListItem from './PetRecentListItem';

const PetsRecentList = ({pets, onClick, isMultiUser}) => {
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
        {pets.map((pet) => (
          <PetRecentListItem
            key={pet.id}
            pet={pet}
            onClick={onClick}
            isMultiUser={isMultiUser}
          />
        ))}
      </List>
    </Box>
  );
};

export default PetsRecentList;
