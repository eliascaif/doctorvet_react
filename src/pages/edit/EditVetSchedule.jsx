import React, { useState, useEffect, useRef } from "react";
import { 
  TextField, 
  Autocomplete, 
  Box, 
  Divider, 
  Typography, 
  IconButton,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import { useFormContext } from "../../providers/FormProvider";
import EditPage from "./EditPage";
import { handleError } from "../../utils/lib";
import ListItemWAvatarRemove from "../../layouts/ListItemWAvatarRemove";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import { useGlobalsItems } from "../../providers/GlobalItemsProvider";
import { validateNonEmpty } from "../../utils/lib";

const EditVetSchedule = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle, toggleFab } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();
  const location = useLocation();
  const { vetSchedule, setVetSchedule, vetSchedulesList, setVetSchedulesList } = useGlobalsItems();

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    starting_hour: useRef(null),
    ending_hour: useRef(null),
    service: useRef(null),
  });

  const [services, setServices] = useState([]);
  
  const daysOfWeek = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miércoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sábado" },
    { value: "SUNDAY", label: "Domingo" }
  ];

  useEffect(() => {
    setVetSchedule({
      ...vetSchedule,
    });

    if (location.state?.user) {
      setVetSchedule(prev => ({
        ...prev,
        user: location.state.user
      }));
    }

    if (location.state?.service) {
      setVetSchedule(prev => ({
        ...prev,
        service: location.state.service
      }));
    }

    updateTitle(undefined, "Crear horario", "Completa los datos");
    toggleFab(false);
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const servicesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}vets?services&min`,
        { withCredentials: true }
      );

      const availableServices = (servicesResponse.data.data || []);
      setServices(availableServices);
    } catch (error) {
      handleError(error);
      snackbar("Error al cargar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchUser = () => {
    navigate("/main/search-user", { state: { from: "/main/edit-vet-schedule" } });
  };

  const handleRemoveUser = () => {
    setVetSchedule(prev => ({ ...prev, user: null }));
  };

  const handleAddSchedule = () => {
    // Validar campos requeridos
    if (!vetSchedule.weekday || !vetSchedule.starting_hour || !vetSchedule.ending_hour || !vetSchedule.user || !vetSchedule.service) {
      snackbar("Completa todos los campos");
      return;
    }

    // Validar que la hora de fin sea posterior a la hora de inicio
    if (vetSchedule.ending_hour.isBefore(vetSchedule.starting_hour)) {
      snackbar("La hora de fin debe ser posterior a la hora de inicio");
      return;
    }

    // Agregar el horario a la lista global
    const newSchedules = [...vetSchedulesList, { ...vetSchedule }];
    setVetSchedulesList(newSchedules);

    // Limpiar el formulario
    setVetSchedule({
      weekday: 'MONDAY',
      starting_hour: null,
      ending_hour: null,
      user: null,
      service: null
    });
  };

  const handleSubmit = async () => {
    if (vetSchedulesList.length === 0) {
      snackbar("Agrega al menos un horario");
      return;
    }

    setIsLoading(true);
    try {
      // Transformar los horarios al formato esperado por el backend
      const schedulesToSend = vetSchedulesList.map(s => {
        // Formatear las horas en formato HH:mm
        const startTime = s.starting_hour.format('HH:mm');
        const endTime = s.ending_hour.format('HH:mm');

        return {
          weekday: s.weekday,
          starting_hour: startTime,
          ending_hour: endTime,
          service: {
            id: s.service.id,
            name: s.service.name,
          },
          user: {
            id: s.user.id,
            name: s.user.name,
            email: s.user.email
          }
        };
      });

      console.log('Horarios a enviar:', schedulesToSend);

      await axios.post(
        `${import.meta.env.VITE_API_URL}vets?create_schedule`,
        schedulesToSend,
        { withCredentials: true }
      );

      // Limpiar la lista después de un envío exitoso
      setVetSchedulesList([]);
      
      navigate("/main/view-vet-services-schedules");
    } catch (error) {
      handleError(error);
      snackbar("Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <Box sx={{ width: "100%" }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Día de la semana</InputLabel>
          <Select
            value={vetSchedule.weekday}
            label="Día de la semana"
            onChange={(e) => {
              setVetSchedule(prev => ({ ...prev, weekday: e.target.value }));
            }}
          >
            {daysOfWeek.map((day) => (
              <MenuItem key={day.value} value={day.value}>
                {day.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box display="flex" gap={2} sx={{ mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ flex: 1 }}>
              <TimePicker
                label="Hora de inicio"
                value={vetSchedule.starting_hour}
                onChange={(newValue) => {
                  setVetSchedule(prev => ({ ...prev, starting_hour: newValue }));
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
                inputRef={refs.starting_hour}
                error={!!errors.starting_hour}
                helperText={errors.starting_hour}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TimePicker
                label="Hora de fin"
                value={vetSchedule.ending_hour}
                onChange={(newValue) => {
                  setVetSchedule(prev => ({ ...prev, ending_hour: newValue }));
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true } }}
                inputRef={refs.ending_hour}
                error={!!errors.ending_hour}
                helperText={errors.ending_hour}
              />
            </Box>
          </LocalizationProvider>
        </Box>

        <Box display="flex" gap={2} alignItems="center" sx={{ mb: 2 }}>
          <ListItemWAvatarRemove
            primary={vetSchedule.user?.name || "SELECCIONAR"}
            onClick={handleSearchUser}
            onDelete={handleRemoveUser}
            avatarContent={vetSchedule.user?.thumb_url ? null : <PersonIcon />}
            thumbUrl={vetSchedule.user?.thumb_url}
          />
        </Box>

        <Box display="flex" gap={1} alignItems="center">
          <Autocomplete
            fullWidth
            options={services}
            getOptionLabel={(option) => (option ? option.name : "")}
            value={vetSchedule.service}
            onChange={(e, newValue) => {
              setVetSchedule(prev => ({ ...prev, service: newValue }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Servicio"
                margin="normal"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                inputRef={refs.service}
                error={!!errors.service}
                helperText={errors.service}
              />
            )}
          />

          <IconButton onClick={() => navigate("/main/search-service")} sx={{ marginTop: 1 }}>
            <SearchIcon />
          </IconButton>
          <IconButton onClick={handleAddSchedule} sx={{ marginTop: 1 }}>
            <KeyboardReturnIcon />
          </IconButton>
        </Box>

        {/* <Divider sx={{ my: 2 }} /> */}

        {/* <Typography variant="h6" sx={{ mb: 2 }}>
          Horarios agregados
        </Typography> */}

        {vetSchedulesList.map((s, index) => (
          <Box 
            key={index} 
            sx={{ 
              mt: 1,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography>
              {s.service?.name} - {daysOfWeek.find(d => d.value === s.weekday)?.label} de {s.starting_hour.format('HH:mm')} a {s.ending_hour.format('HH:mm')} - {s.user?.name}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => {
                const newSchedules = vetSchedulesList.filter((_, i) => i !== index);
                setVetSchedulesList(newSchedules);
              }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </EditPage>
  );
};

export default EditVetSchedule; 
