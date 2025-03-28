import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Fab,
  CircularProgress,
  Dialog,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { fetch } from '../utils/lib';
import { useAppBar } from '../providers/AppBarProvider';
//import { useConfig } from '../providers/ConfigProvider';
import { useNavigate } from 'react-router-dom';
import HomeList from '../layouts/HomeList';

function MainHome() {

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const {updateTitle} = useAppBar();
  //const {config, isLoadingConfig} = useConfig();

  useEffect(() => {
    const fetchHome = async () => {
      const notifications = await fetch('users_home');
      // console.log(notifications);
      setNotifications(notifications);
      updateTitle(undefined, 'Inicio');
      setIsLoading(false);
    };
    fetchHome();
  }, []);

  const onClick = (notification) => {
    
  }

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
    <Container
      maxWidth="lg"
      // style={{ overflow: 'auto', maxHeight: '100vh' }}
      >

      <HomeList
        notifications={notifications}
        onClick={onClick}
      />

    </Container>
  );
}

export default MainHome;

