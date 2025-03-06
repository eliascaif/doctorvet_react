import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Fab,
  Divider,
  Button,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchById, handleError } from '../../utils/lib';
import { strings } from "../../constants/strings"
import { useLocation } from 'react-router-dom';
import { useSnackbar } from "../../providers/SnackBarProvider";
import axios from "axios";

function ViewProduct() {
  const location = useLocation();
  const [id, setId] = useState(location.state.id);
  const [product, setProduct] = useState(null);
  const {updateTitle} = useAppBar();
  const [isLoading, setIsLoading] = useState(true);
  const snackbar = useSnackbar();
  const [productUpdated, setProductUpdated] = useState(false);
  const [isAssocLoading, setIsAssocLoading] = useState(false);

  useEffect(() => { 
    setIsLoading(true);
    const fetchProduct_ = async () => {
      const product = await fetchById(id, 'products');
      setProduct(product);
      updateTitle(product.thumb_url || '', product.name);
      setIsLoading(false);
    };
    fetchProduct_();
  }, [productUpdated]);

  const handleFabClick = async () => {
  };
  const handleRestore = async () => {
    setIsAssocLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}products?restore&id=${id}`,
        { withCredentials: true }
      );
      setIsAssocLoading(true);
    } catch (error) {
      handleError(error);
      snackbar("Error al guardar el producto");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAssoc = async () => {
    setIsAssocLoading(true);
    const products = {"products": [id]}
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}products?associates`,
        products,
        { withCredentials: true }
      );
      setProductUpdated(true);
    } catch (error) {
      handleError(error);
      snackbar("Error al guardar el producto");
    } finally {
      setIsAssocLoading(false);
    }
  };
  
  if (isLoading) return
  (
    <>
      <CircularProgress
        size={42}
        sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
      />
    </>
  );

  return (
    //style={{ overflow: 'auto', maxHeight: '100vh' }}
    <Container>

      {/* Info Section */}
      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{strings.name}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {product.name_es}
        </Typography>
      </Box>

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Unidad'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {product.unit.name}
        </Typography>
      </Box>
      
      {product.complex_unit_quantity && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Cantidad unidad compleja'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.complex_unit_quantity}
          </Typography>
        </Box>
      )}

      <Box style={{ marginBottom: '16px' }}>
        <Typography variant="caption">{'Categorías'}</Typography>
        <Typography
          variant="body1"
          style={{ fontSize: '16px' }}
        >
          {product.categories_es}
        </Typography>
      </Box>

      {product.bar_code && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{"Código barras"}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.bar_code}
          </Typography>
        </Box>
      )}

      {product.qr_code && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{"Código qr"}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.qr_code}
          </Typography>
        </Box>
      )}

      {product.expires === 1 && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{"Vence"}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {'SI'}
          </Typography>
        </Box>
      )}

      {product.notes && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Notas'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.notes}
          </Typography>
        </Box>
      )}

      {product.is_service === 0 && product.quantity_string && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Cantidad'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.quantity_string}
          </Typography>

          {product.is_service === 0 && product.quantity_detail_es && (
            <Typography
              variant="body1"
              style={{ fontSize: '16px' }}
            >
              {product.quantity_detail_es}
            </Typography>
          )}

          {product.is_service === 0 && product.quantity_detail_branchs_es && (
            <>
              <Typography variant="caption">{'Cantidad en sucursales'}</Typography>
              <Typography
                variant="body1"
                style={{ fontSize: '16px' }}
              >
                {product.quantity_detail_branchs_es}
              </Typography>
            </>
          )}

        </Box>
      )}

      {product.is_service === 0 && product.min_quantity && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Cantidad mínima'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.min_quantity.toFixed(2)}
          </Typography>
        </Box>
      )}

      {product.cost && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Costo'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.cost.toFixed(2)}
          </Typography>
        </Box>
      )}

      {product.tax && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Impuesto'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.tax.toFixed(2)}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {product.p1 && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Precio1'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.p1.toFixed(2)}
          </Typography>
        </Box>
      )}
      {product.p2 && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Precio2'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.p2.toFixed(2)}
          </Typography>
        </Box>
      )}
      {product.p3 && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Precio1'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.p3.toFixed(2)}
          </Typography>
        </Box>
      )}

      {(product.p1 || product.p2 || product.p3) && (
        <Divider sx={{ my: 2 }} />
      )}

      {product.is_service === 1 && product.service_duration && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Duración servicio'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {product.service_duration}
          </Typography>
        </Box>
      )}
      {product.is_service === 1 && product.is_study === 1 && (
        <Box style={{ marginBottom: '16px' }}>
          <Typography variant="caption">{'Es estudio'}</Typography>
          <Typography
            variant="body1"
            style={{ fontSize: '16px' }}
          >
            {'SI'}
          </Typography>
        </Box>
      )}

      {product.deleted === 1 && (
        <Button
          variant="contained"
          onClick={handleRestore}
          fullWidth
          disabled={isAssocLoading}
        >
          {isAssocLoading ? <CircularProgress size={24} /> : 'Restablecer'}
        </Button>
      )}

      {product.is_associate_with_vet === 0 && (
        <Button
          variant="contained"
          onClick={handleAssoc}
          fullWidth
          disabled={isAssocLoading}
        >
          {isAssocLoading ? <CircularProgress size={24} /> : 'Asociar'}
        </Button>
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleFabClick}
        >
          <AddIcon />
        </Fab>
      </Box>

    </Container>
  );
}

export default ViewProduct;