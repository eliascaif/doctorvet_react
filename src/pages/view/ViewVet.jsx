import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  Fab,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchById, formatDate } from '../../utils/lib';
import { strings } from "../../constants/strings"
import { useConfig } from '../../providers/ConfigProvider';
import { useLoading } from '../../providers/LoadingProvider';
import EditIcon from "@mui/icons-material/Edit";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import GroupIcon from "@mui/icons-material/Group";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from 'react-router-dom';
import BottomSheet2 from '../../layouts/BottomSheet2';

function ViewVet() {
  const [vet, setVet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  const {config} = useConfig();
  const navigate = useNavigate();

  useEffect(() => { 
    if (config) {
      setIsLoading(true);
      const fetchVet_ = async () => {
        const vet = await fetchById(config.vet.id, 'vets');
        setVet(vet);
        updateTitle(vet.thumb_url || '', vet.name, vet.email);
        setIsLoading(false);
      };
      fetchVet_();
    }
  }, [config]);
  
  if (isLoading) return
  (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
    </>
  );

  const handleEdit = () => {
    navigate('/edit-vet', { state: { updateVet: vet } });
  };

  const handleServices = () => {
    navigate('/main/view-vet-services-schedules');
  };

  const handleUsers = () => {
    navigate('/main/view-vet-users');
  };

  const handleCreateBranch = () => {
    navigate('/edit-vet', { state: { isBranch: true } });
  };

  const handleReceipts = () => {
    navigate('/main/view-vet-points', { state: { vet } });
  };

  const handleWarehouses = () => {
    navigate('/main/view-vet-deposits', { state: { vet } });
  };

  const handleBilling = () => {
    navigate('/main/billing', { state: { vet } });
  };

  return (
    <Container
      maxWidth="xl"  
      style={{ overflow: 'auto', maxHeight: '100vh' }}>

      {/* Info Section */}
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.name}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {vet.name}
        </Typography>
      </Box>

      {/* Text fields with optional visibility */}
      {vet.address && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.address}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.address}
          </Typography>
        </Box>
      )}
      
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.region}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {vet.region.friendly_name}
        </Typography>
      </Box>

      {vet.phone && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.phone}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.phone}
          </Typography>
        </Box>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.email}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {vet.email}
        </Typography>
      </Box>

      {vet.web_page && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.web_page}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.web_page}
          </Typography>
        </Box>
      )}

      {vet.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.notes}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {vet.notes}
          </Typography>
        </Box>
      )}

      {/* {vet.subscription_until && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.subscription_until}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {formatDate(vet.subscription_until)}
          </Typography>
        </Box>
      )} */}

      <BottomSheet2 
        zIndex={1001}
        buttonGroups={[
          {
            label: "Veterinaria", 
            buttons: [
              {
                label: "Editar",
                action: handleEdit,
                icon: <EditIcon />
              },
              {
                label: "Servicios y horarios",
                action: handleServices,
                icon: <DesignServicesIcon />
              },
              {
                label: "Usuarios",
                action: handleUsers,
                icon: <GroupIcon />
              },
              {
                label: "Crear sucursal",
                action: handleCreateBranch,
                icon: <StorefrontIcon />
              },
              {
                label: "Comprobantes",
                action: handleReceipts,
                icon: <PointOfSaleIcon />
              },
              {
                label: "Almacenes",
                action: handleWarehouses,
                icon: <WarehouseIcon />
              },
              // {
              //   label: "Facturación electrónica",
              //   action: handleBilling,
              //   icon: <AttachMoneyIcon />
              // }
            ]
          },
        ]}
      />

    </Container>
  );
}

export default ViewVet;