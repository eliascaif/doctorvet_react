import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemText, Typography, CssBaseline, Box, IconButton } from '@mui/material';
import { useTitle } from '../providers/TitleProvider';
import CloseIcon from '@mui/icons-material/Close';
import BottomSheet from '../layouts/BottomSheet';

const drawerWidth = 240;

function Main() {
  const location = useLocation();

  const navigate = useNavigate();
  const handleCloseClick = () => {
    navigate(-1);
  };

  const { title, subtitle } = useTitle();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Doctor Vet
          </Typography>
          <Box sx={{ ml: `${168}px`, display: title.length > 0 ? 'block' : 'none' }}>
            <Typography variant="h6" noWrap>
              {title}
            </Typography>
            <Typography variant="subtitle2" noWrap>
              {subtitle}
            </Typography>
          </Box>

          {/* Espaciador flexible para empujar el botón de cierre hacia la derecha */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Botón de cierre (X) en el extremo derecho */}
          <IconButton 
            sx={{ display: title.length > 0 ? 'block' : 'none' }}  
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
        <List>
          <ListItem button component={Link} to="home" selected={location.pathname === '/main/home'}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="pets" selected={location.pathname === '/main/pets'}>
            <ListItemText primary="Mascotas" />
          </ListItem>
          <ListItem button component={Link} to="owners" selected={location.pathname === '/main/owners'}>
            <ListItemText primary="Propietarios" />
          </ListItem>
          <ListItem button component={Link} to="agenda" selected={location.pathname === '/main/agenda'}>
            <ListItemText primary="Agenda" />
          </ListItem>
          <ListItem button component={Link} to="daily_cash" selected={location.pathname === '/main/daily_cash'}>
            <ListItemText primary="Caja diaria" />
          </ListItem>
        </List>      
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />

        <BottomSheet />

      </Box>
    </Box>
  );
}

export default Main;
