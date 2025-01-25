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
import { fetchById, formatDateHour } from '../../utils/lib';
import { strings } from "../../constants/strings"
import { useConfig } from '../../providers/ConfigProvider';

function ViewAgendaEvent() {

  const location = useLocation();
  const [id, setId] = useState(location.state.id);
  const [agendaEvent, setAgendaEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  const {config} = useConfig();

  useEffect(() => { 
    if (config) {
      setIsLoading(true);
      const fetchAgendaEvent_ = async () => {
        const agendaEvent = await fetchById(id, 'agenda');
        setAgendaEvent(agendaEvent);
        updateTitle(undefined, agendaEvent.name);
        setIsLoading(false);
      };
      fetchAgendaEvent_();
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
    </>
  );

  return (
    <Container>

      {agendaEvent.pet && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{config.vet.pet_naming_es}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {agendaEvent.pet.name}
          </Typography>
        </Box>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Servicio / Nombre del evento'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {agendaEvent.event_name}
        </Typography>
      </Box>
      
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Fecha de inicio'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {formatDateHour(agendaEvent.begin_time)}
        </Typography>
      </Box>

      {agendaEvent.end_time && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Fecha de finalización'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {formatDateHour(agendaEvent.end_time)}
          </Typography>
        </Box>
      )}

      {eventName.description && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Descripción'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {eventName.description}
          </Typography>
        </Box>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Usuario'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {eventName.user.name}
        </Typography>
      </Box>

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Estado'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {user.executed === 1 ? 'Realizado' : 'No realizado' }
        </Typography>
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

export default ViewAgendaEvent;