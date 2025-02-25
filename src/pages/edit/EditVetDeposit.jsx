import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, TextField, Fab } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import * as lib from "../../utils/lib"; 
import axios from "axios";
import { strings } from "../../constants/strings";
import EditPage from "./EditPage";

const EditVetDeposit = ({ updateDeposit = null }) => {
  const { id } = useParams();
  const [deposit, setDeposit] = useState(
    updateDeposit || { id: id || null, name: "" }
  );
  const [errors, setErrors] = useState({});
  const refs = { name: useRef(null) };

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle("", deposit.id || updateDeposit ? strings.update_deposit : strings.new_deposit ,
          strings.complete_data);
  }, [updateTitle, updateDeposit, deposit.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeposit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lib.validateNonEmpty("name", deposit.name, setErrors, refs.name)) return;
    if (deposit.id || updateDeposit) {
      await update();
    } else {
      await save();
    }
  };

  const save = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}vets?create_deposit`,
        deposit,
        { withCredentials: true }
      );
      console.log("Save Deposit:", response.data);
      showSnackbar("Depósito creado");
      navigate("/main/view-deposit", { state: { id: response.data.data.id } });
    } catch (error) {
      lib.handleError(error);
      showSnackbar("Error, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    setIsLoading(true);
    try {
      const depositId = deposit.id || id;
      const url = `${import.meta.env.VITE_API_URL}vets?update_deposit&id=${depositId}`;
      const response = await axios.put(url, deposit, { withCredentials: true });
      console.log("Update Deposit:", response.data);
      showSnackbar("Depósito actualizado");
      navigate(`/main/view-deposit/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      showSnackbar("Error al actualizar depósito, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label={strings.name + " *"}
          name="name"
          value={deposit.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />
        <Box  sx={{
          position: "relative", 
          display: "flex",
          justifyContent: "flex-end",
          mt: 2,
        }}>
          
        </Box>
        </EditPage>
  );
};

export default EditVetDeposit;

