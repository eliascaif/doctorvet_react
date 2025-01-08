import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from './AuthProvider';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated)
      return;

    const fetchConfig = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}users?user_and_vet_by_token`, 
          { withCredentials: true },
        );
        setConfig(response.data.data);
      } catch (err) {
        setError(err.message);
        logout();
      } finally {
        setIsLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, isLoadingConfig, error }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
