import React, { createContext, useContext, useState } from 'react';

const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [thumbUrl, setThumbUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showCloseIcon, setShowCloseIcon] = useState(false);

  const updateTitle = (newThumbUrl, newTitle, newSubtitle, showCloseIcon) => {
    setThumbUrl(newThumbUrl);
    setTitle(newTitle);
    setSubtitle(newSubtitle);
    setShowCloseIcon(showCloseIcon);
  };

  return (
    <TitleContext.Provider value={{ thumbUrl, title, subtitle, updateTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => useContext(TitleContext);
