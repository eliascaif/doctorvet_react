import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import { TextField, Autocomplete, Fab, Container, Box } from "@mui/material";
import EditPage from "../../pages/edit/EditPage";

const EditSpending = ({ updateSpending = null }) => {
  const [spending, setSpending] = useState({
    id_vet: 1,
    id_user: 1,
    amount: "", 
    reason: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toISOString().split("T")[1].slice(0, 5),
    financePaymentMethod: null, 
  });

  const [errors, setErrors] = useState({});
  const [refs] = useState({
    amount: useRef(null),
    reason: useRef(null),
    date: useRef(null),
    time: useRef(null),
    financePaymentMethod: useRef(null),
  });

  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { isLoading, setIsLoading } = useLoading();
  const { updateTitle } = useAppBar();

  useEffect(() => {
    updateTitle(
      updateSpending ? updateSpending.thumb_url : "",
      updateSpending
        ? strings.update_spending
        : strings.new_spending,
      strings.complete_data
    );

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}finance?payment_types`,
          { withCredentials: true }
        );

        
        console.log("API Response:", response.data);
        setPayments(response.data.data);
      } catch (error) {
        lib.handleError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      const numericValue = Number(value);
      if (numericValue < 0) return; 
    }
    setSpending({ ...spending, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !lib.validateNonEmpty(
        "amount",
        spending.amount,
        setErrors,
        refs.amount
      ) ||
      !lib.validateNonEmpty(
        "reason",
        spending.reason,
        setErrors,
        refs.reason
      ) ||
      !lib.validateNonEmpty("date", spending.date, setErrors, refs.date) ||
      !lib.validateNonEmpty("time", spending.time, setErrors, refs.time)
    )
      return;

    if (updateSpending) update();
    else save();
  };

  const save = async () => {
    setIsLoading(true);

    try {
      // Combina la fecha y la hora en el formato requerido
      const formattedDate = `${spending.date} ${spending.time}:00`;

      // Construye el objeto payload de acuerdo al formato que espera la API
      const payload = {
        id_vet: spending.id_vet,
        id_user: spending.id_user,
        date: formattedDate,
        // Si spending.financePaymentMethod es un objeto, extraemos su id.
        id_finance_types_payment:
          spending.financePaymentMethod?.id || spending.financePaymentMethod,
        amount: Number(spending.amount),
      };
      console.log("Payload a enviar:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}spendings`,
        payload,
        { withCredentials: true }
      );

      console.log("Datos enviados:", payload);
      setSpending(response.data.data);
      snackbar.show(strings.spending_saved);
      navigate("/main/view-spending", { state: { id: response.data.data.id } });
    } catch (error) {
      console.error(
        "Error en la solicitud:",
        error.response ? error.response.data : error
      );
      lib.handleError(error, snackbar);
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}spendings/${updateSpending.id}`,
        spending,
        { withCredentials: true }
      );
      snackbar.show(strings.spending_updated);
      navigate("/finance");
    } catch (error) {
      lib.handleError(error, snackbar);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label={strings.amount + " *"}
        name="amount"
        type="number"
        value={spending.amount}
        onChange={handleChange}
        inputRef={refs.amount}
        error={!!errors.amount}
        helperText={errors.amount}
        inputProps={{ min: 0 }}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.reason}
        name="reason"
        value={spending.reason}
        onChange={handleChange}
      />

      {/* Agrupamos los TextField de fecha y hora en una misma línea */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          margin="normal"
          label={strings.date}
          name="date"
          type="date"
          value={spending.date}
          onChange={handleChange}
          sx={{ flex: 1 }}
        />
        <TextField
          margin="normal"
          label={strings.time}
          name="time"
          type="time"
          value={spending.time}
          onChange={handleChange}
          sx={{ flex: 1 }}
        />
      </Box>

      <Autocomplete
        fullWidth
        options={payments}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        value={spending.financePaymentMethod}
        onChange={(_, newValue) =>
          setSpending({ ...spending, financePaymentMethod: newValue })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={strings.finance_payment_method}
            margin="normal"
            error={!!errors.financePaymentMethod}
            helperText={errors.financePaymentMethod}
          />
        )}
      />
    </EditPage>
  );
};

export default EditSpending;
