import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Autocomplete,
  Box,
  AppBar,
  Toolbar,
  Avatar,
  Dialog,
  CircularProgress,
  IconButton,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as lib from '../../utils/lib';
import { strings } from '../../constants/strings';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../contexts/AuthContext';

const EditVet = ({ isUpdate = false, initialVetData = null }) => {

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

  const location = useLocation();
  const { pre_access_token, isInitCreate } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const [vet, setVet] = useState(initialVetData || {
    name: '',
    address: '',
    region: null,
    phone: '',
    email: '',
    web_page: '',
    notes: '',
    owner_naming: 'OWNER',
    pet_naming: 'PATIENT',
    unit_system: 'METRIC',
    hour_format: '24_HS',
    mobile_services: false,
    email_messaging: true,
    sells_planning_activity: true,
    sells_save_p1: false,
    sells_accept_suggested: true,
    sells_lock_price: false,
    default_sell_point: null,
    fiscal_id: '',
    fiscal_type: null,
  });

  //required and errors
  const [errorName, setErrorName] = useState('');
  const nameRef = useRef(null);
  const [errorRegion, setErrorRegion] = useState('');
  const regionRef = useRef(null);
  const [errorEmail, setErrorEmail] = useState('');
  const emailRef = useRef(null);

  //fetch data
  const [regions, setRegions] = useState([]);
  const [sellPoints, setSellPoints] = useState([]);
  const [fiscalTypes, setFiscalTypes] = useState([]);

  const ownerNamingOptions = [
    { label: 'Cliente', value: 'CLIENT' },
    { label: 'Dueño', value: 'LANDLORD' },
    { label: 'Propietario', value: 'OWNER' },
    { label: 'Tutor', value: 'TUTOR' }
  ];

  const petNamingOptions = [
    { label: 'Animal', value: 'ANIMAL' },
    { label: 'Mascota', value: 'PET' },
    { label: 'Paciente', value: 'PATIENT' }
  ];

  useEffect(() => {
    const fetchRegions = async () => {
      setIsLoading(true);
      const regions = await lib.fetchRegions();
      setRegions(regions);
      setIsLoading(false);
    }    

    fetchRegions();

    //in create, sell point doesnt exists
    //implement
    // if (isUpdate) {
    //   setDefaultSellPoint();
    // }

    nameRef.current.focus();
  }, []);

  const fetchFiscalTypes = async (country) => {
    const fiscalTypes = await lib.fetchFiscalTypes(country);
    setFiscalTypes(fiscalTypes);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVet({
      ...vet,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  const handleSubmit = async() => {
    if (isUpdate){
      update();
      return;
    }
      
    save();
  }

  const save = async () => {

    if (!lib.validateNonEmpty(vet.name, setErrorName, nameRef) ||
        !lib.validateNonEmpty(vet.region, setErrorRegion, regionRef) || 
        !lib.validateEmail(vet.email, setErrorEmail, emailRef))
      return;

    setIsLoading(true);

    vet.pre_access_token = pre_access_token;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}vets?create_vet`,
        vet
      );
      const response2 = await axios.post(
        `${import.meta.env.VITE_API_URL}users?email_auth_web`,
        { vet: { id: response.data.data.id }, pre_access_token: pre_access_token },
        { withCredentials: true }
      );

      login();
      navigate('/main');

      //localStorage.setItem('isAuthenticated', true);
      //navigate('/main');

      // const { login } = useAuth();
      // login();
      // navigate('/main');
      // useEffect(() => {
      //   const { login } = useAuth();
      //   login();
      //   navigate('/');
      // }, []);
    } catch (error) {
      lib.handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const update = async () => {

  }

  // const validateRegion = () => {
  //   if (!vet.region) {
  //     setErrorRegion(strings.error_corrige_campo);
  //     regionRef.current.focus();
  //     return false;
  //   }

  //   return lib.validateNonEmpty(vet.region.friendly_name, setErrorRegion, regionRef);
  // }

  return (
    <Container>

      {/* Barra Superior */}
      <AppBar position="static" color="primary" sx={{ mt: 4 }}>
        <Toolbar>
          {/* Botón de flecha hacia atrás */}
          {/* <IconButton color="inherit" onClick={handleBackClick} edge="start" sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton> */}
          {/* Icono */}
          {!isInitCreate && (
            <Avatar sx={{ bgcolor: 'gray.500' }}>
              <StoreIcon />
            </Avatar>
          )}

          {/* Contenedor para el texto */}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6" component="div">
              {isUpdate ? 'Editar veterinaria' : 'Nueva veterinaria'}
            </Typography>
            <Typography variant="subtitle2" component="div">
              Completa los datos
            </Typography>
          </Box>

          {/* Espaciador flexible para empujar el botón de cierre hacia la derecha */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Botón de cierre (X) en el extremo derecho */}
          <IconButton color="inherit" onClick={handleBackClick} edge="end">
            <CloseIcon />
          </IconButton>

        </Toolbar>
      </AppBar>

      {/* Contenido del formulario */}
      <Box sx={{ mt: 2, mb: 4 }}>
        {/* Campos de texto */}
        <TextField
          fullWidth
          label="Nombre *"
          name="name"
          value={vet.name}
          onChange={handleChange}
          margin="normal"
          inputRef={nameRef}
          error={Boolean(errorName)}
          helperText={errorName}
        />

        <TextField
          fullWidth
          label="Dirección"
          name="address"
          value={vet.address}
          onChange={handleChange}
          margin="normal"
          multiline
        />

        {/* Región con Autocomplete */}
        <Autocomplete
          options={regions}
          getOptionLabel={(option) => (option ? option.friendly_name : "")}
          value={vet.region}
          onChange={(e, newValue) => {
            setVet({ ...vet, region: newValue });
            fetchFiscalTypes(newValue.country);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Región *"
              name="region"
              margin="normal"
              inputRef={regionRef}
              error={Boolean(errorRegion)}
              helperText={errorRegion}
            />
          )}
        />

        <TextField
          fullWidth
          label="Teléfono"
          name="phone"
          value={vet.phone}
          onChange={handleChange}
          margin="normal"
        />

        {!isUpdate && (
          <TextField
            fullWidth
            label="Email *"
            name="email"
            value={vet.email}
            onChange={handleChange}
            margin="normal"
            inputRef={emailRef}
            error={Boolean(errorEmail)}
            helperText={errorEmail}
          />
        )}

        <TextField
          fullWidth
          label="Página Web"
          name="web_page"
          value={vet.web_page}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Notas"
          name="notes"
          value={vet.notes}
          onChange={handleChange}
          margin="normal"
          multiline
        />

        {/* Divisor */}
        <Divider sx={{ my: 4 }} />

        {/* Información adicional */}
        <Typography variant="body1" gutterBottom>
          A continuación encontrarás configuraciones opcionales que puedes cambiar más adelante.
        </Typography>

        {/* Nombramiento de clientes */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="owner-naming-label">Nombramiento de clientes</InputLabel>
          <Select
            labelId="owner-naming-label"
            label="Nombramiento de clientes"
            name="owner_naming"
            value={vet.owner_naming}
            onChange={handleChange}
          >
            {ownerNamingOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nombramiento de pacientes */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="pet-naming-label">Nombramiento de pacientes</InputLabel>
          <Select
            labelId="pet-naming-label"
            label="Nombramiento de pacientes"
            name="pet_naming"
            value={vet.pet_naming}
            onChange={handleChange}
          >
            {petNamingOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sistema de medida */}
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Sistema de medida</FormLabel>
          <RadioGroup
            row
            name="unit_system"
            value={vet.unit_system}
            onChange={handleChange}
          >
            <FormControlLabel
              value="METRIC"
              control={<Radio />}
              label="Métrico decimal"
            />
            <FormControlLabel
              value="ENGLISH"
              control={<Radio />}
              label="Inglés"
            />
          </RadioGroup>
        </FormControl>

        {/* Formato horario */}
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Formato horario</FormLabel>
          <RadioGroup
            row
            name="hour_format"
            value={vet.hour_format}
            onChange={handleChange}
          >
            <FormControlLabel
              value="24_HS"
              control={<Radio />}
              label="24 hs"
            />
            <FormControlLabel
              value="AM_PM"
              control={<Radio />}
              label="AM / PM"
            />
          </RadioGroup>
        </FormControl>

        {/* Checkboxes */}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={vet.mobile_services}
                onChange={handleChange}
                name="mobile_services"
              />
            }
            label="Servicios móviles a domicilio"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={vet.email_messaging}
                onChange={handleChange}
                name="email_messaging"
              />
            }
            label="Mensajería a clientes a través de email"
          />
        </FormGroup>

        {/* Divisor */}
        <Divider sx={{ my: 4 }} />

        {/* Ventas */}
        <Typography variant="subtitle1" gutterBottom>
          Ventas
        </Typography>

        {/* Checkboxes de ventas */}
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={vet.sells_planning_activity}
                onChange={handleChange}
                name="sells_planning_activity"
              />
            }
            label="Mostrar pantalla de suministro próximo"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={vet.sells_save_p1}
                onChange={handleChange}
                name="sells_save_p1"
              />
            }
            label="Sobreescribir precio 1 al registrar"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={vet.sells_accept_suggested}
                onChange={handleChange}
                name="sells_accept_suggested"
              />
            }
            label="Aceptar sugerencias"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={vet.sells_lock_price}
                onChange={handleChange}
                name="sells_lock_price"
              />
            }
            label="Bloquear cambio de precio"
          />
        </FormGroup>

        {/* Punto de venta por defecto */}
        {!isUpdate && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="default-sell-point-label">Punto de venta por defecto</InputLabel>
            <Select
              labelId="default-sell-point-label"
              label="Punto de venta por defecto"
              name="default_sell_point"
              value={vet.default_sell_point ? vet.default_sell_point : ''}
              onChange={handleChange}
            >
              {sellPoints.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Divisor */}
        <Divider sx={{ my: 4 }} />

        {/* Fiscal */}
        <Typography variant="subtitle1" gutterBottom>
          Fiscal
        </Typography>

        <TextField
          fullWidth
          label="CUIT/NIF/CIF (ID fiscal)"
          name="fiscal_id"
          value={vet.fiscal_id}
          onChange={handleChange}
          margin="normal"
        />

        <Autocomplete
          options={fiscalTypes}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={vet.fiscal_type}
          onChange={(event, newValue) => {
            setVet({ ...vet, fiscalType: newValue });
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

        {/* Botón de guardar */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
              variant="contained" 
              color="primary" 
              size="large"
              fullWidth
              onClick={handleSubmit}
          >
            Guardar
          </Button>
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

export default EditVet;