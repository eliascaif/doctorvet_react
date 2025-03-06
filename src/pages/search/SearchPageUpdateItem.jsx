import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  Container,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchPage({fetchFunction, fetchArgs, renderItem, placeholder, results, setResults}) {
  const [searchText, setSearchText] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    setPage(1);
    setIsLoading(true);
    fetchFunction(searchText, page, ...fetchArgs).then((data) => {
      setResults(data.content);
      setHasMore(data.total_pages > 1);
      setIsLoading(false);
    });   
  };

  const handleScroll = () => {
    setIsLoading(true);
    fetchFunction(searchText, page, ...fetchArgs).then((data) => {
      setResults((actualData) => [...actualData, ...data.content]);
      setHasMore(data.total_pages > page);
      setIsLoading(false);
    });   
  };

  const lastElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page === 1) return;
    handleScroll();
  }, [page]);
  
  return (
    // style={{ overflow: 'auto', maxHeight: '100vh' }}
    <Container maxWidth="md" sx={{ width: '100%' }}> 
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
            label={ placeholder }
            placeholder={ placeholder }
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
    </Container>
  );
}

export default SearchPage;
