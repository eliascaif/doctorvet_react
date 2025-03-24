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
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchPet, formatCurrency, formatHour, getSupplyStr, formatDateLong, getReasonStr, formatDate } from '../../utils/lib';
import { strings } from "../../constants/strings"
import ListItemRectangle from '../../layouts/ListItemRectangle';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../../providers/ConfigProvider';
import ViewPetInfo from './ViewPetInfo';
import ViewPetClinic from './ViewPetClinic';
import axios from 'axios';

function ViewPet() {
  const location = useLocation();
  const [id, setId] = useState(location.state?.id);
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  const [activeTab, setActiveTab] = useState(0);
  const { config } = useConfig();
  const [postponeDialog, setPostponeDialog] = useState({
    open: false,
    selectedDate: null,
    item: null
  });
  const [completeDialog, setCompleteDialog] = useState({
    open: false,
    item: null
  });

  useEffect(() => {
    const fetchPet_ = async () => {
      const pet = await fetchPet(id, location.state?.updateLastView || false);
      setPet(pet);
      updateTitle(pet.thumb_url || '', pet.name, pet.owners_es);
      setIsLoading(false);
    };
    fetchPet_();
  }, [id]);

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
      
      // Actualizar el pet después de posponer
      const updatedPet = await fetchPet(id, false);
      setPet(updatedPet);
      handlePostponeClose();
    } catch (error) {
      console.error('Error al posponer la tarea:', error);
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

      // Actualizar el pet después de completar
      const updatedPet = await fetchPet(id, false);
      setPet(updatedPet);
      handleAgendaCompleteClose();
    } catch (error) {
      console.error('Error al marcar como completada la tarea:', error);
    }
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
    </>
  );

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ width: '100%', mt: 0 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="inherit"
          indicatorColor="primary"
          sx={{ minHeight: '48px' }}
        >
          <Tab label={config.vet.pet_naming_es} sx={{ minHeight: '48px' }} />
          <Tab label="CLÍNICA" sx={{ minHeight: '48px' }} />
          <Tab label="SUMINISTRO" sx={{ minHeight: '48px' }} />
        </Tabs>

        {activeTab === 0 && (
          <Box sx={{ px: 1 }}>
            <ViewPetInfo
              pet={pet}
              onPostpone={handlePostponeOpen}
              onComplete={handleAgendaCompleteOpen}
            />
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ px: 1 }}>
            <ViewPetClinic
              pet={pet}
            />
          </Box>
        )}
        {activeTab === 2 && (
          <Box sx={{ p: 1 }}>
            <Typography variant="body1">Contenido de Tab 3</Typography>
          </Box>
        )}
      </Box>

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
        <DialogTitle>¿Marcar como realizado?</DialogTitle>
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

export default ViewPet;

