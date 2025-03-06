import React from 'react';
import { Card, Box, Typography, Avatar } from '@mui/material';

const HomeListItem = ({notification, onClick}) => {
  //console.log(notification);
  return (
    <Card
      onClick={() => onClick(notification)}
      sx={{
        width: '100%',
        margin: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Avatar
          sx={{
            width: 35,
            height: 35,
            bgcolor: 'cardview.dark',
            display: 'none',
          }}
        />
        <Typography
          sx={{
            marginX: 1,
            flex: 1,
          }}
          variant="subtitle1"
        >
          {notification.notification_es}
        </Typography>
      </Box>
    </Card>
  );
};

export default HomeListItem;
