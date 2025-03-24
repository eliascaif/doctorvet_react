import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Fab,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchById } from '../../utils/lib';
import { strings } from "../../constants/strings"
import { useLoading } from '../../providers/LoadingProvider';
import { useLocation } from 'react-router-dom';

function ViewManufacturer() {
  const location = useLocation();
  const [id, setId] = useState(location.state.id);
  const [manufacturer, setManufacturer] = useState(null);
  const {updateTitle} = useAppBar();
  //const { isLoading, setIsLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { 
    setIsLoading(true);
    const fetchManufacturer_ = async () => {
      const manufacturer = await fetchById(id, 'products_manufacturers');
      setManufacturer(manufacturer);
      updateTitle(manufacturer.thumb_url || '', manufacturer.name, manufacturer.email);
      setIsLoading(false);
    };
    fetchManufacturer_();
  }, []);

  const handleFabClick = async () => {
  };
  
  if (isLoading) return
  (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
    </>
  );

  return (
    <Container maxWidth="xl" style={{ overflow: 'auto', maxHeight: '100vh' }}>

      {/* Info Section */}
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.name}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {manufacturer.name}
        </Typography>
      </Box>

      {/* Text fields with optional visibility */}
      {manufacturer.address && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.address}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {manufacturer.address}
          </Typography>
        </Box>
      )}
      
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.region}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {manufacturer.region.friendly_name}
        </Typography>
      </Box>

      {manufacturer.phone && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.phone}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {manufacturer.phone}
          </Typography>
        </Box>
      )}

      {manufacturer.email && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.email}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {manufacturer.email}
          </Typography>
        </Box>
      )}

      {manufacturer.web_page && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.web_page}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {manufacturer.web_page}
          </Typography>
        </Box>
      )}

      {manufacturer.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.notes}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {manufacturer.notes}
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

export default ViewManufacturer;