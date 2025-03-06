import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPage } from '../../utils/lib';
import { ListItemText } from '@mui/material';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchPetCharacter = () => {
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
      fetchFunction={fetchSearchPage}
      table={'pets_characters'}
      renderItem={renderItem}
      placeholder="Buscar carácter..."
    />
  );
};

export default SearchPetCharacter;