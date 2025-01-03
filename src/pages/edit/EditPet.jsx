import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Autocomplete,
  Fab,
  Container,
  Box,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib"; 
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings"
import { useLoading } from '../../providers/LoadingProvider';
import PropTypes from 'prop-types';

const EditPet = ({ updatePet = null }) => {

  const [pet, setPet] = useState(updatePet || {
    owner: null,
    name: '',
    breed: '',
    coat: '',
    gender: '',
    character: '',
    birthDate: '',
    weight: '',
    chip: '',
    notes: '',
  });

  const [owners, setOwners] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [coats, setCoats] = useState([]);
  const [genders, setGenders] = useState([]);
  const [characters, setCharacters] = useState([]);

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    name: useRef(null),
  });

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    if (updatePet)
      updateTitle('', strings.update_pet, strings.complete_data);
    else
      updateTitle('', strings.new_pet, strings.complete_data);

    setIsLoading(true);

    const fetchData = async () => {
      try {
        const ownersData = await lib.fetchOwnersForInput();
        const petsData = await lib.fetchPetsForInput();

        setOwners(ownersData.owners || []);
        setBreeds(petsData.breeds || []);
        setCoats(petsData.coats || []);
        setGenders(petsData.genders || []);
        setCharacters(petsData.characters || []);
      } catch (error) {
        lib.handleError(error);
        snackbar('Error al cargar datos, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet({ ...pet, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lib.validateNonEmpty('name', pet.name, setErrors, refs.name))
      return;

    if (updatePet)
      update();
    else
      save();
  };

  const save = async () => {
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}pets`, // Cambiar endpoint a "pets"
        pet, // Cambiar la variable a "pet"
        { withCredentials: true }
      );
      // console.log(response);
      navigate(`/main/view-pet/${response.data.data.id}`); // Ajustar la ruta a "view-pet"
    } catch (error) {
      lib.handleError(error);
      snackbar('Error, intenta nuevamente');
    } finally {
      setIsLoading(false);
    }
  };
  

  const update = async () => {
    setIsLoading(true);
  
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}pets`, // Cambiar endpoint a "pets"
        pet, // Cambiar la variable a "pet"
        { withCredentials: true }
      );
      navigate(`/pets/${response.data.data.id}`); // Ajustar la ruta a "pets"
    } catch (error) {
      lib.handleError(error);
      snackbar('Error, intenta nuevamente');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Container>

      <Box 
        sx={{ mb: 4 }}
        component="form"
        onSubmit={handleSubmit}
      >

        <Autocomplete
          fullWidth
          options={owners}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={pet.owner || null}
          onChange={(e, newValue) =>
            setPet({
              ...pet,
              owner: newValue
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.owner}
              name="owner"
              margin="normal"
              
            />
          )}
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.name + ' *'}
          name="name"
          value={pet.name}
          onChange={handleChange}
          inputRef={refs.name}
          error={!!errors.name}
          helperText={errors.name}
        />

        <Autocomplete
          fullWidth
          options={breeds}
          getOptionLabel={(option) => option.name}
          value={pet.breed || null}
          onChange={(e, newValue) =>
            setPet({
              ...pet,
              breed: newValue
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.breed}
              name="breed"
              margin="normal"
              
            />
          )}
        />

        <Autocomplete
          fullWidth
          options={coats}
          getOptionLabel={(option) => (option ? option : "")}
          value={pet.coat}
          onChange={(e, newValue) =>
            setPet({
              ...pet,
              coat: newValue
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.coat}
              name="coat"
              margin="normal"
              
            />
          )}
        />

        <Autocomplete
          fullWidth
          options={genders}
          getOptionLabel={(option) => (option ? option : "")}
          value={pet.gender}
          onChange={(e, newValue) =>
            setPet({
              ...pet,
              gender: newValue
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.gender}
              name="gender"
              margin="normal"
              
            />
          )}
        />

        <Autocomplete
          fullWidth
          options={characters}
          getOptionLabel={(option) => (option ? option : "")}
          value={pet.character}
          onChange={(e, newValue) =>
            setPet({
              ...pet,
              character: newValue
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.character}
              name="character"
              margin="normal"
              
            />
          )}
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.birthDate}
          name="birthDate"
          value={pet.birthDate}
          onChange={handleChange}
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.weight}
          name="weight"
          value={pet.weight}
          onChange={handleChange}
          type="number"
          
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.chip}
          name="chip"
          value={pet.chip}
          onChange={handleChange}
          
        />

        <TextField
          fullWidth
          margin="normal"
          label={strings.notes}
          name="notes"
          value={pet.notes}
          onChange={handleChange}
          multiline
          rows={4}
        />

        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Fab
            color="primary"
            aria-label="save"
            onClick={handleSubmit}
          >
            <CheckIcon />
          </Fab>
        </Box>

      </Box>

    </Container>
  );
};
EditPet.propTypes = {
  updatePet: PropTypes.func.isRequired, // Validación para la función updatePet
};

export default EditPet;

