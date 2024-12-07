import  { useState, useEffect, useRef } from 'react';
import {
  Container,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DogIcon from '@mui/icons-material/Pets';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import * as lib from '../../utils/lib';
import { strings } from '../../constants/strings';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import PetOwnerSelector from '../../components/ProfileItem';
import ProfileItem from '../../components/ProfileItem';
import { useConfig } from '../../contexts/ConfigContext';

const EditAgenda = ({ isUpdate = false, initialAgendaData = null }) => {

  const { config } = useConfig();
  
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const [agendaData, setAgendaData] = useState(initialAgendaData || {
    event_name: '',
    description: '',
    begin_time: null,
    end_time: null,
    private_task: false,
    user: null,
    owner: null,
    pet: null,
    product: null,
  });

  //required and errors
  const [errorEventName, setErrorEventName] = useState('');
  const eventNameRef = useRef(null);
  const [errorBeginTime, setErrorBeginDate] = useState('');
  const beginDateRef = useRef(null);

  //fetch data
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await lib.fetchProducts();
      setProducts(products);
    };
  
    setIsLoading(true);
    fetchProducts();
    setIsLoading(false);

    eventNameRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAgendaData({
      ...agendaData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!lib.validateNonEmpty(agendaData.event_name, setErrorEventName, eventNameRef)) {
      return;
    }
    if (!agendaData.begin_date || !agendaData.begin_time) {
      // Mostrar error correspondiente
      return;
    }

    // Preparar datos para enviar
    const dataToSend = {
      ...agendaData,
      begin_time: combineDateTime(agendaData.begin_date, agendaData.begin_time),
      end_time: agendaData.end_date && agendaData.end_time ? combineDateTime(agendaData.end_date, agendaData.end_time) : null,
    };

    setIsLoading(true);

    try {
      if (isUpdate) {
        await axios.put(`/api/agenda/${agendaData.id}`, dataToSend);
      } else {
        await axios.post('/api/agenda', dataToSend);
      }
      navigate('/main');
    } catch (error) {
      lib.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const combineDateTime = (date, time) => {
    const dateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    return dateTime;
  };

  return (
    <Container>

      {/* Contenido del formulario */}
      <Box sx={{ mt: 2, mb: 4 }}>

        {/* Selector de Mascota */}
        <ProfileItem onRemove={handleRemoveOwner} />        

        {/* Selector de Propietario */}
        <ProfileItem onRemove={handleRemovePet} />        

        {/* Selector de Usuario */}
        {currentUser.role !== 'USER' && (
          <ProfileItem onRemove={handleRemoveUser} />
        )}

        <Divider sx={{ my: 2 }} />

        {/* Nombre del Evento */}
        <TextField
          fullWidth
          label="Nombre del Evento *"
          name="event_name"
          value={agendaData.event_name}
          onChange={handleChange}
          margin="normal"
          inputRef={eventNameRef}
          error={Boolean(errorEventName)}
          helperText={errorEventName}
        />

        {/* Selector de Servicio */}
        <Autocomplete
          options={products}
          getOptionLabel={(option) => option.name}
          value={agendaData.product}
          onChange={(event, newValue) => {
            setAgendaData({ ...agendaData, product: newValue });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Servicio"
              name="product"
              margin="normal"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    <SearchIcon />
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* Fecha y Hora de Inicio */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* DateTime Picker */}
          <DateTimePicker
            label="Fecha de Inicio *"
            value={selectedDateTime}
            onChange={(newValue) => {
              setAgendaData({ ...agendaData, begin_time: newValue });
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        {/* <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <DatePicker
            label="Fecha de Inicio *"
            value={agendaData.begin_date}
            onChange={(newValue) => {
              setAgendaData({ ...agendaData, begin_date: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <CalendarTodayIcon />
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TimePicker
            label="Hora de Inicio *"
            value={agendaData.begin_time}
            onChange={(newValue) => {
              setAgendaData({ ...agendaData, begin_time: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <AccessTimeIcon />
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box> */}

        {/* Fecha y Hora de Fin */}
        {/* <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <DatePicker
            label="Fecha de Fin"
            value={agendaData.end_date}
            onChange={(newValue) => {
              setAgendaData({ ...agendaData, end_date: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <CalendarTodayIcon />
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TimePicker
            label="Hora de Fin"
            value={agendaData.end_time}
            onChange={(newValue) => {
              setAgendaData({ ...agendaData, end_time: newValue });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="normal"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <AccessTimeIcon />
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box> */}

        {/* Descripción */}
        <TextField
          fullWidth
          label="Descripción"
          name="description"
          value={agendaData.description}
          onChange={handleChange}
          margin="normal"
          multiline
        />

        {/* Tarea Privada */}
        <FormControlLabel
          control={
            <Checkbox
              checked={agendaData.private_task}
              onChange={handleChange}
              name="private_task"
            />
          }
          label="Privado"
        />

        {/* Botón de Guardar */}
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

export default EditAgenda;
