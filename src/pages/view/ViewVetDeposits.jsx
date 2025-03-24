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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../providers/SnackBarProvider';
import { useAppBar } from '../../providers/AppBarProvider';
import axios from 'axios';
import { handleError } from '../../utils/lib';

const ViewVetDeposits = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle, toggleFab } = useAppBar();
  const [deposits, setDeposits] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateTitle('', 'Almacenes', 'Configuración de almacenes');
    toggleFab(false);
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}vets?deposits`,
        { withCredentials: true }
      );
      setDeposits(response.data.data || []);
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

  const handleEdit = (item) => {
    navigate('/main/edit-vet-deposit', { state: { updateDeposit: item } });
  };

  const handleCreate = () => {
    navigate('/main/edit-vet-deposit');
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}vets?delete_deposit&id=${idToDelete}`,
        { withCredentials: true }
      );
      setDeposits(deposits.filter(s => s.id !== idToDelete));
    } catch (error) {
      handleError(error);
      snackbar('Error al eliminar el almacén');
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
          {deposits.map((deposit, index) => (
            <React.Fragment key={deposit.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <Tooltip title="Editar almacén">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleEdit(deposit)}
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar almacén">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => handleDelete(deposit)}
                        color="error"
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                sx={{ paddingRight: "144px" }}
              >
                <ListItemText
                  primary={deposit.name}
                  secondary={deposit.is_central ? "Central" : ""}
                />
              </ListItem>
              {index < deposits.length - 1 && <Divider />}
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
            ¿Está seguro que desea eliminar este almacén? Esta acción no se puede deshacer.
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
            Crear almacén
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default ViewVetDeposits; 