import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Autocomplete,
  Fab,
  Container,
  Box,
  Dialog,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib"; 
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useTitle } from "../../providers/TitleProvider";

const EditOwner = ( {updateOwner = null} ) => {

  const [owner, setOwner] = useState( updateOwner || {
    name: '',
    address: '',
    region: null,
    phone: '',
    email: '',
    regional_id: '',
    fiscal_type: null,
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    name: useRef(null),
    email: useRef(null),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [regions, setRegions] = useState([]);
  const [fiscalTypes, setFiscalTypes] = useState([]);
  
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useTitle();

  useEffect(() => {

    if (updateOwner)
      updateTitle('Editando propietario', 'Completa los datos')
    else
      updateTitle('Nuevo propietario', 'Completa los datos')
    
    setIsLoading(true);

    const fetchForInput = async () => {
      const ownersForInput = await lib.fetchOwnersForInput();
      setRegions(ownersForInput.regions);
      setFiscalTypes(ownersForInput.finance_types_fiscal);

      setIsLoading(false);
    };
    fetchForInput();

  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwner({ ...owner, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lib.validateNonEmpty('name', owner.name, setErrors, refs.name) ||
        !lib.validateEmail('email', owner.email, setErrors, refs.email, true))
      return;

    if (updateOwner)
      update();
    else
      save();

  };
  
  const save = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}owners`,
        owner,
        { withCredentials: true }
      );
      // console.log(response);
      navigate(`/owners/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar('Error, intenta nuevamente');
    } finally {
      setIsLoading(false);
    }
  }

  const update = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}owners`,
        owner,
        { withCredentials: true }
      );
      navigate(`/owners/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar('Error, intenta nuevamente');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container>

      <Box 
        sx={{ mb: 4 }}
        component="form"
        onSubmit={handleSubmit}
        >

        <TextField
          fullWidth
          margin="normal"
          label="Nombre *"
          name="name"
          value={owner.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Dirección"
          name="address"
          value={owner.address}
          onChange={handleChange}
        />
        <Autocomplete
          fullWidth
          options={regions}
          getOptionLabel={(option) => (option ? option.friendly_name : "")} 
          value={owner.region}
          onChange={(e, newValue) =>
            setOwner({
              ...owner,
              region: newValue
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Región"
              name="region"
              margin="normal"
            />
          )}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Teléfono"
          name="phone"
          value={owner.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={owner.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Identificación regional (DNI/DU/Pasaporte)"
          name="idNumber"
          value={owner.regional_id}
          onChange={handleChange}
        />
        <Autocomplete
          margin="normal"
          options={fiscalTypes}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={owner.fiscal_type}
          onChange={(e, newValue) => {
            setOwner({ ...owner, fiscalType: newValue });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo fiscal"
              name="fiscal_type"
              margin="normal"
            />
          )}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Notas"
          name="notes"
          value={owner.notes}
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

        {isLoading && (
          <CircularProgress
            size={42}
            sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
          />
        )}
        <Dialog open={isLoading} />
        
      </Box>

    </Container>
  );
};

export default EditOwner;
