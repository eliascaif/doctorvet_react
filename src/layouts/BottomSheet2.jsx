import React, { useState } from "react";
import { Drawer, Fab, Button, Box, Stack, Typography, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { SwapVerticalCircleTwoTone } from "@mui/icons-material";

const BottomSheet2 = ({ buttonGroups, zIndex = 1000 }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (openState) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(openState);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: zIndex,
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={toggleDrawer(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }
        }}
      >
        <Box
          sx={{
            padding: 2,
            minHeight: "200px", 
            backgroundColor: "background.paper",
          }}
          role="presentation"
        >
          {buttonGroups?.map((group, groupIndex) => (
            <Box key={groupIndex}>
              {group.label && (
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    ml: 2
                  }}
                >
                  {group.label}
                </Typography>
              )}
              <Stack 
                direction="row"
                spacing={2}
                justifyContent="flex-start"
                alignItems="center"
                sx={{ ml: 2, mb: 3 }}
              >
                {group.buttons?.map((buttonConfig, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Fab
                      color={buttonConfig.color || "primary"}
                      onClick={() => {
                        setOpen(false);
                        buttonConfig.action();
                      }}
                      sx={{
                        width: 56,
                        height: 56
                      }}
                    >
                      {buttonConfig.icon}
                    </Fab>
                    <Typography
                      variant="caption"
                      align="center"
                      sx={{
                        width: '100%',
                        maxWidth: 80,
                        whiteSpace: 'normal',
                        lineHeight: 1.2,
                        minHeight: '2.4em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {buttonConfig.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              {groupIndex < buttonGroups.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
};

export default BottomSheet2;