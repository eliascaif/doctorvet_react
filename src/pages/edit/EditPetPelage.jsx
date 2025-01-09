import { useRef } from "react";
import { useState, useEffect } from "react";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { Box, Container, TextField, Fab } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";

export const EditPetPelage = ({ updatePelage = null }) => {
  const [petPelage, setPetPelage] = useState(updatePelage || { pelage: "" });

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    pelage: useRef(null),
  });

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updatePelage) {
      updateTitle("", strings.update_pelage, strings.complete_data);
    } else {
      updateTitle("", strings.new_pelage, strings.complete_data);
    }
  }, [updatePelage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetPelage({ ...petPelage, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!lib.validateNonEmpty("pelage", petPelage.pelage, setErrors, refs.pelage))
      return;

    if (updatePelage) {
      update();
    } else {
      save();
    }
  }
    const save = async () => {
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}pets_pelages`,
          petPelage,
          { withCredentials: true }
        );
        navigate(`/main/view-pet-pelage/${response.data.data.id}`);
      } catch (error) {
        console.error("Error en la solicitud:", error);
        lib.handleError(error);
        snackbar("Error al guardar pelage, por favor intentelo de nuevo");
      } finally {
        setIsLoading(false);
      }
    };

    const update = async () => {
      setIsLoading(true);


      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/pets_pelages`,
          petPelage,
          { withCredentials: true }
        );
        navigate(`/main/view-pet-character/${response.data.data.id}`);
      } catch (error) {
        console.error("Error en la solicitud:", error);
        lib.handleError(error);
        snackbar("Error al actualizar pelage, por favor intentelo de nuevo");
      } finally {
        setIsLoading(false);
      }
    };


  return (
    <Container>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={strings.pelage + " *"}
          name="name"
          value={petPelage.pelage}
          onChange={handleChange}
          inputRef={refs.pelage}
          error={!!errors.pelage}
          helperText={errors.pelage}
        ></TextField>

        <Box
          sx={{
            position: "relative", 
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}
        >
          <Fab color="primary" aria-label="add" onClick={handleSubmit}>
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};
EditPetPelage.propTypes = {
  updatePelage: PropTypes.shape({
    pelage: PropTypes.string.isRequired,
  }),
};