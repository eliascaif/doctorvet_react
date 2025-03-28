import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from './AuthProvider';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [error, setError] = useState(null);
  const { isAuth, logout } = useAuth();
  
  const fetchConfig = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}users?user_and_vet_by_token`, 
        { withCredentials: true }
      );
      console.log('Config response:', response.data);
      setConfig(response.data.data);
    } catch (err) {
      console.error('Config error:', err);
      setError(err.message);
      logout();
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    if (!isAuth)
      return;

    fetchConfig();
  }, [isAuth]);

  const reloadConfig = () => {
    setIsLoadingConfig(true);
    fetchConfig();
  };

  return (
    <ConfigContext.Provider value={{ config, isLoadingConfig, error, reloadConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
