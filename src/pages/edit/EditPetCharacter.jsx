import { useState, useEffect, useRef } from "react";
import { TextField, Fab, Container, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import * as lib from "../../utils/lib";
import PropTypes from "prop-types";

export const EditPetCharacter = ({ updateCharacter = null }) => {
  const [petCharacter, setPetCharacter] = useState(
    updateCharacter || {character: "" }
  );
  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    character: useRef(null),
  });
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updateCharacter) {
      updateTitle("", strings.update_pet_character, strings.complete_data);
    } else {
      updateTitle("", strings.new_pet_character, strings.complete_data);
    }
  }, [updateCharacter, updateTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetCharacter({ ...petCharacter, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !lib.validateNonEmpty("character", petCharacter.character, setErrors, refs.character)
    ) {
      return;
    }
    if (updateCharacter) {
      update();
    } else {
      save();
    }
  };

  const save = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}pet-characters`,
        petCharacter,
        { withCredentials: true }
      );
      navigate(`/main/view-pet-character/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al guardar el personaje.");
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}pet-characters`,
        petCharacter,
        { withCredentials: true }
      );
      navigate(`/main/view-pet-character/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al actualizar el personaje.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }} component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label={strings.character + " *"}
          name="name"
          value={petCharacter.character}
          onChange={handleChange}
          inputRef={refs.character}
          error={!!errors.character}
          helperText={errors.character}
        />
        <Box  
        sx={{
            position: "relative", 
            display: "flex",
            justifyContent: "flex-end",
            mt: 2,
          }}>
          <Fab color="primary" aria-label="add" onClick={handleSubmit}>
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};

EditPetCharacter.propTypes = {
  updateCharacter: PropTypes.shape({
    character: PropTypes.string.isRequired,
  }),
};