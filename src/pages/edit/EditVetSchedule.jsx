import  { useState, useEffect, useRef } from "react";
import { TextField, Autocomplete, MenuItem, Box } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useNavigate } from "react-router-dom";
import { isBefore, format } from "date-fns";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "../../pages/edit/EditPage";
import { strings } from "../../constants/strings";

const weekdays = [
  { label: "Domingo", value: "SUNDAY" },
  { label: "Lunes", value: "MONDAY" },
  { label: "Martes", value: "TUESDAY" },
  { label: "Miércoles", value: "WEDNESDAY" },
  { label: "Jueves", value: "THURSDAY" },
  { label: "Viernes", value: "FRIDAY" },
  { label: "Sábado", value: "SATURDAY" },
];

const EditVetSchedule = ({ updateSchedule = null }) => {
  const [schedule, setSchedule] = useState(
    updateSchedule || {
      day: weekdays[1].value,
      service: null,
      startingHour: null,
      endingHour: null,
    }
  );
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});
  const refs = {
    service: useRef(null),
    startingHour: useRef(null),
    endingHour: useRef(null),
  };

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle(updateSchedule ? updateSchedule.thumb_url : "",
        strings.new_schedule,                       // Título: "Actualizar usuario"
        strings.complete_data                      // Subtítulo: "Completa los datos"
    );
    setIsLoading(true);

    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}vets?schedules`,
          { withCredentials: true }
        );

        if (!Array.isArray(response.data.data)) {
          throw new Error("La API no devolvió un array");
        }

        const formattedServices = response.data.data.map((item) => ({
          id: item.service?.id ?? item.id, 
          name: item.service?.name ?? item.name, 
        }));
        setServices(formattedServices);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        snackbar("Error al cargar los servicios, intenta nuevamente");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (key, value) => {
    setSchedule((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({
      ...prev,
      [key]: value ? null : `Selecciona ${key}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!schedule.service || !schedule.startingHour || !schedule.endingHour) {
      setErrors({
        service: schedule.service ? null : "Selecciona un servicio",
        startingHour: schedule.startingHour
          ? null
          : "Selecciona la hora de inicio",
        endingHour: schedule.endingHour ? null : "Selecciona la hora de fin",
      });
      return;
    }
    if (isBefore(schedule.endingHour, schedule.startingHour)) {
      setErrors((prev) => ({
        ...prev,
        endingHour: "La hora de fin debe ser mayor a la de inicio",
      }));
      return;
    }
    save();
  };

  const save = async () => {
    setIsLoading(true);
    try {
      const scheduleToSave = {
        ...schedule,
        startingHour: format(schedule.startingHour, "HH:mm"),
        endingHour: format(schedule.endingHour, "HH:mm"),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}vets?create_schedule`,
        scheduleToSave,
        { withCredentials: true }
      );

      console.log(response);
      snackbar("Guardado correctamente");
      navigate(`/main/view-schedule/${response.data.data.id}`);
    } catch (error) {
      console.error(error);
      snackbar("Error, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <TextField
        select
        fullWidth
        margin="normal"
        label={strings.day + " *"}
        value={schedule.day}
        onChange={(e) => handleChange("day", e.target.value)}
      >
        {weekdays.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        fullWidth
        options={services}
        getOptionLabel={(option) => option?.name || ""}
        value={schedule.service || null}
        onChange={(event, newValue) => handleChange("service", newValue)}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            label={strings.service + " *"}
            margin="normal"
            error={!!errors.service}
            helperText={errors.service}
            inputRef={refs.service}
          />
        )}
      />
      <Box sx={{ display: "flex", gap: 2, mt: 1 }} >
      <TimePicker
        label={strings.starting_hour + " *"}
        value={schedule.startingHour}
        onChange={(newValue) => handleChange("startingHour", newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            margin="normal"
            error={!!errors.startingHour}
            helperText={errors.startingHour}
            inputRef={refs.startingHour}
            sx={{ flex: 1 }}
            
          />
        )}
      />
     
      <TimePicker
        label={strings.ending_hour + " *"}
        value={schedule.endingHour}
        onChange={(newValue) => handleChange("endingHour", newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            margin="normal"
            error={!!errors.endingHour}
            helperText={errors.endingHour}
            inputRef={refs.endingHour}
            sx={{ flex: 1 }}
          />
        )}
      />
      </Box>
    </EditPage>
  );
};

export default EditVetSchedule;
