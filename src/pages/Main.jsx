import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Fab, AppBar, Toolbar, Drawer, List, ListItem, ListItemText, Typography, CssBaseline, Box, IconButton, ListItemAvatar, Avatar, Divider, Dialog, CircularProgress } from '@mui/material';
import { useAppBar } from '../providers/AppBarProvider';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBack from '@mui/icons-material/ArrowBack';
import BottomSheet2 from '../layouts/BottomSheet2';
import { useConfig } from '../providers/ConfigProvider';
import StoreIcon from "@mui/icons-material/Store";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { SwapVerticalCircleTwoTone } from '@mui/icons-material';

// const drawerWidth = 240;
const drawerWidth = 280;

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleCloseClick = () => {
    navigate(-1);
  };

  const { config, isLoadingConfig, error } = useConfig();
  const { thumbUrl, title, subtitle, showCloseIcon, showFab } = useAppBar();

  //Empty icons for avatar
  const isOwnerRoute = location.pathname.includes('owner');
  const isPetRoute = location.pathname.includes('pet');
  const isVetRoute = location.pathname.includes('vet');
  
  const handleFabClick = async () => {
  };
  
  if (error) return 
  (
    <Box sx={{ display: 'flex' }}>
      <Typography variant="h6" noWrap component="div">
        Error de carga, intenta nuevamente
      </Typography>
    </Box>
  )
  
  if (isLoadingConfig) return
  (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Doctor Vet
          </Typography>
          <Box
            sx={{
              // ml: `${172}px`,
              ml: `${201}px`,
              display: title.length > 0 ? 'flex' : 'none',
              alignItems: 'center',
            }}
          >
            {thumbUrl != undefined &&
              <Avatar
                src={thumbUrl}
                alt="Avatar section"
                sx={{ width: 50, height: 50, marginRight: '16px' }} 
              >
                {/* route empty icon */}
                {!thumbUrl &&
                  (isOwnerRoute ? <PersonIcon sx={{ fontSize: 32 }} /> : isPetRoute ? <PetsIcon sx={{ fontSize: 32 }} /> : isVetRoute ? <StoreIcon sx={{ fontSize: 32 }} /> : null )}
              </Avatar>
            }
            <Box>
              <Typography variant="h6" noWrap>
                {title}
              </Typography>
              <Typography variant="subtitle2" noWrap>
                {subtitle}
              </Typography>
            </Box>
          </Box>

          {/* Espaciador flexible para empujar el botón de cierre hacia la derecha */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Botón de cierre (X) en el extremo derecho */}
          <IconButton 
            sx={{ display: showCloseIcon ? 'block' : 'none' }}  
            color="inherit" 
            onClick={handleCloseClick} 
            edge="end"
          >
            <CloseIcon />
          </IconButton>

        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />

        <Box sx={{ flex: 1 }}>
          <List>
            <ListItem>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box 
                  component={Link} 
                  to="view-vet" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    textDecoration: 'none',
                    color: 'inherit',
                    flexGrow: 1
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt="Vet Avatar" src={config?.vet.thumb_url || undefined}>
                      {!config?.vet.thumb_url && <StoreIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={config?.vet.name}
                    secondary={config?.vet.email}
                  />
                </Box>
                {config?.multivet > 1 && (
                  <IconButton 
                    onClick={() => navigate('/main/view-vet-change')}
                    size="small"
                    sx={{ ml: 1 }}
                  >
                    <SwapHorizIcon />
                  </IconButton>
                )}
              </Box>
            </ListItem>
            <ListItem button component={Link} to="view-user">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemAvatar>
                  <Avatar alt="User Avatar" src={config?.thumb_url} />
                </ListItemAvatar>
                <ListItemText 
                  primary={config?.name}
                  secondary={config?.email}
                />
              </Box>
            </ListItem>

            <Divider />

            <ListItem button component={Link} to="home" selected={location.pathname === '/main/home'}>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button component={Link} to="pets" selected={location.pathname === '/main/pets'}>
              <ListItemText primary={config.vet.pet_naming_es_plural} />
            </ListItem>
            <ListItem button component={Link} to="owners" selected={location.pathname === '/main/owners'}>
              <ListItemText primary={config.vet.owner_naming_es_plural} />
            </ListItem>
            <ListItem button component={Link} to="agenda" selected={location.pathname === '/main/agenda'}>
              <ListItemText primary="Agenda" />
            </ListItem>

            <Divider />

            <ListItem button component={Link} to="daily_cash" selected={location.pathname === '/main/daily_cash'}>
              <ListItemText primary="Caja diaria" />
            </ListItem>
            <ListItem button component={Link} to="reports" selected={location.pathname === '/main/reports'}>
              <ListItemText primary="Reportes" />
            </ListItem>
          </List>
        </Box>

        <Divider />

        <ListItem button component={Link} to="about" selected={location.pathname === '/main/about'}>
          <ListItemText primary="Acerca de Doctor Vet" />
        </ListItem>

      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, padding: 3, margin: 0 }}>
        <Toolbar />
        <Outlet />
        {showFab && (
          <BottomSheet2 
            buttonGroups={[
              {
                label: "Acciones principales",
                buttons: [
                  {
                    label: "Guardar",
                    action: () => console.log("Guardando..."),
                    icon: <SwapVerticalCircleTwoTone />
                  },
                  {
                    label: "Eliminar",
                    action: () => console.log("Eliminando..."),
                  }
                ]
              },
              {
                label: "Otras acciones",
                buttons: [
                  {
                    label: "Imprimir",
                    action: () => console.log("Imprimiendo..."),
                  },
                  {
                    label: "Exportar",
                    action: () => console.log("Exportando..."),
                  }
                ]
              }
            ]}
          />
        )}
      </Box>

    </Box>
  );
}

export default Main;
