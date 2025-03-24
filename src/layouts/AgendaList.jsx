import React from 'react';
import { Box, List, Typography } from '@mui/material';
import AgendaListItem from './AgendaListItem';

const AgendaList = ({agendaItems, onClick, onPostpone, onComplete}) => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
        mb: 2
      }}>
        <Typography 
          variant="caption" 
          noWrap 
          sx={{ 
            ml: 2,
            mt: 4,
          }}
        >
          En agenda
        </Typography>

        <List>
          {agendaItems.map((item) => (
            <AgendaListItem
              key={item.id}
              item={item}
              onClick={onClick}
              onPostpone={onPostpone}
              onComplete={onComplete}
            />
          ))}
        </List>
      </Box>
  );
};

export default AgendaList; 