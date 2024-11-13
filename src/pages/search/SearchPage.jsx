import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Container,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchPage({ fetchData, renderItem, placeholder }) {
  const [searchText, setSearchText] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    fetchData(searchText, page).then((data) => {
      setResults((actualData) => [...actualData, ...data.content]);
      setHasMore(data.total_pages !== page);
      setIsLoading(false);
    });   
  };

  // Configura el IntersectionObserver para detectar el último elemento
  const lastElementRef = useCallback((node) => {
    if (isLoading) return; // No observamos mientras estamos cargando
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((actualPage) => actualPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore]);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {/* Contenedor de búsqueda */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mx: 1,
            mb: 1,
          }}
        >
          <TextField
            fullWidth
            id="txt_search"
            label="Buscar"
            placeholder="Buscar"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            inputProps={{ maxLength: 250 }}
            onKeyPress={(ev) => {
              if (ev.key === 'Enter') {
                handleSearch();
                ev.preventDefault();
              }
            }}
          />
          <IconButton
            id="img_search"
            color="primary"
            onClick={handleSearch}
            sx={{ ml: 1 }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Indicador de carga */}
        {isLoading && <CircularProgress />}


        {/* Lista de resultados */}
        <List>
        {results.map((item, index) => {
          if (index === results.length - 1) {
            // Último elemento en la lista; usamos el observer
            return (
              <ListItem ref={lastElementRef} key={index}>
                {renderItem(item)}
              </ListItem>
            );
          } else {
            return (
              <ListItem key={index}>
                {renderItem(item)}
              </ListItem>
            );
          }
        })}
        {isLoading && (
          <ListItem>
            <CircularProgress />
          </ListItem>
        )}
      </List>

        {/* {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {results.map((item, index) => (
              <ListItem key={index}>
                {renderItem(item)}
              </ListItem>
            ))}
          </List>
        )} */}
      </Box>
    </Container>
  );
}

export default SearchPage;
