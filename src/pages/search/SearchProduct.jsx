import React from 'react';
import SearchPage from './SearchPage';
import { fetchSearchPage } from '../../utils/lib';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ListItemWAvatar from '../../layouts/ListItemWAvatar';

const SearchProduct = () => {
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
            primary={item.name_es}
            secondary={
              <>
                {item.categories_es && <>{item.categories_es}<br /></>}
                {item.quantity_string && <>{`Cantidad: ${item.quantity_string}`}<br /></>}
                {item.price_es && <>{`Precios: ${item.price_es}`}<br /></>}
                {!item.is_associate_with_vet && <>{`No asociado`}<br /></>}
              </>           
            }
            thumbUrl={item.thumb_url}
          />
      </Box>
    );
  };

  const handleOnClick = async (product) => {
    const from = location.state?.from;
    
    if (from)
      navigate(from, { state: { product } });
    else
      navigate('/main/view-product', { state: { id: product.id } });
  };

  return (
    <SearchPage
      fetchFunction={fetchSearchPage}
      table={'products'}
      renderItem={renderItem}
      placeholder="Buscar producto..."
      showProductsToogle={true}
    />
  );
};

export default SearchProduct;