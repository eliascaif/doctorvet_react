import React from "react";
import { Box, Container, Fab, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const EditPage = ({ 
  children, 
  onSubmit, 
  isLoading, 
  fabIcon = <CheckIcon />,
  fabAriaLabel = "save",
}) => {
  return (
    <Container>
      <Box 
        component="form" 
        onSubmit={onSubmit} 
        sx={{ position: "relative", mb: 4 }}
      >
        {children}

        {/* Floating Action Button */}
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Fab color="primary" aria-label={fabAriaLabel} onClick={onSubmit}>
            {fabIcon}
          </Fab>
        </Box>

        {/* Loading Indicator */}
        {/* {isLoading && (
          <CircularProgress
            size={42}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-21px",
              marginLeft: "-21px",
            }}
          />
        )} */}
      </Box>
    </Container>
  );
};

export default EditPage;
