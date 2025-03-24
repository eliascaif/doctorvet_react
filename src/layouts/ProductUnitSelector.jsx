import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ProductUnitSelector = ({ product, sellItem, setSellItem }) => {
  // Si no hay unidad seleccionada, se toma la primera unidad del producto como valor por defecto
  const defaultUnit = product?.unit?.first_unit_string || "";
  const currentUnit = sellItem?.selectedUnit || defaultUnit;

  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{ marginTop: 1, width: 'auto',  minWidth: 60 }}
    >
      <Select
        labelId="unit-selector-label"
        id="unit-selector"
        value={currentUnit}
        onChange={(e) =>
          setSellItem({ ...sellItem, selectedUnit: e.target.value })
        }
        sx={{
            width: 'auto',
            // Forzamos la altura del input para que coincida con los controles adyacentes
            "& .MuiOutlinedInput-input": {
              padding: "16.5px 14px", // estos valores son los por defecto de un TextField "medium"
            }
          }}
        >
        {/* Siempre se muestra la primera unidad */}
        <MenuItem value={product.unit.first_unit_string}>
          {product.unit.first_unit_string}
        </MenuItem>
        {/* Si la unidad es compleja, se muestra la segunda opción */}
        {product.unit.is_complex === 1 && (
          <MenuItem value={product.unit.second_unit_string}>
            {product.unit.second_unit_string}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default ProductUnitSelector;
