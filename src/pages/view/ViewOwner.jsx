import React, { useEffect, useState } from 'react';
import {
  SwipeableDrawer,
  Box,
  Typography,
  TextField,
  LinearProgress,
  Container,
  CircularProgress,
  Dialog,
  Fab,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { useTitle } from '../../providers/TitleProvider';
import { fetchOwner, formatCurrency } from '../../utils/lib';
import { strings } from "../../constants/strings"
import ListItemRectangle from '../../layouts/ListItemRectangle';
import { useParams } from "react-router-dom";

function ViewOwner() {

  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateTitle } = useTitle();

  useEffect(() => {

    setIsLoading(true);

    const fetchOwner_ = async () => {
      const owner = await fetchOwner(id, true);
      setOwner(owner);
      updateTitle(owner.thumb_url, owner.name, owner.email);
      
      setIsLoading(false);
    };
    fetchOwner_();

  }, [id]);

  const handleFabClick = async () => {
  };
  
  if (!owner) return (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
      <Dialog open={isLoading} />
    </>
  );

  return (
    <Container style={{ overflow: 'auto', maxHeight: '100vh' }}>

      {/* Debt Section */}
      {owner.balance && (     
        <Box
          style={{
            marginBottom: '8px',
            padding: '8px',
            background: '#fff',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
        >
          <Typography variant="caption" style={{ margin: '8px' }}>
            Deuda: {formatCurrency(owner.balance)}
          </Typography>
        </Box>
      )}

      {/* Pets Section */}
      <Box
        style={{
          marginBottom: '16px',
          padding: '8px',
          background: '#fff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          minHeight: '110px',
        }}
      >
        {owner.pets.length ? (
          <>
            <Typography variant="caption" style={{ margin: '8px' }}>
              Pacientes
            </Typography>
            <Box style={{ display: 'flex', gap: '8px' }}>
              {owner.pets.map(pet => (
                <ListItemRectangle
                  id={pet.id}
                  name={pet.name}
                  thumb_url={pet.thumb_url}
                />
              ))}
            </Box>
          </>
        ) 
        : 
        (
          <Typography variant="caption" style={{ margin: '8px' }}>
            No hay mascotas. Presiona + para crear
          </Typography>
        )}

        {/* <Typography variant="caption" style={{ marginBottom: '8px' }}>
          Title
        </Typography>
        <Box
          style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '8px 0',
          }}
        >
          <Box id="linear_pets" style={{ display: 'flex', gap: '8px' }}>
          </Box>
        </Box> */}

      </Box>

      {/* Info Section */}
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.name}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {owner.name}
        </Typography>
      </Box>

      {/* Text fields with optional visibility */}
      {owner.address && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.address}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {owner.address}
          </Typography>
        </Box>
      )}
      
      {owner.region && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.region}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {owner.region.friendly_name}
          </Typography>
        </Box>
      )}

      {owner.phone && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.phone}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {owner.phone}
          </Typography>
        </Box>
      )}

      {owner.email && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.email}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {owner.email}
          </Typography>
        </Box>
      )}

      {owner.regional_id && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.regional_id}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {owner.regional_id}
          </Typography>
        </Box>
      )}

      {owner.fiscal_type && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.fiscal_type}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {owner.fiscal_type.name}
          </Typography>
        </Box>
      )}

      {owner.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.notes}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {owner.notes}
          </Typography>
        </Box>
      )}

      {/* {isLoading && (
        <CircularProgress
          size={42}
          sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
        />
      )}
      <Dialog open={isLoading} /> */}

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

export default ViewOwner;

