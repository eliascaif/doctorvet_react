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
import PetsRecentList from '../layouts/PetsRecentList';
import { useAppBar } from '../providers/AppBarProvider';
import { useConfig } from '../providers/ConfigProvider';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../providers/LoadingProvider';

function MainPets() {

  const [page, setPage] = useState(1);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const {isLoading, setIsLoading} = useLoading();

  const navigate = useNavigate();
  const {updateTitle} = useAppBar();
  const {config, isLoadingConfig} = useConfig();

  useEffect(() => {
    const fetchPetsRecent = async () => {
      const pets = await fetchRecent(page, 'pets');
      setPets(pets);
      updateTitle(undefined, config.vet.pet_naming_es_plural);
      setIsLoading(false);
    };
    fetchPetsRecent();
  }, []);

  const handleFabClick = async () => {
  };
  
  const onClick = (pet) => {
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
  
  if (pets.length == 0) return (
    <Container style={{ overflow: 'auto', maxHeight: '100vh' }}>
      <Box>
        <Typography
          variant="subtitle1"
          >
            No hay nada aquí. Presiona + para crear o buscar.
        </Typography>
      </Box>
    </Container>
  );

  return (
    <Container style={{ overflow: 'auto', maxHeight: '100vh' }}>

      <PetsRecentList
        pets={pets}
        onClick={onClick}
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

export default MainPets;

