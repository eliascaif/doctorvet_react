import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProductPriceSelector = ({ sellItem, setSellItem }) => {
  // Si no hay unidad seleccionada, se toma la primera unidad del producto como valor por defecto
  //const defaultPrice = sellItem.product?.p1;

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{ marginTop: 1, width: 'auto',  minWidth: 60 }}
    >
      <Select
        labelId="price-selector-label"
        id="price-selector"
        value={sellItem.product.p1}
        onChange={(e) =>
          setSellItem({ ...sellItem, price: e.target.value })
        }
        sx={{
            width: 'auto',
            "& .MuiOutlinedInput-input": {
              padding: "16.5px 14px",
            }
          }}
        >
        <MenuItem value={sellItem.product.p1}>
          {'P1'}
        </MenuItem>
        {sellItem.product.p2 && (
          <MenuItem value={sellItem.product.p2}>
            {'P2'}
          </MenuItem>
        )}
        {sellItem.product.p3 && (
          <MenuItem value={sellItem.product.p3}>
            {'P3'}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default ProductPriceSelector;
