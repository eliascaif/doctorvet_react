import React, { useState, useEffect, useRef } from "react";
import { TextField, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "./EditPage";
import { handleError, validateNonEmpty } from "../../utils/lib";

const EditVetDeposit = () => {
  const location = useLocation();
  const { updateDeposit } = location.state || {};

  const [deposit, setDeposit] = useState(
    updateDeposit || {
      name: ""
    }
  );

  const [errors, setErrors] = useState({});
  const [refs] = useState({
    name: useRef(null)
  });

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle, toggleFab } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle(
      undefined,
      updateDeposit ? "Editar almacén" : "Nuevo almacén",
      updateDeposit ? "Editando almacén" : "Ingresando nuevo almacén"
    );
    toggleFab(false);
    refs.name.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeposit({ ...deposit, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateNonEmpty("name", deposit.name, setErrors, refs.name)) {
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (updateDeposit) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}vets?update_deposit&id=${updateDeposit.id}`,
          deposit,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}vets?create_deposit`,
          deposit,
          { withCredentials: true }
        );
      }

      navigate("/main/view-vet-deposits");
    } catch (error) {
      handleError(error);
      snackbar("Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <Box sx={{ width: "100%" }}>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre *"
          name="name"
          value={deposit.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Box>
    </EditPage>
  );
};

export default EditVetDeposit; 