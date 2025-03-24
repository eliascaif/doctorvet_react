import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const DepositSelector = ({ deposits, value, onChange }) => {
  return (
    <FormControl
      variant="outlined"
      size="small"
      sx={{ marginTop: 1, width: '100%' }}
    >
      <InputLabel id="price-type-label" shrink={true}>Almacén</InputLabel>
      <Select
        labelId="price-selector-label"
        id="price-selector"
        value={value}
        label="Almacén"
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) => (selected ? selected.name : '')}
        sx={{
            width: 'auto',
            "& .MuiOutlinedInput-input": {
              padding: "16.5px 14px",
            }
          }}
        >
        {deposits.map((deposit, index) => (
          <MenuItem 
            key={index}
            value={deposit}
            >
            {deposit.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DepositSelector;
