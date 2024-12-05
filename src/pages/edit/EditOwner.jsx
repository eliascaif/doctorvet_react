import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useNavigate, useParams } from "react-router-dom";
import * as lib from "../../utils/lib"; 
import axios from "axios";

const EditOwner = () => {
  const [ownerData, setOwnerData] = useState({
    name: "",
    address: "",
    region: "",
    phone: "",
    email: "",
    idNumber: "",
    taxType: "",
    additionalNotes: "",
    fiscal_id: "",
    fiscal_type: null,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [regions, setRegions] = useState([]);
  const [fiscalTypes, setFiscalTypes] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    
    if (id) {
      const fetchOwnerData = async () => {
        try {
          const response = await axios.get(`/propietarios/${id}`);
          setOwnerData(response.data);
          setIsLoading(false);
        } catch (error) {
          setMessage({ type: "error", text: "Error al cargar los datos." });
          setIsLoading(false);
        }
      };
      fetchOwnerData();
    } else {
      
      setIsLoading(false);
    }
  
    const fetchRegions = async () => {
      const regions = await lib.fetchRegions();
      setRegions(regions);
    };
    fetchRegions();
  }, [id]);
  

  const fetchFiscalTypes = async (country) => {
    const fiscalTypes = await lib.fetchFiscalTypes(country);
    setFiscalTypes(fiscalTypes);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwnerData({ ...ownerData, [name]: value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!ownerData.name.trim()) tempErrors.name = "El nombre es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerData.email))
      tempErrors.email = "El email debe tener un formato válido.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
  
    try {
      if (id) {
       
        await axios.put(`/propietarios/${id}`, ownerData);
        setMessage({ type: "success", text: "Datos actualizados correctamente." });
      } else {
        
        await axios.post(`/propietarios`, ownerData);
        setMessage({ type: "success", text: "Propietario agregado correctamente." });
      }
      navigate(-1);  
    } catch (error) {
      setMessage({ type: "error", text: "Error al guardar los datos." });
    }
  };
  
  if (isLoading) return <Typography>Cargando...</Typography>;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{
        maxWidth: "600px",
        margin: "32px auto",
        padding: "16px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      }}
    >
      
      <AppBar
        position="static"
        color="primary"
        sx={{ borderRadius: 1, margin: 0, padding: 1 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ArrowBackIcon
              color="inherit"
              onClick={() => navigate(-1)} 
              sx={{ color: "white" }} 
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                minWidth: "56px",
                height: "56px",
              }}
            >
              <AddAPhotoIcon />
            </Button>
            <Typography variant="h5">Editar Propietario</Typography>
          </div>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: "0.875rem", marginLeft: "6rem" }}
          >
            Completa los datos
          </Typography>
        </Toolbar>
      </AppBar>

      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        name="name"
        value={ownerData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Dirección"
        name="address"
        value={ownerData.address}
        onChange={handleChange}
      />

      
      <Autocomplete
        fullWidth
        options={regions}
        getOptionLabel={(option) => option.friendly_name || ""} 
        value={ownerData.region}
        onChange={(e, newValue) =>
          setOwnerData({
            ...ownerData,
            region: newValue ? newValue.friendly_name : "",
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Región"
            name="region"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        sx={{ marginTop: 2 }}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Teléfono"
        name="phone"
        value={ownerData.phone}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={ownerData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Identificación Fiscal (DNI/DU/Pasaporte)"
        name="idNumber"
        value={ownerData.idNumber}
        onChange={handleChange}
      />
    
      <Autocomplete
          margin="normal"
          options={fiscalTypes}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={ownerData.fiscal_type}
          onChange={(event, newValue) => {
            setOwnerData({ ...ownerData, fiscalType: newValue });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo fiscal"
              name="fiscal_type"
              margin="normal"
            />
          )}
        />
      <TextField
        fullWidth
        margin="normal"
        label="Notas Adicionales"
        name="additionalNotes"
        value={ownerData.additionalNotes}
        onChange={handleChange}
        multiline
        rows={4}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "16px",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{
            display: "flex",
            alignItems: "center",
            borderRadius: "50%",
            minWidth: "56px",
            height: "56px",
          }}
        >
          <CheckIcon />
        </Button>
      </div>
      <Snackbar
        open={!!message.text}
        autoHideDuration={4000}
        onClose={() => setMessage({ type: "", text: "" })}
      >
        <Alert
          severity={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default EditOwner;
