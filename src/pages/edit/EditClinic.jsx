<<<<<<< HEAD
import { useState, useEffect, useRef } from "react";
=======
import { useState, useEffect, useRef } from "react"; 
>>>>>>> origin/master
import PropTypes from "prop-types";
import {
  TextField,
  Fab,
  Container,
  Box,
<<<<<<< HEAD
=======
  Snackbar,
  Alert,
>>>>>>> origin/master
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
<<<<<<< HEAD
import { useTitle } from "../../providers/TitleProvider";
=======
import { useAppBar } from "../../providers/AppBarProvider";
>>>>>>> origin/master
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
<<<<<<< HEAD
=======
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
>>>>>>> origin/master

const EditClinic = ({ updateClinic = null }) => {
  const [clinicData, setClinicData] = useState(
    updateClinic || {
<<<<<<< HEAD
      date: "",
      hour: "",
=======
      date: null,
      hour: null,
>>>>>>> origin/master
      temp: "",
      weight: "",
      anamnesis: "",
    }
  );

  const [errors, setErrors] = useState({});
<<<<<<< HEAD
=======
  const [showAlert, setShowAlert] = useState(false);

>>>>>>> origin/master
  const refs = {
    date: useRef(null),
    hour: useRef(null),
  };

  const navigate = useNavigate();
  const snackbar = useSnackbar();
<<<<<<< HEAD
  const { updateTitle } = useTitle();
=======
  const { updateTitle } = useAppBar();
>>>>>>> origin/master
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updateClinic) {
      updateTitle("", strings.update_clinic, strings.complete_data);
    } else {
      updateTitle("", strings.new_clinic, strings.complete_data);
    }

<<<<<<< HEAD
    setIsLoading(true);
=======
    setIsLoading(false);
>>>>>>> origin/master
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinicData({ ...clinicData, [name]: value });
  };

  const handleDateChange = (newValue) => {
    setClinicData({ ...clinicData, date: newValue });
<<<<<<< HEAD
=======
    setErrors((prev) => ({ ...prev, date: "" })); // Limpia error al actualizar
  };

  const handleTimeChange = (newValue) => {
    setClinicData({ ...clinicData, hour: newValue });
    setErrors((prev) => ({ ...prev, hour: "" })); // Limpia error al actualizar
  };

  const validateFields = () => {
    const newErrors = {};
    if (!clinicData.date) {
      newErrors.date = strings.error_date_required || "Fecha es requerida";
    }
    if (!clinicData.hour) {
      newErrors.hour = strings.error_hour_required || "Hora es requerida";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
>>>>>>> origin/master
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    if (
      !lib.validateNonEmpty("date", clinicData.date, setErrors, refs.date) ||
      !lib.validateNonEmpty("hour", clinicData.hour, setErrors, refs.hour)
    )
      return;
=======
    if (!validateFields()) {
      setShowAlert(true); // Muestra el mensaje de error si la validación falla
      return;
    }
>>>>>>> origin/master

    if (updateClinic) {
      update();
    } else {
      save();
    }
  };

  const save = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}clinics`,
        clinicData,
        { withCredentials: true }
      );
      navigate(`/main/view-clinic/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar(strings.error_generic);
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}clinics`,
        clinicData,
        { withCredentials: true }
      );
      navigate(`/clinics/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar(strings.error_generic);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }} component="form" onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
<<<<<<< HEAD
          <DatePicker
            label={`${strings.date} *`}
            value={clinicData.date}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                margin="normal"
                sx={{
                  width: '100%',
                  minWidth: '300px', // Asegura que tenga el mismo ancho mínimo que los demás
                  '& .MuiInputBase-root': {
                    height: '56px', // Ajusta la altura para coincidir con los otros campos
                  },
                }}
                name="date"
                inputRef={refs.date}
                error={!!errors.date}
                helperText={errors.date}
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          fullWidth
          margin="normal"
          label={`${strings.hour} *`}
          name="hour"
          value={clinicData.hour}
          onChange={handleChange}
          inputRef={refs.hour}
          error={!!errors.hour}
          helperText={errors.hour}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.anamnesis}
          name="anamnesis"
          value={clinicData.anamnesis}
          onChange={handleChange}
          multiline
          rows={4}
        />
=======
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <DatePicker
              label={`${strings.date} *`}
              value={clinicData.date}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  name="date"
                  inputRef={refs.date}
                  error={!!errors.date}
                  helperText={errors.date}
                  sx={{ flex: 1 }}
                />
              )}
            />

            <TimePicker
              label={`${strings.hour} *`}
              value={clinicData.hour}
              onChange={handleTimeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  name="hour"
                  inputRef={refs.hour}
                  error={!!errors.hour}
                  helperText={errors.hour}
                  sx={{ flex: 1 }}
                />
              )}
            />
          </Box>
        </LocalizationProvider>

>>>>>>> origin/master
        <TextField
          fullWidth
          margin="normal"
          label={strings.temp}
          name="temp"
          value={clinicData.temp}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.weight}
          name="weight"
          value={clinicData.weight}
          onChange={handleChange}
        />
<<<<<<< HEAD
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Fab color="primary" aria-label="add" onClick={handleSubmit}>
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
=======
        <TextField
          fullWidth
          margin="normal"
          label={strings.anamnesis}
          name="anamnesis"
          value={clinicData.anamnesis}
          onChange={handleChange}
          multiline
          rows={4}
        />

        <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
          <Fab color="primary" aria-label="save" onClick={handleSubmit}>
            <CheckIcon />
          </Fab>
        </Box>
   
      </Box>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {strings.complete_required_fields || "Por favor, complete los campos requeridos."}
        </Alert>
      </Snackbar>
>>>>>>> origin/master
    </Container>
  );
};

EditClinic.propTypes = {
  updateClinic: PropTypes.shape({
<<<<<<< HEAD
    date: PropTypes.string,
    hour: PropTypes.string,
=======
    date: PropTypes.instanceOf(Date),
    hour: PropTypes.instanceOf(Date),
>>>>>>> origin/master
    anamnesis: PropTypes.string,
    temp: PropTypes.string,
    weight: PropTypes.string,
  }),
};

export default EditClinic;
<<<<<<< HEAD
=======


>>>>>>> origin/master
