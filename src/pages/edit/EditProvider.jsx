import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../providers/SnackBarProvider";
import {useAppBar} from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import { strings } from "../../constants/strings";
import * as lib from "../../utils/lib";
import { Box, Container, TextField,Autocomplete,Fab } from "@mui/material";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";

 const EditProvider = ({ updateProvider = null }) => {
  const [provider, setProvider] = useState(updateProvider || {
    name: "",
    regions: null,
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    name: useRef(null),
    email: useRef(null),
  });

  const [regiones, setRegiones] = useState({});
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updateProvider) {
      updateTitle("", strings.update_provider, strings.complete_data);
    } else {
      updateTitle("", strings.new_provider, strings.complete_data);
    }
    setIsLoading(true);

    const getRegions = async () => {
      try {
        const fechedRegions = await lib.fetchRegions();
        setRegiones(fechedRegions || []);
      } catch (error) {
        lib.handleError(error);
        snackbar("Error al obtener las regiones");
      } finally {
        setIsLoading(false);
      }
    };
    getRegions();
  }, [updateProvider, updateTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProvider({ ...provider, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !lib.validateNonEmpty("name", provider.name, setErrors, refs.name) ||
      !lib.validateEmail("email", provider.email, setErrors, refs.email, true)
    )
      return;
    if (updateProvider) {
      update();
    } else {
      save();
    }
  };

  const save = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}products_providers${provider.id ? `?id=${provider.id}` : ""}`,
        provider,
        { withCredentials: true }
      );
      console.log("Save successful:", response.data);
      navigate("/main/view-provider", { state: { id: response.data.data.id } });
    } catch (error) {
      console.error("Error details:", error); // Log completo del error
      if (error.response) {
        // El servidor devolvió un estado de error
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        snackbar(`Error del servidor: ${error.response.data.message || "Intente nuevamente"}`);
      } else if (error.request) {
        // La solicitud fue enviada pero no se recibió respuesta
        console.error("Request details:", error.request);
        snackbar("No se recibió respuesta del servidor. Verifique su conexión.");
      } else {
        // Error en la configuración de la solicitud
        console.error("Error en la configuración:", error.message);
        snackbar(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const update = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}products_providers?id=${provider.id}`,
        provider,
        { withCredentials: true }
      );
      console.log("Update successful:", response.data);
      navigate("/main/view-provider", { state: { id: response.data.data.id } });
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al actualizar el proveedor, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Container>
      <Box
        sx={{
          mb: 4,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          fullWidth
          margin="normal"
          label={strings.name + "*"}
          name="name"
          value={provider.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        ></TextField>
        <TextField
          fullWidth
          margin="normal"
          label={strings.address}
          name="address"
          value={provider.address}
          onChange={handleChange}
        />
        <Autocomplete
          fullWidth
          options={regiones}
          getOptionLabel={(option) => (option ? option.friendly_name : "")}
          value={provider.region}
          onChange={(e, newValue) =>
            setProvider({
              ...provider,
              region: newValue
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.region}
              name="region"
              margin="normal"
            />
          )}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.phone}
          name="phone"
          value={provider.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.email}
          name="email"
          value={provider.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.regional_id}
          name="idNumber"
          value={provider.regional_id}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.notes}
          name="notes"
          value={provider.notes}
          onChange={handleChange}
          multiline
          rows={4}
        />

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
            onClick={handleSubmit}
          >
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};
export default EditProvider;
import PropTypes from "prop-types";

EditProvider.propTypes = {
  /**
   * Object containing provider data to be updated. If null, the component will handle creating a new provider.
   * Expected shape:
   * {
   *   name: string,
   *   address: string,
   *   region: object (optional, contains the selected region details),
   *   phone: string,
   *   email: string,
   *   regional_id: string (optional, unique identifier for the region),
   *   fiscal_type: string (optional, fiscal categorization of the provider),
   *   notes: string (optional, additional notes about the provider)
   * }
   */
  updateProvider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string,
    region: PropTypes.object,
    phone: PropTypes.string,
    email: PropTypes.string.isRequired,
    regional_id: PropTypes.string,
    fiscal_type: PropTypes.string,
    notes: PropTypes.string,
  }),
};
