import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPage } from '../../utils/lib';
import { ListItemText } from '@mui/material';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchPetPelage = () => {
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

  const handleCreateNew = async (item) => {
    // const from = location.state?.from || '/crear-propietario';
    // navigate(from, { state: { region } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPage}
      table={'pets_pelages'}
      renderItem={renderItem}
      placeholder="Buscar pelaje..."
      createNew={handleCreateNew}
    />
  );
};

export default SearchPetPelage;