import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

// Hook personalizado
const useConfirmDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    question: '',
    resolve: null,
  });

  const showDialog = useCallback((question) => {
    return new Promise((resolve) => {
      setDialogConfig({ question, resolve });
      setDialogOpen(true);
    });
  }, []);

  const ConfirmDialog = () => (
    <Dialog open={dialogOpen} onClose={() => dialogConfig.resolve(false)}>
      <DialogTitle>Confirmación</DialogTitle>
      <DialogContent>
        <Typography>{dialogConfig.question}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDialogOpen(false);
            dialogConfig.resolve(false);
          }}
          color="primary"
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            setDialogOpen(false);
            dialogConfig.resolve(true);
          }}
          color="primary"
          variant="contained"
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { showDialog, ConfirmDialog };
};

export default useConfirmDialog;
