import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useTitle } from '../contexts/TitleContext';

function Home() {

  const { updateTitle } = useTitle();

  useEffect(() => {
    updateTitle('', '');
  }, [updateTitle]);

  return (
    <Typography variant="h4">Home Page</Typography>
  );
}

export default Home;
