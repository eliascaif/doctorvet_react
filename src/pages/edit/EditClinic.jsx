import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Fab,
  Container,
  Box,
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

const EditClinic = ({ updateClinic = null }) => {
  const [clinicData, setClinicData] = useState(
    updateClinic || {
      date: "",
      hour: "",
      temp: "",
      weight: "",
      anamnesis: "",
    }
  );

  const [errors, setErrors] = useState({});
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

    setIsLoading(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinicData({ ...clinicData, [name]: value });
  };

  const handleDateChange = (newValue) => {
    setClinicData({ ...clinicData, date: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !lib.validateNonEmpty("date", clinicData.date, setErrors, refs.date) ||
      !lib.validateNonEmpty("hour", clinicData.hour, setErrors, refs.hour)
    )
      return;

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
    </Container>
  );
};

EditClinic.propTypes = {
  updateClinic: PropTypes.shape({
    date: PropTypes.string,
    hour: PropTypes.string,
    anamnesis: PropTypes.string,
    temp: PropTypes.string,
    weight: PropTypes.string,
  }),
};

export default EditClinic;
