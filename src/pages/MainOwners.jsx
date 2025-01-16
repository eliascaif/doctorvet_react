import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Fab,
  CircularProgress,
  Typography,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { fetchRecent } from '../utils/lib';
import OwnersRecentList from '../layouts/OwnersRecentList';
import { useAppBar } from '../providers/AppBarProvider';
import { useConfig } from '../providers/ConfigProvider';
import { useNavigate } from 'react-router-dom';

function MainOwners() {

  const [page, setPage] = useState(1);
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {updateTitle} = useAppBar();
  const {config, isLoadingConfig} = useConfig();

  useEffect(() => {
    const fetchOwnersRecent = async () => {
      setIsLoading(true);
      const owners = await fetchRecent(page, 'owners');
      setOwners(owners);
      updateTitle(undefined, config.vet.owner_naming_es_plural);
      setIsLoading(false);
    };
    fetchOwnersRecent();
  }, []);

  const handleFabClick = async () => {
  };
  
  const onClick = (owner) => {
    navigate('/main/view-owner', { state: { id: owner.id, updateLastView: false } });
  }
  const onPetClick = (event, pet) => {
    event.stopPropagation()
    navigate('/main/view-pet', { state: { id: pet.id, updateLastView: false } });
  }

  if (isLoading || isLoadingConfig) return (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
    </>
  );

  if (owners.length == 0) return (
    <Container style={{ overflow: 'auto', maxHeight: '100vh' }}>
      <Typography
        variant="subtitle1"
        >
          No hay nada aquí. Presiona + para crear o buscar.
      </Typography>
    </Container>
  );

  return (
    <Container style={{ overflow: 'auto', maxHeight: '100vh' }}>

      <OwnersRecentList
        owners={owners}
        onClick={onClick}
        onPetClick={onPetClick}
        isMultiUser={config.vet.multiuser}
      />

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

export default MainOwners;

