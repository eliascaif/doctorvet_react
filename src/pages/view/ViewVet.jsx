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
import { fetchVet, formatDate } from '../../utils/lib';
import { strings } from "../../constants/strings"
import { useConfig } from '../../providers/ConfigProvider';
import { useLoading } from '../../providers/LoadingProvider';

function ViewVet() {
  const [vet, setVet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  const {config} = useConfig();
  // const { isLoading, setIsLoading } = useLoading();

  useEffect(() => { 
    if (config) {
      setIsLoading(true);
      const fetchVet_ = async () => {
        const vet = await fetchVet(config.vet.id);
        setVet(vet);
        updateTitle(vet.thumb_url || '', vet.name, vet.email);
        setIsLoading(false);
      };
      fetchVet_();
    }
  }, [config]);

  const handleFabClick = async () => {
  };
  
  // if (isLoading || !config || !vet) return
  // (
  //   <>
  //     <CircularProgress
  //       size={42}
  //       sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
  //     />
  //     <Dialog open={isLoading} />
  //   </>
  // );
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
          {vet.name}
        </Typography>
      </Box>

      {/* Text fields with optional visibility */}
      {vet.address && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.address}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.address}
          </Typography>
        </Box>
      )}
      
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.region}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {vet.region.friendly_name}
        </Typography>
      </Box>

      {vet.phone && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.phone}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.phone}
          </Typography>
        </Box>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.email}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {vet.email}
        </Typography>
      </Box>

      {vet.web_page && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.web_page}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.web_page}
          </Typography>
        </Box>
      )}

      {vet.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.notes}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.notes}
          </Typography>
        </Box>
      )}

      {vet.subscription_until && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.subscription_until}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {formatDate(vet.subscription_until)}
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

export default ViewVet;