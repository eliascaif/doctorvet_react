import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPageServices } from '../../utils/lib';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ListItemWAvatar from '../../layouts/ListItemWAvatar';

const SearchService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const renderItem = (item) => {
    return (
      <Box 
        display="flex" 
        sx={{
          width: '100%',
          cursor: 'pointer',
        }}
        onClick={() => handleOnClick(item)}
        key={item.id} 
        >
          <ListItemWAvatar 
            primary={item.name}
            thumbUrl={item.thumb_url}
          />
      </Box>
    );
  };

  const handleOnClick = async (item) => {
    const from = location.state?.from;
    
    if (from)
      navigate(from, { state: { item } });
    else
      navigate('/main/view-product', { state: { id: item.id } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPageServices}
      renderItem={renderItem}
      placeholder="Buscar servicio..."
    />
  );
};

export default SearchService;