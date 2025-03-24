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
  Tooltip,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../providers/SnackBarProvider';
import { useAppBar } from '../../providers/AppBarProvider';
import axios from 'axios';
import { handleError } from '../../utils/lib';

const ViewVetPoints = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle, toggleFab } = useAppBar();
  const [points, setPoints] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateTitle('', 'Emisión de comprobantes', 'Configuración de puntos de emisión de comprobantes');
    toggleFab(false);
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}vets?all_points`,
        { withCredentials: true }
      );
      setPoints(response.data.data || []);
    } catch (error) {
      handleError(error);
      snackbar('Error al cargar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (item) => {
    setIdToDelete(item.id);
    setDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    navigate('/main/edit-vet-point');
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}vets?delete_point&id=${idToDelete}`,
        { withCredentials: true }
      );
      setPoints(points.filter(s => s.id !== idToDelete));
      // snackbar('Punto de emisión eliminado exitosamente');
    } catch (error) {
      handleError(error);
      snackbar('Error al eliminar el punto de emisión');
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
          {points.map((point, index) => (
            <React.Fragment key={point.id}>
              <ListItem
                secondaryAction={
                  <Tooltip title="Eliminar punto de emisión">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleDelete(point)}
                      color="error"
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ paddingRight: "96px" }}
              >
                <ListItemText
                  primary={point.name}
                  secondary={`Número: ${point.number} | Tipo: ${point.type}`}
                />
              </ListItem>
              {index < points.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

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
            ¿Está seguro que desea eliminar este punto de emisión? Esta acción no se puede deshacer.
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

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            startIcon={<AddIcon />}
          >
            Crear punto de emisión
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ViewVetPoints; 