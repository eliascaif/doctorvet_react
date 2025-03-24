import React, { useState, useEffect } from "react";
import { 
  Checkbox, 
  FormControlLabel, 
  FormGroup,
  Typography,
  Paper,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "./EditPage";
import { handleError } from "../../utils/lib";
import CheckIcon from '@mui/icons-material/Check';

const EditVetServiceAssoc = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle, toggleFab } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle('', 'Servicios asociados', 'Marca / Desmarca los servicios que ofrece la veterinaria');
    toggleFab(false);
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}vets?services&min`,
        { withCredentials: true }
      );

      const allServices = response.data.data || [];
      
      // Ordenar servicios por nombre
      const sortedServices = allServices.sort((a, b) => 
        a.name.localeCompare(b.name)
      );

      setServices(sortedServices);
      
      // Inicializar servicios seleccionados basados en service_assoc
      const selectedServices = allServices
        .filter(service => service.service_assoc === 1);
      setSelectedServices(selectedServices);
    } catch (error) {
      handleError(error);
      snackbar("Error al cargar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      if (prev.some(s => s.id === service.id)) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Transformar los servicios seleccionados al formato esperado
      const servicesToSend = selectedServices.map(service => ({
        id: service.id,
        name: service.name
      }));

      console.log('Servicios a enviar:', servicesToSend);

      await axios.post(
        `${import.meta.env.VITE_API_URL}vets?create_service_assoc`,
        servicesToSend,
        { withCredentials: true }
      );

      // snackbar("Servicios actualizados exitosamente");
      navigate("/main/view-vet-services-schedules");
    } catch (error) {
      handleError(error);
      snackbar("Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormGroup>
          {services.map((service) => (
            <FormControlLabel
              key={service.id}
              control={
                <Checkbox
                  checked={selectedServices.some(s => s.id === service.id)}
                  onChange={() => handleServiceToggle(service)}
                  name={service.name}
                />
              }
              label={service.name}
            />
          ))}
        </FormGroup>
      </Paper>
    </EditPage>
  );
};

export default EditVetServiceAssoc; 
