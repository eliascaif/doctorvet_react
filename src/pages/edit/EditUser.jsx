import React, { useState, useEffect, useRef } from "react";
import { TextField, Box, Autocomplete } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "./EditPage";
import { handleError, validateNonEmpty } from "../../utils/lib";
import * as lib from "../../utils/lib";

const EditUser = () => {
  const location = useLocation();
  const { updateUser } = location.state || {};

  // Si no hay usuario para editar, redirigir a la vista de usuarios
  useEffect(() => {
    if (!updateUser) {
      navigate("/main/view-users");
    }
  }, [updateUser]);

  const [user, setUser] = useState({
    name: updateUser?.name || "",
    address: updateUser?.address || "",
    region: updateUser?.region || null,
    phone: updateUser?.phone || "",
    regional_id: updateUser?.regional_id || "",
    notes: updateUser?.notes || ""
  });

  const [regions, setRegions] = useState([]);
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
      "Editar usuario",
      "Editando usuario"
    );
    toggleFab(false);
    refs.name.current?.focus();

    // Cargar regiones
    const fetchForInput = async () => {
      const regionsData = await lib.fetchRegions();
      setRegions(regionsData);
    };
    fetchForInput();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateNonEmpty("name", user.name, setErrors, refs.name)) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}users?update&id=${updateUser.id}`,
        user,
        { withCredentials: true }
      );

      navigate("/main/view-user");
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
          value={user.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Dirección"
          name="address"
          value={user.address}
          onChange={handleChange}
        />
        <Autocomplete
          fullWidth
          options={regions}
          getOptionLabel={(option) => (option ? option.friendly_name : "")}
          value={user.region}
          onChange={(e, newValue) =>
            setUser({
              ...user,
              region: newValue,
            })
          }
          renderInput={(params) => (
            <TextField {...params} label="Región" name="region" margin="normal" />
          )}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Teléfono"
          name="phone"
          value={user.phone}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Identificación regional"
          name="regional_id"
          value={user.regional_id}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Notas"
          name="notes"
          value={user.notes}
          onChange={handleChange}
          multiline
          rows={4}
        />
      </Box>
    </EditPage>
  );
};

export default EditUser; 
