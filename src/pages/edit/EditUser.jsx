import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppBar } from "../../providers/AppBarProvider";
import { useLoading } from "../../providers/LoadingProvider";
import { useSnackbar } from "../../providers/SnackBarProvider";
import * as lib from "../../utils/lib";
import { strings } from "../../constants/strings";
import axios from "axios";
import { Container, Box, TextField, Autocomplete, Fab } from "@mui/material";

import EditPage from "./EditPage";

export const EditUser = ({ initialUser = null }) => {
  const [user, setUser] = useState(
    initialUser || {
      name: "",
      address: "",
      region: null,
      phone: "",
      notes: "",
      login_type: "",
      thumb_url: "",
    }
  );

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const regionRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [regions, setRegions] = useState([]);

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle(
      initialUser ? initialUser.thumb_url : "",  // Thumb
      strings.update_user,                       // Título: "Actualizar usuario"
      strings.complete_data                      // Subtítulo: "Completa los datos"
    );

    

    const fetchedRegions = async () => {
      try {
        const response = await lib.fetchRegions();
        setRegions(response || []);
      } catch (error) {
        lib.handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchedRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validateRegion = () => {
    if (!user.region) {
      setErrors((prev) => ({ ...prev, region: "La región es requerida" }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, region: "" }));
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !lib.validateNonEmpty("name", user.name, setErrors, nameRef) ||
      !lib.validateNonEmpty("phone", user.phone, setErrors, phoneRef) ||
      !validateRegion()
    ) {
      return;
    }

    update();
  };

  const update = async () => {
    setIsLoading(true);
    try {
      const userId = user.id_user;
      if (!userId) {
        showSnackbar("No se encontró el ID del usuario.", "error");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}users/${userId}`,
        user,
        { withCredentials: true }
      );

      console.log("User updated:", response.data);
      showSnackbar(strings.user_updated, "success");
      navigate("/main/view-user", {
        state: { id: response.data.data.id_user },
      });
    } catch (error) {
      lib.handleError(error);
      showSnackbar("Error, intenta nuevamente", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, photo: file });
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label={strings.name + " *"}
        name="name"
        value={user.name}
        onChange={handleChange}
        inputRef={nameRef}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.address}
        name="address"
        value={user.address}
        onChange={handleChange}
      />
      <Autocomplete
        fullWidth
        options={regions}
        getOptionLabel={(option) =>
          option && typeof option === "object" ? option.friendly_name : ""
        }
        value={user.region}
        onChange={(e, newValue) => {
          setUser({ ...user, region: newValue });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            label={strings.region + " *"}
            inputRef={regionRef}
            error={!!errors.region}
            helperText={errors.region}
          />
        )}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.phone + " *"}
        name="phone"
        value={user.phone}
        onChange={handleChange}
        inputRef={phoneRef}
        error={!!errors.phone}
        helperText={errors.phone}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.notes}
        name="notes"
        value={user.notes}
        onChange={handleChange}
        multiline
        rows={4}
      />
      {user.login_type === "EMAIL" && (
        <TextField
          fullWidth
          margin="normal"
          type="file"
          InputLabelProps={{ shrink: true }}
          onChange={handlePhotoChange}
        />
      )}
    </EditPage>
  );
};

export default EditUser;
