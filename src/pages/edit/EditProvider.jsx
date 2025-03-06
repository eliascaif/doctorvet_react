import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import { strings } from "../../constants/strings";
import * as lib from "../../utils/lib";
import {  TextField, Autocomplete} from "@mui/material";
import axios from "axios";
import EditPage from "../../pages/edit/EditPage";


const EditProvider = ({ updateProvider = null }) => {
  const [provider, setProvider] = useState(
    updateProvider || {
      name: "",
      regions: null,
      email: "",
      phone: "",
    }
  );

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
    updateTitle(
      updateProvider ? updateProvider.thumb_url : "",
      updateProvider
        ? strings.update_provider
        : strings.new_provider,
      strings.complete_data
    );
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
    console.log("Enviando los datos del proveedor:", provider);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}products_providers${
          provider.id ? `?id=${provider.id}` : ""
        }`,
        provider,
        { withCredentials: true }
      );
      console.log("Respuesta de la API:", response.data);
      navigate("/main/view-provider", { state: { id: response.data.data.id } });
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Estado de la respuesta:", error.response.status);
      } else if (error.request) {
        console.error("Detalles de la solicitud:", error.request);
      } else {
        console.error("Error de configuración:", error.message);
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
    <EditPage onSubmit={handleSubmit}>
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
              region: newValue,
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
       </EditPage>
  );
};
export default EditProvider;
/* import PropTypes from "prop-types";

EditProvider.propTypes = {
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
 */