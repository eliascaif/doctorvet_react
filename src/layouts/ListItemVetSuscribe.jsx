import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Grid,
  IconButton,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const ListItemVetSuscribe = ({
  vet,
  associated,
  requested,
  onSuscribeClick,
  onCancelSuscribeClick,
}) => {
  return (
    <>
      <Box
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        {/* Thumbnail */}
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: 'grey.800',
            mr: 2,
          }}
          alt="Thumbnail"
          src={vet.thumb_url}
        >
          {!vet.thumb_url && <StoreIcon />}
        </Avatar>

        {/* Name, email, and region */}
        <Grid container spacing={2} alignItems="center">
          <Grid 
            item 
            xs
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            >
              <Typography variant="subtitle1" noWrap>
                {vet.name}
              </Typography>
              <Typography variant="caption" noWrap>
                {vet.email}
              </Typography>
              <Typography variant="caption" noWrap>
                {vet.region.friendly_name}
              </Typography>
          </Grid>

          {/* Estado */}
          {requested === 1 &&
            <Grid item>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Solicitud pendiente
              </Typography>
            </Grid>
          }

          {associated === 1 &&
            <Grid item>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Asociado
              </Typography>
            </Grid>
          }

          {/* Aceptar y cancelar botones */}
          <Grid item>
            {associated === 0 && requested === 0 &&
              <IconButton
                aria-label="Suscribir"
                color="success"
                onClick={() => onSuscribeClick(vet)}
              >
                <CheckCircleOutlineIcon />
              </IconButton>
            }
            {requested === 1 &&
              <IconButton
                aria-label="Cancelar"
                color="error"
                onClick={() => onCancelSuscribeClick(vet)}
              >
                <CancelIcon />
              </IconButton>
            }
          </Grid>
        </Grid>
      </Box>

      {/* Divider */}
      <Divider />
    </>
  );
};

export default ListItemVetSuscribe;
