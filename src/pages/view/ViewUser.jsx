import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  Fab,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchById, formatDate } from '../../utils/lib';
import { strings } from "../../constants/strings"
import { useConfig } from '../../providers/ConfigProvider';
import BottomSheet2 from '../../layouts/BottomSheet2';
import EditIcon from "@mui/icons-material/Edit";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from 'react-router-dom';

function ViewUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {updateTitle} = useAppBar();
  const {config, isLoadingConfig} = useConfig();
  const navigate = useNavigate();

  useEffect(() => { 
    if (config) {
      setIsLoading(true);
      const fetchUser_ = async () => {
        const user = await fetchById(config.id, 'users');
        setUser(user);
        updateTitle(user.thumb_url || '', user.name, user.email, false);
        setIsLoading(false);
      };
      fetchUser_();
    }
  }, [config]);
  
  if (isLoading || isLoadingConfig) return
  (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
    </>
  );

  const handleEdit = () => {
    navigate(`/main/users/${user.id}/edit`, { state: { updateUser: user } });
  };

  const handleChangePassword = () => {

  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    // This might involve clearing session/tokens and redirecting to login
  };

  return (
    <Container maxWidth="xl">

      {/* Info Section */}
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.name}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {user.name}
        </Typography>
      </Box>

      {/* Text fields with optional visibility */}
      {user.address && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.address}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {user.address}
          </Typography>
        </Box>
      )}
      
      {user.region && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.region}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {user.region.friendly_name}
          </Typography>
        </Box>
      )}

      {user.phone && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.phone}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {user.phone}
          </Typography>
        </Box>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.email}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {user.email}
        </Typography>
      </Box>

      {user.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{strings.notes}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {user.notes}
          </Typography>
        </Box>
      )}

      {config.login_type === 'EMAIL' && (
        <BottomSheet2 
          zIndex={1001}
          buttonGroups={[
            {
              label: "Usuario", 
              buttons: [
                {
                  label: "Editar",
                  action: handleEdit,
                  icon: <EditIcon />
                },
                // {
                //   label: "Cambiar contraseña",
                //   action: handleChangePassword,
                //   icon: <PasswordIcon />
                // },
                // {
                //   label: "Cerrar sesión",
                //   action: handleLogout,
                //   icon: <LogoutIcon />
                // },
              ]
            },
          ]}
        />
      )}

    </Container>
  );
}

export default ViewUser;