import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from './AuthProvider';
import { useLoading } from './LoadingProvider';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [isConfigReady, setIsConfigReady] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  const { isLoading, setIsLoading } = useLoading();
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated)
      return;

    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}users?user_and_vet_by_token`, 
          { withCredentials: true },
        );
        // console.log(response);
        setConfig(response.data.data);
        setIsConfigReady(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, isLoading, error }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
