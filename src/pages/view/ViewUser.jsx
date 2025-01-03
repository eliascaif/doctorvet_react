import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  Fab,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchUser, formatDate } from '../../utils/lib';
import { strings } from "../../constants/strings"
import { useConfig } from '../../providers/ConfigProvider';

function ViewUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  const {config} = useConfig();
  // const { isLoading, setIsLoading } = useLoading();

  useEffect(() => { 
    if (config) {
      setIsLoading(true);
      const fetchUser_ = async () => {
        const user = await fetchUser(config.id);
        setUser(user);
        updateTitle(user.thumb_url || '', user.name, user.email, false);
        setIsLoading(false);
      };
      fetchUser_();
    }
  }, [config]);

  const handleFabClick = async () => {
  };
  
  if (isLoading) return
  (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
      {/* <Dialog open={isLoading} /> */}
    </>
  );

  return (
    <Container style={{ overflow: 'auto', maxHeight: '100vh' }}>

      {/* Info Section */}
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.name}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {user.name}
        </Typography>
      </Box>

      {/* Text fields with optional visibility */}
      {user.address && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.address}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {user.address}
          </Typography>
        </Box>
      )}
      
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.region}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {user.region.friendly_name}
        </Typography>
      </Box>

      {user.phone && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.phone}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {user.phone}
          </Typography>
        </Box>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.email}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {user.email}
        </Typography>
      </Box>

      {user.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.notes}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {user.notes}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleFabClick}
        >
          <AddIcon />
        </Fab>
      </Box>

    </Container>
  );
}

export default ViewUser;