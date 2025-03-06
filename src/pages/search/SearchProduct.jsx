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

      // <Box 
      //   display="flex" 
      //   alignItems="center" 
      //   width="100%"
      //   onClick={() => handleOnClick(item)}
      //   key={item.id} 
      //   >
      //   <ListItemAvatar>
      //     <Avatar alt={capitalizeFirstLetter(primary)} src={item.thumb_url} />
      //   </ListItemAvatar>
      //   <ListItemText 
      //     primary={item.name}
      //     secondary={
      //       <>
      //         {item.categories_es && <>{item.categories_es}<br /></>}
      //         {item.quantity_string && <>{`Cantidad: ${item.quantity_string}`}<br /></>}
      //         {item.price_es && <>{`Precios: ${item.price_es}`}<br /></>}
      //         {!item.is_associate_with_vet && <>{`No asociado`}<br /></>}
      //       </>           
      //     }
      //   />
      // </Box>

      // <Box
      //   sx={{
      //     width: '100%',
      //     cursor: 'pointer',
      //   }}
      //   onClick={() => handleOnClick(item)}
      // >
      //   <ListItemText 
      //     key={item.id} 
      //     primary={item.name}
      //     secondary={
      //       <>
      //         {item.categories_es && <>{item.categories_es}<br /></>}
      //         {item.quantity_string && <>{`Cantidad: ${item.quantity_string}`}<br /></>}
      //         {item.price_es && <>{`Precios: ${item.price_es}`}<br /></>}
      //         {!item.is_associate_with_vet && <>{`No asociado`}<br /></>}
      //       </>           
      //     }
      //   />
      // </Box>
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
      fetchFunction={fetchSearchPage}
      table={'products'}
      renderItem={renderItem}
      placeholder="Buscar producto..."
      showProductsToogle={true}
    />
  );
};

export default SearchProduct;