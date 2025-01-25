import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPage } from '../../utils/lib';
import ListItemWAvatar from '../../layouts/ListItemWAvatar';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchUser = () => {
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
        secondary={item.email}
        />
    </Box>
  );

  const handleOnClick = async (owner) => {
    const from = location.state?.from;
    navigate(from, { state: { owner } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPage}
      table={'users'}
      renderItem={renderItem}
      placeholder={`Buscar usuario...`}
    />
  );
};

export default SearchUser;