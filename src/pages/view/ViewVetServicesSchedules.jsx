import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  useTheme,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useSnackbar } from '../../providers/SnackBarProvider';
import { useAppBar } from '../../providers/AppBarProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError } from '../../utils/lib';

const ViewVetServicesSchedules = () => {
  const theme = useTheme();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { updateTitle, toggleFab } = useAppBar();
  const [servicesSchedules, setServicesSchedules] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const translateWeekday = (weekday) => {
    const translations = {
      'MONDAY': 'Lunes',
      'TUESDAY': 'Martes',
      'WEDNESDAY': 'Miércoles',
      'THURSDAY': 'Jueves',
      'FRIDAY': 'Viernes',
      'SATURDAY': 'Sábado',
      'SUNDAY': 'Domingo'
    };
    return translations[weekday] || weekday;
  };

  useEffect(() => {
    updateTitle('', 'Servicios y Horarios');
    toggleFab(false);
    fetchServicesSchedules();

    return () => {
      toggleFab(true);
    };
  }, []);

  const fetchServicesSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}vets?schedules`,
        { withCredentials: true }
      );
      setServicesSchedules(response.data.data || []);
      //console.log(response.data.data);
    } catch (error) {
      handleError(error);
      snackbar('Error al cargar los servicios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (item) => {
    setIdToDelete(item.id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}vets?delete_schedule&id=${idToDelete}`,
        { withCredentials: true }
      );
      setServicesSchedules(servicesSchedules.filter(s => s.id !== idToDelete));
      snackbar('Servicio eliminado exitosamente');
    } catch (error) {
      handleError(error);
      snackbar('Error al eliminar el servicio');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <List>
          {servicesSchedules.map((service, index) => (
            <React.Fragment key={service.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <>
                      {service.service.name}
                      {service.starting_hour && service.ending_hour && (
                        <> - {translateWeekday(service.weekday)} de {service.starting_hour} a {service.ending_hour}</>
                      )}
                      {service.user && <> - {service.user.name}</>}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleDelete(service)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {index < servicesSchedules.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/main/edit-vet-service-assoc')}
          >
            Editar servicios
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/main/edit-vet-schedule')}
          >
            Crear horario
          </Button>
        </Stack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Confirmar eliminación?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro que desea eliminar este servicio? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus disabled={loading}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewVetServicesSchedules;
