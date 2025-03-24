import { useState, useEffect } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "../../pages/edit/EditPage";

const EditWaitingRoom = ({ updateWaitingRoom = null }) => {
  const [waitingRoom, setWaitingRoom] = useState(
    updateWaitingRoom || {
      structure: { name: "" },
      owner: null,
      pet: null,
      user: null,
      notes: "",
      pre_attended_by_user: null,  // Aseguramos que esté presente
      created_by_id_user: null,    // Aseguramos que esté presente
    }
  );
  const [structures, setStructures] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  // Función auxiliar para buscar el ID por nombre en un array de objetos
  const getIdByName = (list, name) => {
    if (!name) return null;
    const found = list.find(
      (item) =>
        item.name &&
        item.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    return found ? found.id : null;
  };

  useEffect(() => {
    updateTitle(
      updateWaitingRoom ? updateWaitingRoom.thumb_url : "",
      updateWaitingRoom
        ? strings.update_waiting_room
        : strings.new_waiting_room,
      strings.complete_data
    );

    setIsLoading(true);
    const fetchForInput = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}waiting_rooms?page=1`,
          {
            withCredentials: true,
          }
        );

        const data = response.data?.data?.content || [];

        if (data.length > 0) {
          console.log("Datos de la API:", data);
          setStructures(data.map((item) => ({ name: item.site })));
          setOwners(data.map((item) => item.owner));
          setPets(data.map((item) => item.pet));
          setUsers(data.map((item) => item.created_by_user)); // Asegúrate de que users tenga el campo id
        } else {
          setStructures([]);
          setOwners([]);
          setPets([]);
          setUsers([]);
        }
      } catch (error) {
        lib.handleError(error);
        snackbar("Error al cargar los datos, intenta nuevamente");
      } finally {
        setIsLoading(false);
      }
    };

    fetchForInput();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateWaitingRoom) {
      update(); // Si es una actualización, ejecuta la función update
    } else {
      save(); // Si es creación, ejecuta la función save
    }
  };

  const save = async () => {
    setIsLoading(true);

    // Verifica los valores de waitingRoom antes de enviar la solicitud
    console.log("Valores de waitingRoom antes de enviar:", waitingRoom);

    // Se buscan los IDs correspondientes usando getIdByName si no vienen en el objeto
    const id_pet =
      waitingRoom.pet?.id || getIdByName(pets, waitingRoom.pet?.name || "");
    const id_owner =
      waitingRoom.owner?.id ||
      getIdByName(owners, waitingRoom.owner?.name || "");
    const id_pre_attended =
      waitingRoom.pre_attended_by_user?.id ||
      getIdByName(users, waitingRoom.pre_attended_by_user?.name || "");
    const site = waitingRoom.structure && waitingRoom.structure.name
      ? waitingRoom.structure.name
      : "";

    const dataToSend = {
      created_by_id_user: waitingRoom.created_by_id_user, // Asegúrate de que created_by_id_user no esté null
      id_pet: id_pet, // Se obtiene de waitingRoom.pet o se busca en el array pets
      id_owner: id_owner, // Se obtiene de waitingRoom.owner o se busca en el array owners
      pre_attended_by_id_user: id_pre_attended, // Se obtiene de waitingRoom.pre_attended_by_user o se busca en el array users
      site: site, // Se obtiene de waitingRoom.structure.name
    };

    console.log("Datos a enviar:", dataToSend);

    // Asegúrate de que no estemos enviando valores nulos en los campos obligatorios
    if (!dataToSend.created_by_id_user || !dataToSend.id_pet || !dataToSend.site) {
      console.log("Faltan datos obligatorios para enviar la solicitud", dataToSend);
      snackbar("Por favor, completa todos los campos necesarios.");
      setIsLoading(false);
      return;
    }

    let response;

    try {
      // Si estamos creando, envía la solicitud POST
      response = await axios.post(
        `${import.meta.env.VITE_API_URL}waiting_rooms`,
        dataToSend,
        { withCredentials: true }
      );

      console.log("Respuesta de la API:", response);

      // Navega a la vista de la sala de espera después de que se guarde
      navigate(`/main/view-waiting-room/${response.data.data.id}`);
    } catch (error) {
      console.log("Error en la solicitud:", error);
      lib.handleError(error);
      snackbar("Error al realizar la solicitud. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const update = async () => {
    setIsLoading(true);

    console.log("Valores de waitingRoom antes de enviar:", waitingRoom);

    const id_pet =
      waitingRoom.pet?.id || getIdByName(pets, waitingRoom.pet?.name || "");
    const id_owner =
      waitingRoom.owner?.id ||
      getIdByName(owners, waitingRoom.owner?.name || "");
    const id_pre_attended =
      waitingRoom.pre_attended_by_user?.id ||
      getIdByName(users, waitingRoom.pre_attended_by_user?.name || "");
    const site = waitingRoom.structure && waitingRoom.structure.name
      ? waitingRoom.structure.name
      : "";

    const dataToSend = {
      created_by_id_user: waitingRoom.created_by_id_user, // Asegúrate de que created_by_id_user no esté null
      id_pet: id_pet,
      id_owner: id_owner,
      pre_attended_by_id_user: id_pre_attended,
      site: site,
    };

    console.log("Datos a enviar:", dataToSend);

    if (!dataToSend.created_by_id_user || !dataToSend.id_pet || !dataToSend.site) {
      console.log("Faltan datos obligatorios para enviar la solicitud", dataToSend);
      snackbar("Por favor, completa todos los campos necesarios.");
      setIsLoading(false);
      return;
    }

    let response;

    try {
      // Si estamos actualizando, envía la solicitud PUT
      response = await axios.put(
        `${import.meta.env.VITE_API_URL}waiting_rooms?id=8&attended_by_id_user=3`,
        dataToSend,
        { withCredentials: true }
      );

      console.log("Respuesta de la API:", response);

      // Navega a la vista de la sala de espera después de que se guarde
      navigate(`/main/view-waiting-room/${response.data.data.id}`);
    } catch (error) {
      console.log("Error en la solicitud:", error);
      lib.handleError(error);
      snackbar("Error al realizar la solicitud. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      {/* Autocomplete para la estructura */}
      <Autocomplete
        fullWidth
        freeSolo
        options={structures}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name || ""
        }
        value={waitingRoom.structure}
        onChange={(e, newValue) => {
          console.log("Nuevo valor para estructura:", newValue);
          setWaitingRoom({
            ...waitingRoom,
            structure: typeof newValue === "string" ? { name: newValue } : newValue,
          });
        }}
        renderInput={(params) => (
          <TextField {...params} label={strings.structure} margin="normal" />
        )}
      />

      {/* Autocomplete para el dueño */}
      <Autocomplete
        fullWidth
        freeSolo
        options={owners}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name || ""
        }
        value={waitingRoom.owner}
        onChange={(e, newValue) => {
          console.log("Nuevo valor para propietario:", newValue);
          setWaitingRoom({
            ...waitingRoom,
            owner: typeof newValue === "string" ? { name: newValue } : newValue,
          });
        }}
        renderInput={(params) => (
          <TextField {...params} label={strings.owner} margin="normal" />
        )}
      />

      {/* Autocomplete para la mascota */}
      <Autocomplete
        fullWidth
        freeSolo
        options={pets}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name || ""
        }
        value={waitingRoom.pet}
        onChange={(e, newValue) => {
          console.log("Nuevo valor para mascota:", newValue);
          setWaitingRoom({
            ...waitingRoom,
            pet: typeof newValue === "string" ? { name: newValue } : newValue,
          });
        }}
        renderInput={(params) => (
          <TextField {...params} label={strings.pet} margin="normal" />
        )}
      />

      {/* Autocomplete para pre_attended_by_user */}
      <Autocomplete
        fullWidth
        freeSolo
        options={users}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name || ""
        }
        value={waitingRoom.pre_attended_by_user}
        onChange={(e, newValue) => {
          console.log("Nuevo valor para pre-attended by user:", newValue);
          setWaitingRoom({
            ...waitingRoom,
            pre_attended_by_user:
              typeof newValue === "string" ? { name: newValue } : newValue,
            created_by_id_user: newValue && newValue.id ? newValue.id : waitingRoom.created_by_id_user,
          });
        }}
        renderInput={(params) => (
          <TextField {...params} label={strings.pre_attended_by_user} margin="normal" />
        )}
      />

      {/* Campo para notas */}
      <TextField
        fullWidth
        margin="normal"
        label={strings.notes}
        name="notes"
        value={waitingRoom.notes}
        onChange={(e) =>
          setWaitingRoom({ ...waitingRoom, notes: e.target.value })
        }
        multiline
        rows={4}
      />
    </EditPage>
  );
};

export default EditWaitingRoom;



