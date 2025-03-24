import React from 'react';
import { Box, List, Typography } from '@mui/material';
import WaitingRoomListItem from './WaitingRoomListItem';

const WaitingRoomsList = ({waitingRooms, onClick, onComplete, onDelete}) => {
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
          En sala de espera
        </Typography>

        <List>
          {waitingRooms.map((room) => (
            <WaitingRoomListItem
              key={room.id}
              room={room}
              onClick={onClick}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </List>
      </Box>
  );
};

export default WaitingRoomsList; 