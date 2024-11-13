import React, { createContext, useState } from 'react';

// Crea el contexto
const AuthContext = createContext();

// Proveedor del contexto
export function AuthProvider({ children }) {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('user_registered') ? true : false);

  // Función para iniciar sesión
  const login = () => {
    // Aquí podrías agregar lógica para autenticar al usuario
    // setIsAuthenticated(localStorage.getItem('user_registered') ? true : false);
  };

  // Función para cerrar sesión
  const logout = () => {
    // Lógica para cerrar sesión, limpiar tokens, etc.
    // localStorage.removeItem('user_registered');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
