import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Fab,
  CircularProgress,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AddIcon from "@mui/icons-material/Add";
import { fetchPetsDashboard } from '../utils/lib';
import PetsRecentList from '../layouts/PetsRecentList';
import WaitingRoomsList from '../layouts/WaitingRoomsList';
import AgendaList from '../layouts/AgendaList';
import { useAppBar } from '../providers/AppBarProvider';
import { useConfig } from '../providers/ConfigProvider';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../providers/LoadingProvider';
import axios from 'axios';

function MainPets() {
  const [lastMovements, setLastMovements] = useState([]);
  const [waitingRooms, setWaitingRooms] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postponeDialog, setPostponeDialog] = useState({
    open: false,
    selectedDate: null,
    item: null
  });
  const [completeDialog, setCompleteDialog] = useState({
    open: false,
    item: null
  });

  const navigate = useNavigate();
  const {updateTitle} = useAppBar();
  const {config, isLoadingConfig} = useConfig();

  useEffect(() => {
    const fetchPetsDashboard_ = async () => {
      const response = await fetchPetsDashboard();
      setLastMovements(response.last_movements);
      setWaitingRooms(response.in_waiting_rooms);
      setAgendaItems(response.in_agenda);
      updateTitle(undefined, config.vet.pet_naming_es_plural);
      setIsLoading(false);
    };
    fetchPetsDashboard_();
  }, []);

  const onClick = (pet) => {
    navigate('/main/view-pet', { state: { id: pet.id, updateLastView: false } });
  }

  const handleWaitingRoomComplete = async (room) => {
    try {
      await axios.put(`/api/waiting-room/${room.id}/complete`);
      // Actualizar la lista después de completar
      setWaitingRooms(waitingRooms.filter(r => r.id !== room.id));
    } catch (error) {
      console.error('Error al marcar como atendido:', error);
    }
  };

  const handleWaitingRoomDelete = async (room) => {
    try {
      await axios.delete(`/api/waiting-room/${room.id}`);
      // Actualizar la lista después de eliminar
      setWaitingRooms(waitingRooms.filter(r => r.id !== room.id));
    } catch (error) {
      console.error('Error al eliminar de la sala de espera:', error);
    }
  };

  const handleAgendaCompleteOpen = (item) => {
    setCompleteDialog({
      open: true,
      item: item
    });
  };

  const handleAgendaCompleteClose = () => {
    setCompleteDialog({
      open: false,
      item: null
    });
  };

  const handleAgendaComplete = async () => {
    try {
      const { item } = completeDialog;

      let response = await axios.put(
        `${import.meta.env.VITE_API_URL}agenda?id=${item.id}&set_executed`,
        {},
        { withCredentials: true }
      );

      // Actualizar la lista después de completar
      setAgendaItems(agendaItems.filter(a => a.id !== item.id));
      handleAgendaCompleteClose();
    } catch (error) {
      console.error('Error al marcar como completada la tarea:', error);
    }
  };

  const handlePostponeOpen = (item) => {
    setPostponeDialog({
      open: true,
      selectedDate: dayjs().add(1, 'day'),
      item: item
    });
  };

  const handlePostponeClose = () => {
    setPostponeDialog({
      open: false,
      selectedDate: null,
      item: null
    });
  };

  const handlePostponeConfirm = async () => {
    try {
      const { item, selectedDate } = postponeDialog;
      
      // Mantener la hora original del item
      const originalTime = dayjs(item.begin_time);
      const newDateTime = selectedDate
        .hour(originalTime.hour())
        .minute(originalTime.minute())
        .second(originalTime.second());

      await axios.put(
        `${import.meta.env.VITE_API_URL}agenda?id=${item.id}&reschedule&begin_time=${newDateTime.format('YYYY-MM-DD HH:mm:ss')}`,
        {},
        { withCredentials: true }
      );

      // Actualizar la lista después de posponer
      setAgendaItems(agendaItems.filter(a => a.id !== item.id));
      handlePostponeClose();
    } catch (error) {
      console.error('Error al posponer la tarea:', error);
    }
  };

  if (isLoading || isLoadingConfig) return (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
    </>
  );
  
  if (lastMovements.length === 0 && waitingRooms.length === 0 && agendaItems.length === 0) return (
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
    <Container maxWidth="lg">
      {waitingRooms.length > 0 && (
        <WaitingRoomsList
          waitingRooms={waitingRooms}
          onClick={onClick}
          onComplete={handleWaitingRoomComplete}
          onDelete={handleWaitingRoomDelete}
        />
      )}
      
      {agendaItems.length > 0 && (
        <AgendaList
          agendaItems={agendaItems}
          onClick={onClick}
          onPostpone={handlePostponeOpen}
          onComplete={handleAgendaCompleteOpen}
        />
      )}

      {lastMovements.length > 0 && (
        <PetsRecentList
          pets={lastMovements}
          onClick={onClick}
          isMultiUser={config.vet.multiuser}
        />
      )}

      <Dialog 
        open={postponeDialog.open} 
        onClose={handlePostponeClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Posponer tarea</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={postponeDialog.selectedDate}
              onChange={(newDate) => setPostponeDialog(prev => ({
                ...prev,
                selectedDate: newDate
              }))}
              minDate={dayjs().add(1, 'day')}
              disablePast
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePostponeClose}>Cancelar</Button>
          <Button onClick={handlePostponeConfirm} variant="contained" color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={completeDialog.open}
        onClose={handleAgendaCompleteClose}
        maxWidth="xs"
        fullWidth
      >
        {/* <DialogTitle>Confirmar tarea completada</DialogTitle> */}
        <DialogTitle>¿Marcar como realizado?</DialogTitle>

        {/* <DialogContent>
          <Typography>
            ¿Está seguro que desea marcar esta tarea como completada?
          </Typography>
          {completeDialog.item && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {`${completeDialog.item.event_name} - ${completeDialog.item.pet.name}`}
            </Typography>
          )}
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleAgendaCompleteClose}>Cancelar</Button>
          <Button onClick={handleAgendaComplete} variant="contained" color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MainPets;

