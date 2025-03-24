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
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSnackbar } from '../../providers/SnackBarProvider';
import { useAppBar } from '../../providers/AppBarProvider';
import { useConfig } from '../../providers/ConfigProvider';
import axios from 'axios';
import { handleError } from '../../utils/lib';
import ListItemWAvatarRemove from '../../layouts/ListItemWAvatarRemove';

const ViewVetUsers = () => {
  const theme = useTheme();
  const snackbar = useSnackbar();
  const { updateTitle, toggleFab } = useAppBar();
  const { config, isLoadingConfig } = useConfig();
  const [users, setUsers] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateTitle('', 'Usuarios y roles');
    toggleFab(false);
    fetchUsers();

    return () => {
      toggleFab(true);
    };
  }, []);

  useEffect(() => {
    if (!isLoadingConfig && config) {
      console.log('Config completa:', config);
      console.log('ID del usuario actual:', config.id);
    }
  }, [isLoadingConfig, config]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}users?min`,
        { withCredentials: true }
      );
      setUsers(response.data.data || []);
    } catch (error) {
      handleError(error);
      snackbar('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (item) => {
    setIdToDelete(item.id);
    setDeleteDialogOpen(true);
  };

  const handlePromote = async (user) => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}vets?promote_user&id=${user.id}`,
        {},
        { withCredentials: true }
      );
      fetchUsers(); // Recargar la lista para actualizar roles
      snackbar('Usuario promovido exitosamente');
    } catch (error) {
      handleError(error);
      snackbar('Error al promover el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDemote = async (user) => {
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}vets?demote_user&id=${user.id}`,
        {},
        { withCredentials: true }
      );
      fetchUsers(); // Recargar la lista para actualizar roles
      snackbar('Usuario degradado exitosamente');
    } catch (error) {
      handleError(error);
      snackbar('Error al degradar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}vets?delete_user&id=${idToDelete}`,
        { withCredentials: true }
      );
      setUsers(users.filter(s => s.id !== idToDelete));
      snackbar('Usuario eliminado exitosamente');
    } catch (error) {
      handleError(error);
      snackbar('Error al eliminar el usuario');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  const isCurrentUser = (userId) => {
    console.log('Comparando userId:', userId, 'con config.id:', config?.id);
    return userId === config?.id;
  };

  if (isLoading || isLoadingConfig) {
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
          {users.map((user, index) => (
            <React.Fragment key={user.id}>
              <ListItem
                secondaryAction={
                  !isCurrentUser(user.id) && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Promover usuario">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handlePromote(user)}
                          disabled={loading}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Degradar usuario">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDemote(user)}
                          disabled={loading}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar usuario">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDelete(user)}
                          color="error"
                          disabled={loading}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )
                }
                sx={{ paddingRight: isCurrentUser(user.id) ? "16px" : "224px" }}
              >
                <ListItemWAvatarRemove
                  primary={user.name}
                  secondary={user.email}
                  secondary2={user.role?.name || 'Sin rol asignado'}
                  avatarContent={<PersonIcon />}
                  thumbUrl={user.thumb_url}
                />
              </ListItem>
              {index < users.length - 1 && <Divider />}
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
            ¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.
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

export default ViewVetUsers; 