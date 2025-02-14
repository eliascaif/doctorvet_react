import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Box, TextField, Fab } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import * as lib from "../../utils/lib";
import { strings } from "../../constants/strings";

export const EditUserChangePassword = () => {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmNewPasswordRef = useRef(null);

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle("Cambiar contraseña");
  }, [updateTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
   
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

 
  const createSetFieldError = (fieldName) => (errorObj) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorObj[fieldName] || "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    
    setErrors({});

    
    const validCurrent = lib.validatePassword(
      "currentPassword", 
      password.currentPassword,
      createSetFieldError("currentPassword"),
      currentPasswordRef
    );
    const validNew = lib.validatePassword(
      "newPassword",
      password.newPassword,
      createSetFieldError("newPassword"),
      newPasswordRef
    );
    const validConfirm = lib.validatePassword(
      "confirmNewPassword",
      password.confirmNewPassword,
      createSetFieldError("confirmNewPassword"),
      confirmNewPasswordRef
    );

    if (!validCurrent || !validNew || !validConfirm) {
      isValid = false;
    }

    
    if (password.newPassword !== password.confirmNewPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmNewPassword: "Las contraseñas no coinciden",
      }));
      confirmNewPasswordRef.current.focus();
      confirmNewPasswordRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      actual_password: password.currentPassword,
      new_password: password.newPassword,
    };

    setIsLoading(true);
    try {
  
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}users?password_change`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        showSnackbar(strings.password_changed_success, "success");
        
        localStorage.removeItem("authToken");
        localStorage.removeItem("userProfile");
        
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      lib.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Contraseña actual"
          type="password"
          margin="normal"
          name="currentPassword"
          value={password.currentPassword}
          onChange={handleChange}
          inputRef={currentPasswordRef}
          error={!!errors.currentPassword}
          helperText={errors.currentPassword}
        />
        <TextField
          fullWidth
          label="Nueva contraseña"
          type="password"
          margin="normal"
          name="newPassword"
          value={password.newPassword}
          onChange={handleChange}
          inputRef={newPasswordRef}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
        />
        <TextField
          fullWidth
          label="Confirmar nueva contraseña"
          type="password"
          margin="normal"
          name="confirmNewPassword"
          value={password.confirmNewPassword}
          onChange={handleChange}
          inputRef={confirmNewPasswordRef}
          error={!!errors.confirmNewPassword}
          helperText={errors.confirmNewPassword}
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Fab type="submit" color="primary" aria-label="save">
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};

export default EditUserChangePassword;



