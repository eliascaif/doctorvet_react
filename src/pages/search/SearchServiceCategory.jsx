import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPageServicesCategories } from '../../utils/lib';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ListItemWAvatar from '../../layouts/ListItemWAvatar';

const SearchServiceCategory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const renderItem = (item) => (
    <Box
      sx={{
        width: '100%',
        cursor: 'pointer',
      }}
      onClick={() => handleOnClick(item)}
    >
      <ListItemText 
        key={item.id} 
        primary={item.name}
        />
    </Box>
  );

  const handleOnClick = async (item) => {
    const from = location.state?.from;
    navigate(from, { state: { item } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPageServicesCategories}
      renderItem={renderItem}
      placeholder="Buscar categoría de servicios..."
    />
  );
};

export default SearchServiceCategory;