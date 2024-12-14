import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useTitle } from '../providers/TitleProvider';
import axios from 'axios';
import { fetchOwnersForInput } from '../utils/lib';

function Home() {

  const { updateTitle } = useTitle();

  useEffect(() => {
    updateTitle('', '', '');
  }, [updateTitle]);

  const handleLogin = async() => {
    // alert("pepe");

    const result = await fetchOwnersForInput();
    console.log(result);

    // try {
    //   const queryParams = {
    //     recent: '',
    //     page: 1,
    //   };
    //   const response = await axios.get(
    //     `${import.meta.env.VITE_API_URL}owners`,
    //      { params: queryParams, withCredentials: true },
    //   );
    //   console.log(response);

    // } catch (error) {
    //   //console.log(error);
    // }

  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Home Page</Typography>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </Container>
  );
}

export default Home;
