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

function ViewCashMovement() {

  const location = useLocation();
  const [id, setId] = useState(location.state.id);
  const [obj, setObj] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  
  useEffect(() => { 
    setIsLoading(true);
    const fetchObj_ = async () => {
      const obj = await fetchById(id, 'cash_movements');
      setObj(obj);
      updateTitle(undefined, "Movimiento manual");
      setIsLoading(false);
    };
    fetchObj_();
  }, []);

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

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Fecha'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {formatDateHour(obj.date)}
        </Typography>
      </Box>
      
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Usuario'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {obj.user.name}
        </Typography>
      </Box>

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Total'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {obj.amount}
        </Typography>
      </Box>

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Tipo'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {obj.type == 'MANUAL_CASH_IN' ? 'Ingreso' : 'Egreso'}
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

export default ViewCashMovement;