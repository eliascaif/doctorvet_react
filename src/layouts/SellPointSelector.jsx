import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SellPointSelector = ({ sellPoints, value, onChange }) => {
  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{ marginTop: 1, width: '100%' }}
    >
      <InputLabel id="price-type-label" shrink={true}>Punto de venta</InputLabel>
      <Select
        labelId="sell-point-selector-label"
        id="sell-point-selector"
        value={value}
        label="Punto de venta"
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => (selected ? selected.name : '')}
        sx={{
            width: 'auto',
            "& .MuiOutlinedInput-input": {
              padding: "16.5px 14px",
            }
          }}
        >
        {sellPoints.map((sellPoint, index) => (
          <MenuItem
            key={index}
            value={sellPoint}
            >
            {sellPoint.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SellPointSelector;
