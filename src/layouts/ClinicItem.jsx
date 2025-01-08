import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import ClinicHeaderItem from './ClinicHeaderItem';
import { formatDateHour } from '../utils/lib';
import ResourcesList from './ResourcesList';

function ClinicItem({clinic}) {
  let tempWeight = '';
  if (clinic.temp)
    tempWeight = ` - ${clinic.temp}${clinic.temp_unit.name}`;

  if (clinic.weight)
    tempWeight += ` - ${clinic.weight}${clinic.weight_unit.name}`;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        //padding: 2, // Esto reemplaza los padding en LinearLayout
      }}
    >
      <ClinicHeaderItem 
        title={clinic.user.name}
        subtitle={formatDateHour(clinic.date) + tempWeight}
        age={clinic.age}
        thumbUrl={clinic.user.thumb_url}
      />

      {/* Descripción del componente */}
      <Typography
        id="txt_description"
        variant="body1"
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2,
        }}
      >
        {clinic.description}
      </Typography>

      {clinic.resources?.length > 0 && (
        <ResourcesList 
          resources={clinic.resources}
        />
      )}

      {/* Línea divisoria */}
      <Divider
        id="div_line"
        sx={{
          marginTop: 1,
          marginLeft: 1,
          marginRight: 1,
          backgroundColor: '#dadada',
          height: 1,
        }}
      />
    </Box>  
  );
}

export default ClinicItem;
