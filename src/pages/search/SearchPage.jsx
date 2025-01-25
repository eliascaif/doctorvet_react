import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  Container,
  CircularProgress,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchPage({fetchFunction, table, renderItem, placeholder, createNew = null, showProductsToogle = false}) {
  const [searchText, setSearchText] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  //const [showProductsToogle, setShowProductsToogle] = useState(showProductsToogle);
  const [isProductsGlobals, setIsProductsGlobals] = useState(false);

  useEffect(() => {
    handleSearch();
  }, [isProductsGlobals]);

  // useEffect(() => {
  //   search();
  // }, [isProductsGlobals]);

  const handleSearch = () => {
    setPage(1);
    setIsLoading(true);
    fetchFunction(table, searchText, page, isProductsGlobals).then((data) => {
      // console.log(data);
      setResults(data.content);
      setHasMore(data.total_pages > 1);
      setIsLoading(false);
    });   
  };

  const handleScroll = () => {
    setIsLoading(true);
    fetchFunction(table, searchText, page, isProductsGlobals).then((data) => {
      setResults((actualData) => [...actualData, ...data.content]);
      setHasMore(data.total_pages > page);
      setIsLoading(false);
    });   
  };

  const lastElementRef = useCallback((node) => {
    if (isLoading) return; // No observamos mientras estamos cargando
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page === 1) return; // Evita cargar datos al iniciar
    handleScroll();
  }, [page]);

  return (
    <Container
      maxWidth="md"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '85vh',
      }}
    >
      <Box sx={{ flex: 1, mt: 4 }}>
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
            label={placeholder}
            placeholder={placeholder}
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

        {/* Interruptor debajo del cuadro de búsqueda */}
        {showProductsToogle && ( 
          <Box sx={{ mx: 1, mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isProductsGlobals}
                onChange={(e) => setIsProductsGlobals(e.target.checked)}
                color="primary"
              />
            }
            label="Mostrar todos"
          />
          </Box>
        )}

        {/* Lista de resultados */}
        <List>
          {results.map((item, index) => (
            <ListItem
              ref={index === results.length - 1 ? lastElementRef : null}
              key={index}
              sx={{ width: '100%' }}
            >
              {renderItem(item)}
            </ListItem>
          ))}
          {isLoading && (
            <ListItem
              sx={{ width: '100%' }}
            >
              <CircularProgress />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Footer */}
      {createNew !== null && isLoading === false && hasMore === false &&
        <Box
          sx={{
            mt: 2,
            py: 2,
            textAlign: 'center',
            borderTop: '1px solid #ddd',
          }}
        >
          <Typography variant="body1">¿No encuentras el elemento buscado?</Typography>
          <Typography
            variant="body1"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => console.log('CREA UNO')}
          >
            CREA UNO
          </Typography>
        </Box>
      }

    </Container>
  );
}

export default SearchPage;
