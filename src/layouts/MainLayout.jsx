import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemText, Typography, CssBaseline, Box, IconButton } from '@mui/material';
import { useTitle } from '../contexts/TitleContext';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 240;

function MainLayout() {
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
            My App
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
          <ListItem button component={Link} to="about" selected={location.pathname === '/main/about'}>
            <ListItemText primary="About" />
          </ListItem>
        </List>      
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
