import React, { createContext, useContext, useState } from 'react';

// Contexto para el título y subtítulo
const TitleContext = createContext();

// Proveedor del contexto
export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const updateTitle = (newTitle, newSubtitle) => {
    setTitle(newTitle);
    setSubtitle(newSubtitle);
  };

  return (
    <TitleContext.Provider value={{ title, subtitle, updateTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useTitle = () => useContext(TitleContext);
