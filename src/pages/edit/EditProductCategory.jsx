import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Alert,
  Snackbar,
  Container,
  Fab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../providers/TitleProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import * as lib from "../../utils/lib";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";

export const EditProductCategory = ({ updateCategory = null }) => {
  const [categoryData, setCategoryData] = useState(
    updateCategory || {
      name: "",
      isFoodCategory: false,
      isServiceCategory: false,
    }
  );

  const { updateTitle } = useTitle();
  const { isLoading, setIsLoading } = useLoading();

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (updateCategory) {
      updateTitle("", strings.update_category, strings.complete_data);
    } else {
      updateTitle("", strings.new_category, strings.complete_data);
    }

    setIsLoading(false);
  }, [updateCategory, updateTitle, setIsLoading]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setCategoryData({
      ...categoryData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!categoryData.name) {
      newErrors.name = "Completa aquí.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    if (updateCategory) {
      await update();
    } else {
      await save();
    }
  };

  const save = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}categories`,
        categoryData
      );
      navigate(`/categories/${response.data.id}`);
    } catch (error) {
      lib.handleError(error);
      setSnackbarMessage("Error al guardar el producto");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}categories/${categoryData.id}`,
        categoryData,
        { withCredentials: true }
      );
      navigate(`/categories/${response.data.id}`);
    } catch (error) {
      lib.handleError(error);
      setSnackbarMessage("Error al actualizar el producto");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            sx={{ marginTop: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryData.isFoodCategory}
                onChange={handleChange}
                name="isFoodCategory"
              />
            }
            label="Food Category"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryData.isServiceCategory}
                onChange={handleChange}
                name="isServiceCategory"
              />
            }
            label="Service Category"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Fab color="primary" aria-label="add" onClick={handleSubmit}>
              <CheckIcon />
            </Fab>
          </Box>

          <Snackbar
            open={showAlert}
            autoHideDuration={6000}
            onClose={() => setShowAlert(false)}
          >
            <Alert
              onClose={() => setShowAlert(false)}
              severity="error"
              sx={{ width: "100%" }}
            >
              {strings.complete_required_fields ||
                "Por favor, complete los campos requeridos."}
            </Alert>
          </Snackbar>
        </form>
      </Container>
    </>
  );
};


EditProductCategory.propTypes = {
  updateCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    isFoodCategory: PropTypes.bool,
    isServiceCategory: PropTypes.bool,
  }),
};
