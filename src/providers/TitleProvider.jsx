import React, { createContext, useContext, useState } from 'react';

const TitleContext = createContext();

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

export const useTitle = () => useContext(TitleContext);
