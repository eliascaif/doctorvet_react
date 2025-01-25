import zIndex from '@mui/material/styles/zIndex';
import React, { createContext, useContext, useState } from 'react';
import {
  CircularProgress,
} from '@mui/material';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading &&
        <CircularProgress
          size={42}
          sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px', zIndex: 1300 }}
        />
      }
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
