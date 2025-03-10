import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Autocomplete,
  Fab,
  Container,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
/* import PropTypes from "prop-types"; */
import EditPage from "../../pages/edit/EditPage";

const EditSellPayment = ({ updatePayment = null }) => {
  const [payment, setPayment] = useState(
    updatePayment || {
      amount: "",
      method: null,
    }
  );

  const [errors, setErrors] = useState({});
  const refs = useRef({
    amount: null,
  });

  const [methods, setMethods] = useState([]);

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle(
      updatePayment ? updatePayment.thumb_url : "",
      updatePayment
        ? strings.update_payment
        : strings.new_payment,
      strings.complete_data
    );
    setIsLoading(true);

    const financeTypes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}finance?payment_types`,
          { withCredentials: true }
        );
        setMethods(response.data.data);
      } catch (error) {
        lib.handleError(error);
        snackbar("Error al obtener los métodos de pago");
      } finally {
        setIsLoading(false);
      }
    }
    financeTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment({ ...payment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lib.validateNonEmpty("amount", payment.amount, setErrors, refs.current.amount)) return;
  
   
    const formattedPayment = {
      ...payment,
      method: {
        deleted: 0,
        id: payment.method.id,
        name: payment.method.name,
      },
    };
  
    updatePayment ? update(formattedPayment) : save(formattedPayment);
  };

  const save = async () => {
    setIsLoading(true);
    try {
      const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  
      if (!payment.method) {
        snackbar("Por favor, selecciona un método de pago");
        setIsLoading(false);
        return;
      }
  
      if (!payment.owner || !payment.owner.id) {
        snackbar("Error: No se ha asignado un propietario (owner)");
        console.error("Error: payment.owner es null o no tiene ID");
        setIsLoading(false);
        return;
      }
  
      const payload = {
        amount: payment.amount,
        date: currentDate, 
        finance_payment_method: {
          deleted: 0,
          id: payment.method.id,
          name: payment.method.name
        },
        owner: {
          id: payment.owner.id,
          name: payment.owner.name
        }
      };
  
      console.log("Enviando datos:", payload);
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}sells_payments`,
        payload,
        { withCredentials: true }
      );
  
      console.log("Respuesta API:", response.data);
      navigate("/main/view-sell-payment", { state: { id: response.data.data.id } });
    } catch (error) {
      console.error("Error al guardar el pago:", error.response ? error.response.data : error.message);
      snackbar("Error, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  const update = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}sells_payments`,
        payment,
        { withCredentials: true }
      );
      navigate(`/sell-payments/${response.data.data.id}`);
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
          value={payment.amount}
          onChange={handleChange}
          inputRef={(el) => (refs.current.amount = el)}
          error={!!errors.amount}
          helperText={errors.amount}
        />
        <Autocomplete
          fullWidth
          options={methods}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={payment.method}
          onChange={(e, newValue) =>
            setPayment({ ...payment, method: newValue })
          }
          renderInput={(params) => (
            <TextField {...params} label={strings.payment_method} margin="normal" />
          )}
        />
        
      </EditPage>
  );
};

/* EditSellPayment.propTypes = {
  updatePayment: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    method: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      deleted: PropTypes.number,
    }),
  }),
};
 */

export default EditSellPayment;
