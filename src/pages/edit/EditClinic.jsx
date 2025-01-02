import { useState, useEffect, useRef } from "react"; 
import PropTypes from "prop-types";
import {
  TextField,
  Fab,
  Container,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useTitle } from "../../providers/TitleProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const EditClinic = ({ updateClinic = null }) => {
  const [clinicData, setClinicData] = useState(
    updateClinic || {
      date: null,
      hour: null,
      temp: "",
      weight: "",
      anamnesis: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const refs = {
    date: useRef(null),
    hour: useRef(null),
  };

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useTitle();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updateClinic) {
      updateTitle("", strings.update_clinic, strings.complete_data);
    } else {
      updateTitle("", strings.new_clinic, strings.complete_data);
    }

    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinicData({ ...clinicData, [name]: value });
  };

  const handleDateChange = (newValue) => {
    setClinicData({ ...clinicData, date: newValue });
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setShowAlert(true); // Muestra el mensaje de error si la validación falla
      return;
    }

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
    </Container>
  );
};

EditClinic.propTypes = {
  updateClinic: PropTypes.shape({
    date: PropTypes.instanceOf(Date),
    hour: PropTypes.instanceOf(Date),
    anamnesis: PropTypes.string,
    temp: PropTypes.string,
    weight: PropTypes.string,
  }),
};

export default EditClinic;


