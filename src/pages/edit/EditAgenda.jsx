import { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  Box,
  Fab,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as lib from "../../utils/lib";
import { strings } from "../../constants/strings";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CheckIcon from "@mui/icons-material/Check";

const EditAgenda = ({ isUpdate = false, initialAgendaData = null }) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [agendaData, setAgendaData] = useState(
    initialAgendaData || {
      event_name: "",
      description: "",
      begin_time: null,
      end_time: null,
      private_task: false,
      user: null,
      owner: null,
      pet: null,
      product: null,
    }
  );

  const [errorEventName, setErrorEventName] = useState("");
  const eventNameRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await lib.fetchProducts();
      setProducts(fetchedProducts);
    };

    setIsLoading(true);
    fetchProducts();
    setIsLoading(false);

    if (eventNameRef.current) {
      eventNameRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAgendaData({
      ...agendaData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (
      !lib.validateNonEmpty(
        agendaData.event_name,
        setErrorEventName,
        eventNameRef
      )
    ) {
      return;
    }

    const dataToSend = {
      ...agendaData,
      begin_time: agendaData.begin_time,
      end_time: agendaData.end_time,
    };

    setIsLoading(true);
    try {
      if (isUpdate) {
        await axios.put(`/api/agenda/${agendaData.id}`, dataToSend);
      } else {
        await axios.post("/api/agenda", dataToSend);
      }
      navigate("/main");
    } catch (error) {
      lib.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          {isUpdate ? strings.update_agenda : strings.new_agenda}
        </Typography>

        <Divider sx={{ my: 2 }} />

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

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Fecha *"
                value={agendaData.begin_time}
                onChange={(newValue) => {
                  setAgendaData({ ...agendaData, begin_time: newValue });
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
              <TimePicker
                label="Hora *"
                value={agendaData.begin_time}
                onChange={(newValue) => {
                  setAgendaData({ ...agendaData, begin_time: newValue });
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Fecha Fin"
                value={agendaData.end_time}
                onChange={(newValue) => {
                  setAgendaData({ ...agendaData, end_time: newValue });
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
              <TimePicker
                label="Hora Fin"
                value={agendaData.end_time}
                onChange={(newValue) => {
                  setAgendaData({ ...agendaData, end_time: newValue });
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </Box>
          </Box>
        </LocalizationProvider>

        <TextField
          fullWidth
          label="Descripción"
          name="description"
          value={agendaData.description}
          onChange={handleChange}
          margin="normal"
          multiline
        />

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

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Fab color="primary" aria-label="save" onClick={handleSubmit}>
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};

EditAgenda.propTypes = {
  isUpdate: PropTypes.bool, 
  initialAgendaData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    event_name: PropTypes.string,
    description: PropTypes.string,
    begin_time: PropTypes.instanceOf(Date), 
    end_time: PropTypes.instanceOf(Date),
    private_task: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    owner: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    pet: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    product: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
  }),
};

export default EditAgenda;
