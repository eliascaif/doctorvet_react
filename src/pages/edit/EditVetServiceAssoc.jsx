import  { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "../../pages/edit/EditPage";

const EditVetServiceAssoc = ({ updateVetServiceAssoc = null }) => {
  const [servicesAssoc, setServicesAssoc] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle(
      updateVetServiceAssoc ? updateVetServiceAssoc.thumb_url : "",
      strings.vetServiceAssoc,
      strings.complete_data
    );
    setIsLoading(true);
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}vets?services`,
          { withCredentials: true }
        );

        const servicesData = response.data.data;
        setServicesAssoc(servicesData || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        snackbar("Error al cargar los servicios");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServices || selectedServices.length === 0) {
      setErrors({ service_id: "Selecciona al menos un servicio" });
      return;
    }
    save();
  };

  const save = async () => {
    try {
      const payload = selectedServices.map((service) => ({
        id: service.id,
        name: service.name,
      }));

      console.log("Enviando datos:", JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }services_schedules?create_services_assoc`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("Respuesta del servidor:", response);
    } catch (error) {
      console.error(
        "Error en la petición:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <Autocomplete
        multiple
        fullWidth
        options={servicesAssoc}
        getOptionLabel={(option) => option?.name || option?.friendly_name || ""}
        value={selectedServices}
        onChange={(e, newValue) => setSelectedServices(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Servicios Asociados *"
            margin="normal"
            error={!!errors.service_id}
            helperText={errors.service_id}
          />
        )}
      />
    </EditPage>
  );
};

export default EditVetServiceAssoc;
