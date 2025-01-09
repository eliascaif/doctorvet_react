import { useRef, useState, useEffect } from "react";
import { TextField, Autocomplete, Fab, Container, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useAppBar } from "../../providers/AppBarProvider";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../providers/LoadingProvider";
import { strings } from "../../constants/strings";
import axios from "axios";
import * as lib from "../../utils/lib";
import PropTypes from "prop-types";

const EditPetRace = ({ updatePetRace = null }) => {
  const [petRace, setPetRace] = useState(
    updatePetRace || {
      race: "",
      especie: null,
    }
  );
  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    race: useRef(null),
    especie: useRef(null),
  });
  const [especies, setEspecies] = useState([]);
  const navigate = useNavigate();
  const { updateTitle } = useAppBar();
  const snackbar = useSnackbar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updatePetRace) {
      updateTitle("", strings.updatePetRace, strings.complete_data);
    } else {
      updateTitle("", strings.newPetRace, strings.complete_data);
    }

    setIsLoading(true);

    const fetchPetRace = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}pets_especies`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setEspecies(response.data);
        } else {
          throw new Error("Error fetching species");
        }
      } catch (error) {
        console.error("Error al cargar especies:", error);
        snackbar("Error al cargar especies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetRace();
  }, [updatePetRace]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetRace({ ...petRace, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (!lib.validateNonEmpty("race", petRace.race,
      setErrors,
      refs.name) || !lib.validateNonEmpty("especies", petRace.especies),
      setErrors,
      refs.name)
    ) {
      return;
    }

    if (updatePetRace) {
      update();
    } else {
      save();
    }
  };

  const update = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}pets_races`,
        { withCredentials: true }
      );
      navigate(`/main/view-pet-race`, { state: { id: response.data.data.id } });
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al actualizar la raza");
    } finally {
      setIsLoading(false);
    }
  };

  const save = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}pets_races`,
        { withCredentials: true }
      );
      navigate(`/main/view-pet-race`, { state: { id: response.data.data.id } });
    } catch (error) {
      lib.handleError(error);
      snackbar("Error al guardar la raza");
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
          label={`${strings.race} *`}
          name="name"
          value={petRace.race}
          onChange={handleChange}
          inputRef={refs.race}
          error={!!errors.race}
          helperText={errors.race}
        />
        <Autocomplete
          fullWidth
          options={especies}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={petRace.especie}
          onChange={(e, newValue) =>
            setPetRace({
              ...petRace,
              especie: newValue,
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={`${strings.especie} *`}
              name="especie"
              margin="normal"
              inputRef={refs.especie}
              error={!!errors.especie}
              helperText={errors.especie}
            />
          )}
        />
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Fab color="primary" aria-label="save" onClick={handleSubmit}>
            <CheckIcon />
          </Fab>
        </Box>
      </Box>
    </Container>
  );
};
EditPetRace.propTypes = {
  updatePetRace: PropTypes.func, 
};

export default EditPetRace;
