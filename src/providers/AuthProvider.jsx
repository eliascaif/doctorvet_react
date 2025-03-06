import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [isAuth, setisAuth] = useState(localStorage.getItem('isAuth') === 'true');

  const login = () => {
    setisAuth(true);
    localStorage.setItem('isAuth', true);
  };

  const logout = () => {
    setisAuth(false);
    localStorage.setItem('isAuth', false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
