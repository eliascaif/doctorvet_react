/* import { useRef, useState, useEffect } from "react";
import { AppBarProvider } from "../../providers/AppBarProvider";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../providers/LoadingProvider";
import { strings } from "../../constants/strings";
import axios from "axios";
import * as lib from "../../utils/lib";

export const EditPetRace = ({ updatePetRace = null }) => {
  const [petRace, setPetRace] = useState(
    updatePetRace || {
      name: "",
      especie: null,
    }
  );
  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    name: useRef(null),
    especie: useRef(null),
  });
  const [especies, setEspecies] = useState([]);
  const navigate = useNavigate();
  const { updateTitle } = AppBarProvider();
  const snackbar = useSnackbar();
  const { isLoading, setIsLoading } = useLoading();

  //useEffect
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
          `${import.meta.env.VITE_API_URL}/pets_races`,
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

  //handleChange

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetRace({ ...petRace, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (!lib.validateNonEmpty("name", petRace.name),
      setErrors,
      refs.name || !lib.validateNonEmpty("especies", petRace.especies),
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
        `{import.meta.env.VITE_API_URL}/pets_races`,
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

  return <>EditPetRace</>;
};
 */