import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { capitalizeFirstLetter } from '../utils/lib';
import PropTypes from 'prop-types';

const ListItemWAvatarRemove = ({
  product,       // Nombre del producto (corresponde a txt_product)
  description,   // Detalle del item (ej.: "cant x price" – txt_item_description)
  thumbUrl,      // URL de la imagen, si existe
  avatarContent, // Contenido por defecto para el avatar
  subtotal,      // Subtotal de la fila (txt_subtotal)
  onDelete,       // Función para eliminar la fila
  index,
}) => {
  // Se muestra el avatar con la imagen proporcionada o, en su defecto, el contenido por defecto.
  const avatar = thumbUrl ? (
    <Avatar
      alt={capitalizeFirstLetter(product)}
      src={thumbUrl}
      sx={{ width: 30, height: 30 }}
    />
  ) : (
    <Avatar sx={{ width: 30, height: 30 }}>
      {avatarContent}
    </Avatar>
  );

  return (
    <Box
      display="flex"
      alignItems="center"
      width="100%"
      sx={{ padding: '8px' }} // Equivalente al padding="8dp" en Android
    >
      {/* Imagen o avatar del producto */}
      {avatar}

      {/* Contenedor central para los textos */}
      <Box
        display="flex"
        flexDirection="column"
        flexGrow={1}
        ml={1}  // margen izquierdo (aprox. 8px)
        mr={1}  // margen derecho (aprox. 8px)
      >
        {/* Fila superior: nombre del producto */}
        <Typography
          variant="caption"
          noWrap
          sx={{ marginBottom: '4px' }}
        >
          {product}
        </Typography>

        {/* Fila inferior: descripción (izquierda) y subtotal (derecha) */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption">
            {description}
          </Typography>
          <Typography variant="caption" sx={{ marginRight: '8px' }}>
            {subtotal}
          </Typography>
        </Box>
      </Box>

      {/* Botón para eliminar el item */}
      {onDelete && (
        <IconButton onClick={() => onDelete(index)} sx={{ width: '42px', height: '42px' }}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
};

ListItemWAvatarRemove.propTypes = {
  product: PropTypes.string,
  description: PropTypes.string,
  subtotal: PropTypes.string,
  onDelete: PropTypes.func,
  index: PropTypes.number,
  //... otras props
};

export default ListItemWAvatarRemove;