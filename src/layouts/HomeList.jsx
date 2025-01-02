import React from 'react';
import { Box, List, Typography } from '@mui/material';
import HomeListItem from './HomeListItem';
import { formatDateLong } from '../utils/lib';

const HomeList = ({notifications, onClick}) => {

  const today = new Date();
  const date = formatDateLong(today.toString());
  const firstNotif = { notification_type: 'DAILY_SUMMARY', notification_es: 'Resumen del día. ' + date.toString() };
  notifications = [firstNotif, ...notifications];

  return (
    <Box 
      sx={{ 
        width: '100%', 
        // borderRadius: 2,
        // boxShadow: 3,
        // bgcolor: 'background.paper',
      }}>

        {/* <Typography 
          variant="caption" 
          noWrap 
          sx={{ 
            ml: 2,
            mt: 4,
          }}
        >
          Últimos movimientos
        </Typography> */}

      {console.log(notifications)}
      <List>
        {notifications.map((notification, index) => (
          <HomeListItem
            key={index}
            notification={notification}
            onClick={onClick}
          />
        ))}
      </List>
    </Box>
  );
};

export default HomeList;
