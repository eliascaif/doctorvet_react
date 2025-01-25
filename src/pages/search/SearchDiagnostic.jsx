import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPage } from '../../utils/lib';
import { ListItemText } from '@mui/material';
import {
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchDiagnostic = () => {
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
    // const from = location.state?.from || '/crear-propietario';
    // navigate(from, { state: { region } });
  };

  const handleCreateNew = async (item) => {
    // const from = location.state?.from || '/crear-propietario';
    // navigate(from, { state: { region } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPage}
      table={'diagnostics'}
      renderItem={renderItem}
      placeholder="Buscar diagnóstico..."
      createNew={handleCreateNew}
    />
  );
};

export default SearchDiagnostic;