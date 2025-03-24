import React, { createContext, useContext, useState } from 'react';

const AppBarContext = createContext();

export const AppBarProvider = ({ children }) => {
  const [thumbUrl, setThumbUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [showFab, setShowFab] = useState(true);

  const updateTitle = (newThumbUrl, newTitle, newSubtitle, showCloseIcon = false) => {
    setThumbUrl(newThumbUrl);
    setTitle(newTitle);
    setSubtitle(newSubtitle);
    setShowCloseIcon(showCloseIcon);
  };

  const toggleFab = (show) => {
    setShowFab(show);
  };

  return (
    <AppBarContext.Provider value={{ thumbUrl, title, subtitle, updateTitle, showFab, toggleFab }}>
      {children}
    </AppBarContext.Provider>
  );
};

export const useAppBar = () => useContext(AppBarContext);
