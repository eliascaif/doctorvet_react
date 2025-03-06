import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import axios from "axios";
import * as lib from "../../utils/lib";
import EditPage from "../../pages/edit/EditPage";

const EditProductCategory = ({ updateCategory = null }) => {
  const [categoryData, setCategoryData] = useState(
    updateCategory || {
      name: "",
      isFoodCategory: false,
      isServiceCategory: false,
    }
  );

  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateTitle(
      updateCategory ? updateCategory.thumb_url : "",
      updateCategory
        ? strings.update_category
        : strings.new_category,
      strings.complete_data
    );

    setIsLoading(false);
  }, [updateCategory, updateTitle, setIsLoading]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}products_categories?page=1&search=`,{ withCredentials: true });
        console.log("API Response:", response.data.data); // Verifica en la consola
        setCategories(Array.isArray(response.data.data.content) ? response.data.data.content : []);
      } catch (error) {
        lib.handleError(error);
        setSnackbarMessage("Error al cargar categorías");
        setSnackbarOpen(true);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (event, newValue) => {
    if (typeof newValue === "string") {
      setCategoryData({ ...categoryData, name: newValue });
    } else if (newValue && newValue.name) {
      setCategoryData({ ...categoryData, name: newValue.name });
    } else {
      setCategoryData({ ...categoryData, name: "" });
    }
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
    <EditPage onSubmit={handleSubmit}>
      <Autocomplete
        options={categories}
        getOptionLabel={(option) => option.name || ""}
        value={categories.find((c) => c.name === categoryData.name) || null}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField {...params} label="Category Name" error={!!errors.name} helperText={errors.name} fullWidth sx={{ marginTop: 2 }} />
        )}
        
      />
      <FormControlLabel
        control={<Checkbox checked={categoryData.isFoodCategory} onChange={(e) => setCategoryData({ ...categoryData, isFoodCategory: e.target.checked })} name="isFoodCategory" />}
        label="Food Category"
      />
      <FormControlLabel
        control={<Checkbox checked={categoryData.isServiceCategory} onChange={(e) => setCategoryData({ ...categoryData, isServiceCategory: e.target.checked })} name="isServiceCategory" />}
        label="Service Category"
      />

      <Snackbar open={showAlert} autoHideDuration={6000} onClose={() => setShowAlert(false)}>
        <Alert onClose={() => setShowAlert(false)} severity="error" sx={{ width: "100%" }}>
          {strings.complete_required_fields || "Por favor, complete los campos requeridos."}
        </Alert>
      </Snackbar>
    </EditPage>
  );
};

export default EditProductCategory;

EditProductCategory.propTypes = {
  updateCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    isFoodCategory: PropTypes.bool,
    isServiceCategory: PropTypes.bool,
  }),
};
