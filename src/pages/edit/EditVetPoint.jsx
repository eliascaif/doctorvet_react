import React, { useState, useEffect, useRef } from "react";
import { 
  TextField, 
  Box, 
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "./EditPage";
import { handleError, validateNonEmpty } from "../../utils/lib";

const EditVetPoint = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle, toggleFab } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  const [point, setPoint] = useState({
    name: "",
    number: "",
    type: "PAPER"
  });

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    name: useRef(null),
    number: useRef(null),
    type: useRef(null),
  });

  useEffect(() => {
    updateTitle(undefined, "Nuevo punto de emisión", "Completa los datos");
    toggleFab(false);
    refs.name.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPoint(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateNonEmpty("name", point.name, setErrors, refs.name) ||
        !validateNonEmpty("number", point.number, setErrors, refs.number)) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}vets?create_point`,
        point,
        { withCredentials: true }
      );

      navigate("/main/view-vet-points");
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
          value={point.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Número *"
          name="number"
          value={point.number}
          onChange={handleChange}
          inputRef={refs.number}
          error={!!errors.number}
          helperText={errors.number}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo *</InputLabel>
          <Select
            name="type"
            value={point.type}
            label="Tipo *"
            onChange={handleChange}
            inputRef={refs.type}
          >
            <MenuItem value="PAPER">Papel</MenuItem>
            <MenuItem value="ELECTRONIC">Electrónico</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </EditPage>
  );
};

export default EditVetPoint; 