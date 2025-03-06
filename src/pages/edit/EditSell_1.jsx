import React, { useState, useEffect, useRef } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchForInput } from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import EditPage from "./EditPage";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useConfig } from "../../providers/ConfigProvider";
import { useLoading } from "../../providers/LoadingProvider";


const EditSell_1 = () => {

  const [sell, setSell] = useState({
    // date: ,

  });
  const [deposits, setDeposits] = useState([]);
  const [sellPoints, setSellPoints] = useState([]);
  
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const {updateTitle} = useAppBar();
  const {isLoading, setIsLoading} = useLoading();
  
  useEffect(() => {
    setIsLoading(true);

    updateTitle(undefined, 'Venta', 'Completa los datos');
    const fetchForInput = async () => {
      const sellsForInput = await fetchForInput('sells', 'sells_for_input');
      setDeposits(sellsForInput.deposits);
      setSellPoints(sellsForInput.sell_points);

      setIsLoading(false);
    };
    fetchForInput();
  }, []);

  const handleChange = (e) => {
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (
    //   !lib.validateNonEmpty("name", owner.name, setErrors, refs.name) ||
    //   !lib.validateEmail("email", owner.email, setErrors, refs.email, true)
    // )
    //   return;

    save();
  };

  const save = async () => {
    setIsLoading(true);
    try {
      let response;
      if (updateOwner) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}owners`,
          owner,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}owners`,
          owner,
          { withCredentials: true }
        );
      }

      navigate(`/main/view-owner/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage 
      onSubmit={handleSubmit} 
      // isLoading={isLoading}
      >
      

      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
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
        </LocalizationProvider> */}


    </EditPage>
  );
};

export default EditSell_1;
