import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Autocomplete,
  Fab,
  Container,
  Box,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Typography,
  Grid,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate, useParams } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import PropTypes from "prop-types";

const EditProduct = ({ updateProduct = null }) => {
  const [product, setProduct] = useState(
    updateProduct || {
      id: null,
      name: "",
      category: null,
      unit: null,
      barCode: "",
      qrCode: "",
      price: "",
      web_page: "",
      currentQuantity: "",
      minQuantity: "",
      cost: "",
      tax: "",
      margin: "",
      finalPrice: "",
      active: true,
    }
  );

  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    name: useRef(null),
    barCode: useRef(null),
    qrCode: useRef(null),
    minQuantity: useRef(null),
    cost: useRef(null),
    tax: useRef(null),
    margin: useRef(null),
    finalPrice: useRef(null),
  });
  const [checked, setChecked] = useState(false);
  

  const { id } = useParams();
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updateProduct) {
      updateTitle("", strings.update_product, strings.complete_data);
    } else {
      updateTitle("", strings.new_product, strings.complete_data);
    }

    setIsLoading(true);

    const fetchForInput = async () => {
      setIsLoading(true); 

      try {
        
        const [regionsData, fiscalTypesData, productsData] = await Promise.all([
          lib.fetchRegions(), 
          lib.fetchFiscalTypes(""),
          lib.fetchProducts(), 
        ]);

        
        if (productsData) setCategories(productsData); 
        if (fiscalTypesData) setUnits(fiscalTypesData); 
      } catch (error) {
        
        lib.handleError(error);
        snackbar("Error al cargar");
      } finally {
        setIsLoading(false); 
      }
    };

    
    fetchForInput();

   
    if (id && !updateProduct) {
      fetchProduct(id); 
    }
  }, [id, updateProduct]);

  const fetchProduct = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}products/${id}`
      );
      setProduct(response.data);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al cargar");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (e, newCategory) => {
    setProduct({ ...product, category: newCategory });
  };

  const handleUnitChange = (e, newUnit) => {
    setProduct({ ...product, unit: newUnit });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lib.validateNonEmpty("name", product.name, setErrors, refs.name)) {
      return;
    }

    if (updateProduct) {
      update();
    } else {
      save();
    }
  };

  const save = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}products`,
        product,
        { withCredentials: true }
      );
      navigate(`/main/view-product/${response.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}products/${product.id}`,
        product,
        { withCredentials: true }
      );
      navigate(`/main/view-product/${response.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al actualizar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }} component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label={strings.product_name + " *"}
          name="name"
          value={product.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />

        <Autocomplete
          fullWidth
          options={categories}
          getOptionLabel={(option) => option.name} 
          value={product.category}
          onChange={handleCategoryChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.category + " *"}
              margin="normal"
            />
          )}
        />

        <Autocomplete
          fullWidth
          options={units}
          getOptionLabel={(option) => option.name} 
          value={product.unit}
          onChange={handleUnitChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.unit + " *"}
              margin="normal"
            />
          )}
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.barCode}
          name="barCode"
          value={product.barCode}
          onChange={handleChange}
          inputRef={refs.barCode}
          error={!!errors.barCode}
          helperText={errors.barCode}
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.qr_code}
          name="qrCode"
          value={product.qrCode}
          onChange={handleChange}
          inputRef={refs.qrCode}
          error={!!errors.qrCode}
          helperText={errors.qrCode}
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.web_page}
          name="webPage"
          value={product.web_page}
          onChange={handleChange}
          inputRef={refs.web_page}
          error={!!errors.web_page}
          helperText={errors.web_page}
        />

        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
            }
            label="Vence"
          />
        </Box>

        <div>
          <TextField
            fullWidth
            margin="normal"
            label={strings.currentQuantity}
            name="currentQuantity"
            value={product.currentQuantity}
            onChange={handleChange}
            error={!!errors.currentQuantity}
          />
          <FormHelperText>
            Opcional. Si estas editando, el valor ingresado reseteará la
            cantidad y la trazabilidad para el producto. En escenarios
            multialmacen, la cantidad se asignará al almacén central.
          </FormHelperText>
        </div>
        <TextField
          fullWidth
          margin="normal"
          label={strings.minQuantity}
          name="minQuantity"
          value={product.minQuantity}
          onChange={handleChange}
          inputRef={refs.minQuantity}
          error={!!errors.minQuantity}
          helperText={errors.minQuantity}
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.cost}
          name="cost"
          value={product.cost}
          onChange={handleChange}
          inputRef={refs.cost}
          error={!!errors.cost}
          helperText={errors.cost}
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.tax}
          name="tax"
          value={product.tax}
          onChange={handleChange}
          inputRef={refs.tax}
          error={!!errors.tax}
          helperText={errors.tax}
        />

        <div style={{ margin: "0 auto" }}>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Precio 1
          </Typography>

          <Autocomplete
            value={product.price}
            onInputChange={handleChange}
            inputValue={product.price}
            options={[]} 
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ninguno"
                fullWidth
                variant="outlined"
                autoComplete="off"
                sx={{ marginTop: 2 }}
              />
            )}
          />

          <Grid container spacing={2} style={{ marginTop: "16px" }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label={strings.margin}
                name="margin"
                value={product.margin}
                onChange={handleChange}
                inputRef={refs.margin}
                error={!!errors.margin}
                helperText={errors.margin}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label={strings.finalPrice}
                name="margin"
                value={product.finalPrice}
                onChange={handleChange}
                inputRef={refs.finalPrice}
                error={!!errors.finalPrice}
                helperText={errors.finalPrice}
              />
            </Grid>
          </Grid>
        </div>
        <div style={{ margin: "0 auto" }}>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Precio 2
          </Typography>

          <Autocomplete
            value={product.price}
            onInputChange={handleChange}
            inputValue={product.price}
            options={[]} 
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ninguno"
                fullWidth
                variant="outlined"
                autoComplete="off"
                sx={{ marginTop: 2 }}
              />
            )}
          />

          <Grid container spacing={2} style={{ marginTop: "16px" }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label={strings.margin}
                name="margin"
                value={product.margin}
                onChange={handleChange}
                inputRef={refs.margin}
                error={!!errors.margin}
                helperText={errors.margin}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label={strings.finalPrice}
                name="margin"
                value={product.finalPrice}
                onChange={handleChange}
                inputRef={refs.finalPrice}
                error={!!errors.finalPrice}
                helperText={errors.finalPrice}
              />
            </Grid>
          </Grid>
        </div>

        <div style={{ margin: "0 auto" }}>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            Precio 3
          </Typography>

          <Autocomplete
            value={product.price}
            onInputChange={handleChange}
            inputValue={product.price}
            options={[]} 
            renderInput={(params) => (
              <TextField
                {...params}
                label="Ninguno"
                fullWidth
                variant="outlined"
                autoComplete="off"
                sx={{ marginTop: 2 }}
              />
            )}
          />

          <Grid container spacing={2} style={{ marginTop: "16px" }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label={strings.margin}
                name="margin"
                value={product.margin}
                onChange={handleChange}
                inputRef={refs.margin}
                error={!!errors.margin}
                helperText={errors.margin}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="normal"
                label={strings.finalPrice}
                name="margin"
                value={product.finalPrice}
                onChange={handleChange}
                inputRef={refs.finalPrice}
                error={!!errors.finalPrice}
                helperText={errors.finalPrice}
              />
            </Grid>
          </Grid>
        </div>

        <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
          <Fab color="primary" aria-label="save" onClick={handleSubmit}>
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};

EditProduct.propTypes = {
  updateProduct: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    unit: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    barCode: PropTypes.string,
    qrCode: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    web_page: PropTypes.string,
    currentQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minQuantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tax: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    finalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    active: PropTypes.bool,
  }),
};

export default EditProduct;
