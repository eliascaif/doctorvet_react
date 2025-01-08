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

function ViewPetInfo({ pet }) {

  //const location = useLocation();
  // const [id, setId] = useState(location.state.id);
  // const [pet, setPet] = useState(pet);
  const [petStates, setPetStates] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // const {updateTitle} = useAppBar();

  //const { config } = useConfig();

  useEffect(() => {
  //   const fetchPet_ = async () => {
  //     const pet = await fetchPet(id, !!location.state.updateLastView);
  //     //console.log(pet);
  //     setPet(pet);
  //     updateTitle(pet.thumb_url || '', pet.name, pet.owners_es);

      //pet states
      if (
        pet.states_pet.is_birthday || 
        pet.states_pet.supply != 'NA' || 
        pet.states_pet.appointments_tasks.lenght > 0 ||
        pet.states_pet.hasOwnProperty('last_visit') ||
        pet.death == 1 ||
        pet.waiting_room == 1 ||
        pet.states_pet.hasOwnProperty('last_food') ||
        pet.states_pet.hasOwnProperty('food_level') ||
        pet.states_pet.hasOwnProperty('age')
      )
        setPetStates(true);

      //owner debt
      if (pet.owners.some(owner => owner.balance > 0))
        setPetStates(true);

  //     setIsLoading(false);
  //   };
  //   fetchPet_();
  }, []);

  // const handleFabClick = async () => {
  // };
  
  // if (!id) return (
  //   <Typography variant="caption" style={{ margin: '8px' }}>
  //     No hay id
  //   </Typography>
  // );

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
    <Container sx={{ mt: 4 }} >

      {/* Pet states Section */}
      {petStates && (     
        <Box
          style={{
            marginBottom: '8px',
            padding: '8px',
            background: '#fff',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {pet.death === 1 &&
            <Typography variant="caption">
              Deceso
            </Typography>
          }
          {pet.waiting_room &&
            <Typography variant="caption">
              En sala de espera
            </Typography>
          }
          {pet.owners
            .filter(owner => owner.balance > 0)
            .map(owner => (
              <Typography 
                key={owner.id}
                variant="caption">
                {`Deuda: ${formatCurrency(owner.balance)}`}
              </Typography>
            ))
          }
          {pet.states_pet.appointments_tasks.map(agenda => (
            <Typography 
              key={agenda.id}
              variant="caption">
              {`Agenda: ${agenda.event_name} ${formatHour(agenda.begin_time)}`}
            </Typography>
          ))}
          {pet.states_pet.supply != 'NA' &&
            <Typography variant="caption">
              {getSupplyStr(pet.states_pet.supply)}
            </Typography>
          }
          {pet.states_pet.is_birthday === 1 &&
            <Typography variant="caption">
              Hoy cumple años
            </Typography>
          }
          {pet.states_pet.hasOwnProperty('last_visit') &&
            <Typography variant="caption">
              {`Última visita: 
              ${formatDateLong(pet.states_pet.last_visit.date)}. 
              ${getReasonStr(pet.states_pet.last_visit.reason)}. 
              ${pet.states_pet.last_visit.user_name}.`}
            </Typography>
          }
          {pet.states_pet.hasOwnProperty('last_food') &&
            <Typography variant="caption">
              {`Último alimento: 
              ${pet.states_pet.last_food.product_name} el  
              ${formatDate(pet.states_pet.last_food.date)}`}
            </Typography>
          }
          {pet.states_pet.hasOwnProperty('food_level') &&
            <Typography variant="caption">
              {`Nivel alimento: ${pet.states_pet.food_level}/100.`}
            </Typography>
          }
          {pet.states_pet.hasOwnProperty('age') &&
            <Typography variant="caption">
              {`Edad: ${pet.states_pet.age}`}
            </Typography>
          }
        </Box>
      )}

      {/* Owners Section */}
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
        <Typography variant="caption" style={{ margin: '8px' }}>
          Propietarios
        </Typography>
        <Box style={{ display: 'flex', gap: '8px' }}>
          {pet.owners.map(owner => (
            <ListItemRectangle
              key={owner.id}
              id={owner.id}
              name={owner.name}
              thumb_url={owner.thumb_url}
              email={owner.email}
            />
          ))}
        </Box>
      </Box>

      {/* Info Section */}
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.name}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {pet.name}
        </Typography>
      </Box>

      {/* Text fields with optional visibility */}
      {pet.race && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.race}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.race.name}
          </Typography>
        </Box>
      )}
      
      {pet.pelage && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.pelage}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.pelage.name}
          </Typography>
        </Box>
      )}

      {pet.gender && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.gender}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.gender.name}
          </Typography>
        </Box>
      )}

      {pet.character && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.character}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.character.name}
          </Typography>
        </Box>
      )}

      {pet.birthday && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.birthday}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.birthday}
          </Typography>
        </Box>
      )}

      {pet.weight && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.weight}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.weight}
          </Typography>
        </Box>
      )}

      {pet.chip && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.chip}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.chip}
          </Typography>
        </Box>
      )}

      {pet.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.notes}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {pet.notes}
          </Typography>
        </Box>
      )}

    </Container>
  );
}

export default ViewPetInfo;

