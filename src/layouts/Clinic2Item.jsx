import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import ClinicHeaderItem from './ClinicHeaderItem';
import { formatDateHour } from '../utils/lib';

function Clinic2Item({clinic2}) {
  let tempWeight = '';
  if (clinic2.temp)
    tempWeight = ` - ${clinic2.temp}${clinic2.temp_unit.name}`;

  if (clinic2.weight)
    tempWeight += ` - ${clinic2.weight}${clinic2.weight_unit.name}`;

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
        title={clinic2.user.name}
        subtitle={formatDateHour(clinic2.date) + tempWeight}
        age={clinic2.age}
        thumbUrl={clinic2.user.thumb_url}
      />

      {clinic2.visit_reason && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Motivo de visita
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.visit_reason}
          </Typography>
        </>
      )}

      {clinic2.anamnesis && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Anamnesis
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.anamnesis}
          </Typography>
        </>
      )}

      {clinic2.pulse && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Pulso
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.pulse}
          </Typography>
        </>
      )}

      {clinic2.respiratory_rate && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Frecuencia respiratoria
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.respiratory_rate}
          </Typography>
        </>
      )}

      {clinic2.inspection && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Inspección
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.inspection}
          </Typography>
        </>
      )}

      {clinic2.palpation && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Palpación
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.palpation}
          </Typography>
        </>
      )}

      {clinic2.auscultation && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Auscultación
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.auscultation}
          </Typography>
        </>
      )}

      {clinic2.helper_methods && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Métodos auxiliares
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.helper_methods}
          </Typography>
        </>
      )}

      {clinic2.presumptive_diagnostic && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Diagnóstico presuntivo
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.presumptive_diagnostic}
          </Typography>
        </>
      )}

      {clinic2.symptoms?.length > 0 && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Síntomas
          </Typography>
          {clinic2.symptoms.map((symptom, index) => (
            <Typography key={index} sx={{ marginX: 2, marginBottom: 1 }}>
              {symptom}
            </Typography>
          ))}
        </>
      )}

      {clinic2.diagnostic && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Diagnóstico
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.diagnostic}
          </Typography>
        </>
      )}

      {clinic2.treatment && (
        <>
          <Typography variant="caption" sx={{ marginX: 2 }}>
            Tratamiento
          </Typography>
          <Typography sx={{ marginX: 2, marginBottom: 1 }}>
            {clinic2.treatment}
          </Typography>
        </>
      )}

      {/* RecyclerView equivalent (list of items) */}
      <Grid container spacing={2} sx={{ marginX: 2 }}>
        {/* Aquí puedes mapear la lista de elementos si es necesario */}
      </Grid>

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

export default Clinic2Item;
