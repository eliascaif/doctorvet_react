import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import * as lib from "../../utils/lib";
import axios from "axios";
import { strings } from "../../constants/strings";
import {
  TextField,
  Autocomplete,
  Fab,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";
import EditPage from "../../pages/edit/EditPage";

export const EditService = ({ updateService = null }) => {
  const [service, setService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    cost: "",
    tax: "",
  });
  const [errors, setErrors] = useState({});
  const refs = useRef({
    name: null,
    description: null,
    price: null,
    duration: null,
    cost: null,
    tax: null,
  });

  const [categories, setCategories] = useState([]);
  const [priceFormats, setPriceFormats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStudy, setIsStudy] = useState(false); // Estado para el checkbox
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();

  useEffect(() => {
    updateTitle(
      updateService ? updateService.thumb_url : "",
      updateService
        ? strings.update_service
        : strings.new_service,
      strings.complete_data
    );

    setIsLoading(true);

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}vets?services`,
          {
            withCredentials: true,
          }
        );

        setCategories(response.data.data);
        console.log("Categorías", response.data.data);
      } catch (error) {
        lib.handleError(error, snackbar);
        console.error("Error al obtener las categorías", error);
      }
    };

    fetchCategories();
    setIsLoading(false);
  }, [updateTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !lib.validateNonEmpty("name", service.name, setErrors, refs.name) ||
      !lib.validateNonEmpty(
        "description",
        service.description,
        setErrors,
        refs.description
      ) ||
      !lib.validateNonEmpty("price", service.price, setErrors, refs.price) ||
      !lib.validateNonEmpty(
        "duration",
        service.duration,
        setErrors,
        refs.duration
      ) ||
      !lib.validateNonEmpty("cost", service.cost, setErrors, refs.cost) ||
      !lib.validateNonEmpty("tax", service.tax, setErrors, refs.tax)
    )
      return;

    if (updateService) update();
    else save();
  };

  const save = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}services`,
        service,
        {
          withCredentials: true,
        }
      );
      navigate("/main/view-service", { state: { id: response.data.data.id } });
    } catch (error) {
      lib.handleError(error, snackbar);
      console.error("Error al guardar el servicio", error);
    }
  };

  const update = async () => {
    setIsLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}services`,
        service,
        {
          withCredentials: true,
        }
      );
      navigate(`/main/view-service/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error, snackbar);
      console.error("Error al actualizar el servicio", error);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label={strings.name + " *"}
          name="name"
          value={service.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />
        <Autocomplete
          fullWidth
          options={categories}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={service.category}
          onChange={(e, newValue) =>
            setService({ ...service, category: newValue })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Categoría"
              name="category"
              margin="normal"
            />
          )}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={isStudy}
              onChange={(e) => setIsStudy(e.target.checked)}
            />
          }
          label="Es Estudio"
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.duration}
          name="duration"
          value={service.duration}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.cost}
          name="duration"
          value={service.cost}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          label={strings.tax}
          name="duration"
          value={service.tax}
          onChange={handleChange}
        />
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "gray", fontWeight: "bold", mb: 2 }}
          >
            Precio 1
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            sx={{ flex: 1 }}
            label="Margen"
            name="margin"
            value={service.margin || ""}
            onChange={handleChange}
            type="number"
          />

          <Autocomplete
            sx={{ flex: 1 }}
            options={[
              "Ninguno",
              "Fijo",
              "Costo + Margen",
              "Costo + Margen + Impuesto",
            ]}
            getOptionLabel={(option) => option}
            value={service.priceOption || null}
            onChange={(e, newValue) =>
              setService({ ...service, priceOption: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Precio" name="priceOption" />
            )}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "gray", fontWeight: "bold", mb: 2 }}
          >
            Precio 2
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            sx={{ flex: 1 }} // Hace que ambos tengan el mismo tamaño
            label="Margen"
            name="margin2"
            value={service.margin2 || ""}
            onChange={handleChange}
            type="number"
          />

          <Autocomplete
            sx={{ flex: 1 }} // Hace que ambos tengan el mismo tamaño
            options={[
              "Ninguno",
              "Fijo",
              "Costo + Margen",
              "Costo + Margen + Impuesto",
            ]}
            getOptionLabel={(option) => option}
            value={service.priceOption2 || null}
            onChange={(e, newValue) =>
              setService({ ...service, priceOption2: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Precio" name="priceOption2" />
            )}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: "gray", fontWeight: "bold", mb: 2 }}
          >
            Precio 3
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            sx={{ flex: 1 }} // Hace que ambos tengan el mismo tamaño
            label="Margen"
            name="margin3"
            value={service.margin3 || ""}
            onChange={handleChange}
          />

          <Autocomplete
            sx={{ flex: 1 }} // Hace que ambos tengan el mismo tamaño
            options={[
              "Ninguno",
              "Fijo",
              "Costo + Margen",
              "Costo + Margen + Impuesto",
            ]}
            getOptionLabel={(option) => option}
            value={service.priceOption3 || null}
            onChange={(e, newValue) =>
              setService({ ...service, priceOption3: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Precio" name="priceOption3" />
            )}
          />
        </Box>

        
        </EditPage>
  );
};

EditService.propTypes = {
  updateService: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    duration: PropTypes.string.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    priceFormat: PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    }),
  }),
};
