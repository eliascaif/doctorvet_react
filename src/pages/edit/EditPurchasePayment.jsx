import { useRef } from "react";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import { useNavigate } from "react-router-dom";
import { strings } from "../../constants/strings";
import * as lib from "../../utils/lib";
import axios from "axios";
import { Box, Container, TextField, Autocomplete, Fab } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from 'prop-types';

export const EditPurchasePayment = ({ updatePayment = null }) => {
  const [payment, setPayment] = useState(
    updatePayment || {
      amount: "",
      finance_payment_method: null,
      provider: null,
    }
  );
  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    amount: useRef(null),
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    setIsLoading(true);
    if (updatePayment) {
      updateTitle("", strings.update_payment, strings.complete_data);
    } else {
      updateTitle("", strings.new_payment, strings.complete_data);
    }

    const fetchData = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}finance?payment_types`,
            { withCredentials: true }
          );
          console.log('respuesta de la API:', response.data)
          setPaymentMethods(response.data.data);
          if (!payment.finance_payment_method && response.data.data.length > 0) {
            setPayment((prev) => ({
              ...prev,
              finance_payment_method: response.data.data[0],
            }));
          }
        } catch (error) {
          lib.handleError(error);
          snackbar("Error al obtener los tipos de pago");
        } finally {
          setIsLoading(false);
        }
      };

      
    fetchData();
    
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lib.validateNonEmpty("amount", payment.amount, setErrors, refs.amount))
      return;
    if (updatePayment) {
      update();
    } else {
      save();
    }
  };

  const save = async () => {
    console.log("Enviando los datos del pago:", payment);
    console.log(`${import.meta.env.VITE_API_URL}purchases_payments`);
  
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}purchases_payments`,
        payment,
        { withCredentials: true }
      );
      console.log("Respuesta de la API:", response);
      if (response.data && response.data.data) {
        navigate("/main/view-purchase-payment", {
          state: { id: response.data.data.id },
        });
      } else {
        throw new Error('No se recibieron los datos esperados de la API');
      }
    } catch (error) {
      // Verifica más detalles sobre el error
      console.error('Error al guardar el pago:', error);
      if (error.response) {
        console.error('Respuesta de error:', error.response);
      } else {
        console.error('Error sin respuesta:', error.message);
      }
      lib.handleError(error);
      snackbar("Error al guardar el pago");
    } finally {
      setIsLoading(false);
    }
  };
  

  const update = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}purchases_payments`,
        payment,
        { withCredentials: true }
      );
      
      navigate(`/purchase-payments/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar(strings.error_save_payment);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }} component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label={strings.amount + " *"}
          name="amount"
          value={payment.amount}
          onChange={handleChange}
          inputRef={refs.amount}
          error={!!errors.amount}
          helperText={errors.amount}
          type="number"
        />
        <Autocomplete
          fullWidth
          options={paymentMethods}
          getOptionLabel={(option) => option?.name || ""}
          value={payment.finance_payment_method}
          onChange={(e, newValue) =>
            setPayment({ ...payment, finance_payment_method: newValue })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.payment_method}
              margin="normal"
            />
          )}
        />
       

       <TextField
          fullWidth
          margin="normal"
          label={strings.provider + " *"}
          name="provider"
          value={payment.provider}
          onChange={handleChange}
          inputRef={refs.provider}
          error={!!errors.provider}
          helperText={errors.provider}
          type="text"
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
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
EditPurchasePayment.propTypes = {
  updatePayment: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    finance_payment_method: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    provider: PropTypes.string,
  }),
};