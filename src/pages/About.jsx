import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useTitle } from '../providers/TitleProvider';

function About() {

  const { updateTitle } = useTitle();

  useEffect(() => {
    updateTitle("", "Home Page", "Bienvenido a la página principal");
  }, [updateTitle]);

  return (
    <Typography variant="h4">About Page</Typography>
  );
}

export default About;
