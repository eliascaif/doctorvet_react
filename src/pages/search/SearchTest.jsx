import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography, Container,
  List, ListItem, ListItemAvatar, ListItemText, Avatar, 

 } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import * as lib from '../../utils/lib';
import axios from 'axios';
import ListItemOkCancelVet from '../../layouts/ListItemOkCancelVet';
import VetListTest from '../../layouts/VetListTest';

const SearchTest = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null); // Referencia para el scroll infinito

  // Función para cargar datos de la API
  const fetchData = async (page) => {
    try {
      const queryParams = {
        user_email: 'pepe101@email.com',
        for_request: '',
        search: '',
        page: 1,
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}vets`, { params: queryParams })
      setData((prevData) => [...prevData, ...response.data.data.content]);
      setTotalPages(response.data.data.total_pages);
    } catch (error) {
      lib.handleError(error);
    }

    // try {
    //   const response = await fetch(`/api/regions?page=${page}&limit=${itemsPerPage}`);
    //   const result = await response.json();
    //   setData((prevData) => [...prevData, ...result.items]); // Adjunta los nuevos ítems
    //   setTotalPages(result.totalPages); // Define el total de páginas según la respuesta de la API
    // } catch (error) {
    //   console.error("Error al cargar los datos:", error);
    // }
  };

  // Cargar la primera página cuando el componente se monta
  useEffect(() => {
    setIsLoading(true);
    fetchData(currentPage);
    setIsLoading(false);
  }, [currentPage]);

  // Detectar el final de la lista con `IntersectionObserver`
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading && currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1); // Cargar la siguiente página
    }
  }, [isLoading, currentPage, totalPages]);

  // Configura el `IntersectionObserver` en `loaderRef`
  useEffect(() => {
    const option = { root: null, rootMargin: '20px', threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <Container>
      <Box sx={{ mt: 2, mb: 4 }}> 

        <Typography variant="h5" mb={2}>
          Lista de Regiones
        </Typography>

        <List>
          {data.map((item, index) => (
          <ListItem key={item.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={item.image} alt={item.name} />
            </ListItemAvatar>

            <ListItemText
              primary={item.name}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {item.email}
                  </Typography>
                  {" — "}
                  {item.region.friendly_name}
                </>
              }
            />


          </ListItem>
          ))}
        </List>

        {/* <ul>
          {data.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul> */}

        {/* Indicador de carga */}
        {isLoading && <CircularProgress />}

        {/* Elemento de referencia para scroll infinito */}
        <div ref={loaderRef} style={{ height: '20px', background: 'transparent' }}></div>

        {/* Paginación de Material-UI como control secundario */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
          shape="rounded"
        />
        
      </Box>
    </Container>
  );
};

export default SearchTest;
