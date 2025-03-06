import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPage } from '../../utils/lib';
import ListItemWAvatar from '../../layouts/ListItemWAvatar';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfig } from '../../providers/ConfigProvider';

const SearchPet = () => {
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
        secondary={item.owners_es}
        />
    </Box>
  );

  const handleOnClick = async (pet) => {
    const from = location.state?.from;
    navigate(from, { state: { pet } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPage}
      table={'pets'}
      renderItem={renderItem}
      placeholder={`Buscar ${config.vet.pet_naming_es.toLowerCase()}...`}
    />
  );
};

export default SearchPet;