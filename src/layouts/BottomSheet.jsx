import React, { useState } from "react";
import { Drawer, Button, Box, Typography } from "@mui/material";

const BottomSheet = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (openState) => (event) => {
    // Prevenir cierre al hacer scroll con la barra de espacio
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(openState);
  };

  return (
    <>
      
      {/* <Button variant="contained" color="primary" onClick={toggleDrawer(true)}>
        Abrir panel
      </Button>
      */}
      
      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{
            width: "auto", // Puede ser "100%" para usar todo el ancho
            padding: 2,
            backgroundColor: "background.paper",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" gutterBottom>
            Panel deslizante desde abajo
          </Typography>
          <Typography variant="body1">
            Este es un contenido de ejemplo dentro del panel.
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default BottomSheet;
