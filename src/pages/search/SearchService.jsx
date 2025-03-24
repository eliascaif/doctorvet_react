import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPageServices } from '../../utils/lib';
import ListItemWAvatar from '../../layouts/ListItemWAvatar';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchService = () => {
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
      <ListItemWAvatar 
        key={item.id} 
        primary={item.name}
        secondary={item.description}
        />
    </Box>
  );

  const handleOnClick = async (service) => {
    const from = location.state?.from;
    navigate(from, { state: { service } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPageServices}
      table={'products'}
      renderItem={renderItem}
      placeholder={`Buscar servicio...`}
    />
  );
};

export default SearchService;