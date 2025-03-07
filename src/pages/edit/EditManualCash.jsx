import { useState, useRef, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import * as lib from "../../utils/lib";
import { strings } from "../../constants/strings";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../providers/SnackBarProvider";
import EditPage from "../../pages/edit/EditPage";
/* import PropTypes from "prop-types"; */

const EditManualCash = ({ updateCashMovement = null }) => {
  const [cashMovement, setCashMovement] = useState(
    updateCashMovement || {
      amount: "",
      movementType: null,
      paymentMethod: null,
      reason: "",
      date: "",
      hour: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    amount: useRef(null),
  });

  const [movementTypes, setMovementTypes] = useState([
    { label: "Ingreso", value: "MANUAL_CASH_IN" },
    { label: "Egreso", value: "MANUAL_CASH_OUT" },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([]);
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  useEffect(() => {
    updateTitle(
      updateCashMovement ? updateCashMovement.thumb_url : "",
      updateCashMovement
        ? strings.update_cash
        : strings.new_cash,
      strings.complete_data
    );

    setIsLoading(true);

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}finance?payment_types`,
          { withCredentials: true }
        );
        console.log('la api responde:',response.data)

        setPaymentMethods(response.data.data);
      } catch (error) {
        lib.handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [updateCashMovement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCashMovement({ ...cashMovement, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !lib.validateNonEmpty(
        "amount",
        cashMovement.amount,
        setErrors,
        refs.amount
      )
    )
      return;
    if (updateCashMovement) update();
    else save();
  };
  const save = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}cash-movements`,
        cashMovement,
        { withCredentials: true }
      );
      navigate(`/main/view-cash-movement/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}cash-movements`,
        cashMovement,
        { withCredentials: true }
      );
      navigate(`/cash-movements/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error, intenta nuevamente");
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
            value={cashMovement.amount}
            onChange={handleChange}
            inputRef={refs.amount}
            error={!!errors.amount}
            helperText={errors.amount}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
          <Autocomplete
            fullWidth
            options={movementTypes}
            getOptionLabel={(option) => option.label}
            value={
              movementTypes.find(
                (type) => type.value === cashMovement.movementType
              ) || null
            }
            onChange={(e, newValue) => {
              setCashMovement({
                ...cashMovement,
                movementType: newValue?.value || null,
                movementTypeLabel: newValue?.label || "",
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={strings.movement_type}
                name="movementType"
                margin="normal"
              />
            )}
          />

          <Autocomplete
            fullWidth
            options={paymentMethods}
            getOptionLabel={(option) => option.name}
            value={cashMovement.paymentMethod}
            onChange={(e, newValue) =>
              setCashMovement({
                ...cashMovement,
                paymentMethod: newValue || null,
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={strings.payment_method}
                name="paymentMethod"
                margin="normal"
              />
            )}
          />

          <TextField
            fullWidth
            margin="normal"
            label={strings.date}
            name="date"
            value={cashMovement.date}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label={strings.hour}
            name="hour"
            value={cashMovement.hour}
            onChange={handleChange}
            type="time"
            InputLabelProps={{ shrink: true }}
          />

       </EditPage>
  );
};

/* EditManualCash.propTypes = {
  updateCashMovement: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    movementType: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    paymentMethod: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    reason: PropTypes.string,
    date: PropTypes.string,
    hour: PropTypes.string,
  }),
}; */

export default EditManualCash;
