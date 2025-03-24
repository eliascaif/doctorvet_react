import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPage } from '../../utils/lib';
import ListItemWAvatar from '../../layouts/ListItemWAvatar';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfig } from '../../providers/ConfigProvider';

const SearchProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { config } = useConfig();
  
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
        secondary={item.email}
        />
    </Box>
  );

  const handleOnClick = async (provider) => {
    const from = location.state?.from;
    navigate(from, { state: { provider } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPage}
      table={'products_providers'}
      renderItem={renderItem}
      placeholder={`Buscar distribuidor...`}
    />
  );
};

export default SearchProvider;