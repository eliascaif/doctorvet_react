import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  Fab,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchPet, formatCurrency, formatHour, getSupplyStr, formatDateLong, getReasonStr, formatDate } from '../../utils/lib';
import { strings } from "../../constants/strings"
import ListItemRectangle from '../../layouts/ListItemRectangle';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../../providers/ConfigProvider';
import ViewPetInfo from './ViewPetInfo';
import ViewPetClinic from './ViewPetClinic';

function ViewPet() {

  const location = useLocation();
  const [id, setId] = useState(location.state.id);
  const [pet, setPet] = useState(null);
  // const [petStates, setPetStates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  const [activeTab, setActiveTab] = useState(0);
  const { config } = useConfig();

  useEffect(() => {
    const fetchPet_ = async () => {
      const pet = await fetchPet(id, !!location.state.updateLastView);
      setPet(pet);
      updateTitle(pet.thumb_url || '', pet.name, pet.owners_es);

      //pet states
      // if (
      //   pet.states_pet.is_birthday || 
      //   pet.states_pet.supply != 'NA' || 
      //   pet.states_pet.appointments_tasks.lenght > 0 ||
      //   pet.states_pet.hasOwnProperty('last_visit') ||
      //   pet.death == 1 ||
      //   pet.waiting_room == 1 ||
      //   pet.states_pet.hasOwnProperty('last_food') ||
      //   pet.states_pet.hasOwnProperty('food_level') ||
      //   pet.states_pet.hasOwnProperty('age')
      // )
      //   setPetStates(true);

      //owner debt
      // if (pet.owners.some(owner => owner.balance > 0))
      //   setPetStates(true);

      setIsLoading(false);
    };
    fetchPet_();
  }, []);

  const handleFabClick = async () => {
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!id) return (
    <Typography variant="caption" style={{ margin: '8px' }}>
      No hay id
    </Typography>
  );

  if (!pet) return (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
      {/* <Dialog open={isLoading} /> */}
    </>
  );

  return (
    // style={{ overflow: 'auto', maxHeight: '100vh' }}
    <Container >

      {/* sx={{ borderBottom: 1, borderColor: 'divider', mt: 8 }} */}
      <Box sx={{ width: '100%' }}>
        {/* Contenedor de Tabs */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth" // Asegura que los tabs ocupen todo el ancho
          textColor="inherit"
          indicatorColor="primary"
          >
          <Tab label={config.vet.pet_naming_es} />
          <Tab label="CLÍNICA" />
          <Tab label="SUMINISTRO" />
        </Tabs>

        {/* Contenido de las Tabs */}
        {activeTab === 0 && (
          <ViewPetInfo
            pet={pet}
          />
        )}
        {activeTab === 1 && (
          <ViewPetClinic
            pet={pet}
          />
        )}
        {activeTab === 2 && (
          <Box p={2}>
            <Typography variant="body1">Contenido de Tab 3</Typography>
          </Box>
        )}
      </Box>

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

export default ViewPet;

