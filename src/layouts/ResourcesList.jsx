import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box, CircularProgress } from "@mui/material";
import { Description } from "@mui/icons-material"; // Icono para archivos generales
import { getResource } from '../utils/lib';

const ResourcesList = ({ resources }) => {

  const [isLoading, setIsLoading] = useState(true);

  //generate resources local urls
  useEffect(() => {
    const fetchResources = async () => {
      const promises = resources.map(async (resource) => {
        resource.cached_url = await getResource(resource.file_name, resource.file_url);
      });
      try {
        await Promise.all(promises);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (isLoading) return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 200, 
        backgroundColor: 'lightgray', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress
        size={42}
        sx={{
          position: 'absolute',
        }}
      />
    </Box>
  );

  return (
    <>
      <Grid container spacing={2} sx={{ padding: 2 }}>
      {resources.map((resource, index) => (
          <Grid item xs={12} sm={6} key={index}>
          {resource.file_type === "IMAGE" && (
              <img
              src={resource.cached_url}
              alt={`Resource ${index}`}
              style={{ width: "100%", borderRadius: 8 }}
              />
          )}
          {resource.file_type === "VIDEO" && (
              <video
              controls
              style={{ width: "100%", borderRadius: 8 }}
              >
              <source src={resource.cached_url} type="video/mp4" />
              Tu navegador no soporta el video.
              </video>
          )}
          {resource.file_type === "AUDIO" && (
              <audio
              controls
              style={{ width: "100%" }}
              >
              <source src={resource.cached_url} type="audio/mpeg" />
              Tu navegador no soporta el audio.
              </audio>
          )}
          {resource.file_type === "FILE" && (
              <a
              href={resource.cached_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
              >
              <Button
                  variant="outlined"
                  startIcon={<Description />}
                  sx={{
                  width: "100%",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  }}
              >
                  {resource.name || "Archivo descargable"}
              </Button>
              </a>
          )}
          </Grid>
        ))}
        </Grid>
    </>
  );
};

export default ResourcesList;
