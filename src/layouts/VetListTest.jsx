import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';

const VetListTest = ({ vets }) => {
  return (
    <List>
      {vets.map((vet, index) => (
        <ListItem key={vet.id} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar src={vet.image} alt={vet.name} />
          </ListItemAvatar>
          <ListItemText
            primary={vet.name}
            secondary={
              <>
                <Typography component="span" variant="body2" color="textPrimary">
                  {vet.email}
                </Typography>
                {" — "}
                {vet.region}
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default VetListTest;
