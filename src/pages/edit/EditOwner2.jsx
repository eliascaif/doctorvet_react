import React, { useState, useEffect, useRef } from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import * as lib from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import { useLoading } from "../../providers/LoadingProvider";
import EditPage from "../../pages/edit/EditPage";

const EditOwner2 = ({ updateOwner = null }) => {
  const [owner, setOwner] = useState(
    updateOwner || {
      name: "",
      address: "",
      region: null,
      phone: "",
      email: "",
      regional_id: "",
      fiscal_type: null,
      notes: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [refs] = useState({
    name: useRef(null),
    email: useRef(null),
  });
  const [regions, setRegions] = useState([]);
  const [fiscalTypes, setFiscalTypes] = useState([]);
  
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    updateTitle(
      updateOwner ? updateOwner.thumb_url : '',
      updateOwner ? strings.update_owner : strings.new_owner,
      strings.complete_data
    );

    setIsLoading(true);
    const fetchForInput = async () => {
      //const ownersForInput = await lib.fetchOwnersForInput();
      const ownersForInput = await lib.fetchForInput('owners', 'owners_for_input');
      setRegions(ownersForInput.regions);
      setFiscalTypes(ownersForInput.finance_types_fiscal);
      setIsLoading(false);
    };
    fetchForInput();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOwner({ ...owner, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !lib.validateNonEmpty("name", owner.name, setErrors, refs.name) ||
      !lib.validateEmail("email", owner.email, setErrors, refs.email, true)
    )
      return;

    save();
  };

  const save = async () => {
    setIsLoading(true);
    try {
      let response;
      if (updateOwner) {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}owners`,
          owner,
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}owners`,
          owner,
          { withCredentials: true }
        );
      }

      navigate(`/main/view-owner/${response.data.data.id}`);
    } catch (error) {
      lib.handleError(error);
      snackbar("Error, intenta nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EditPage 
      onSubmit={handleSubmit} 
      // isLoading={isLoading}
      >
      
      <TextField
        fullWidth
        margin="normal"
        label={strings.name + " *"}
        name="name"
        value={owner.name}
        onChange={handleChange}
        inputRef={refs.name}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.address}
        name="address"
        value={owner.address}
        onChange={handleChange}
      />
      <Autocomplete
        fullWidth
        options={regions}
        getOptionLabel={(option) => (option ? option.friendly_name : "")}
        value={owner.region}
        onChange={(e, newValue) =>
          setOwner({
            ...owner,
            region: newValue,
          })
        }
        renderInput={(params) => (
          <TextField {...params} label={strings.region} name="region" margin="normal" />
        )}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.phone}
        name="phone"
        value={owner.phone}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.email}
        name="email"
        value={owner.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.regional_id}
        name="regional_id"
        value={owner.regional_id}
        onChange={handleChange}
      />
      <Autocomplete
        fullWidth
        options={fiscalTypes}
        getOptionLabel={(option) => (option ? option.name : "")}
        value={owner.fiscal_type}
        onChange={(e, newValue) => {
          setOwner({ ...owner, fiscal_type: newValue });
        }}
        renderInput={(params) => (
          <TextField {...params} label={strings.fiscal_type} name="fiscal_type" margin="normal" />
        )}
      />
      <TextField
        fullWidth
        margin="normal"
        label={strings.notes}
        name="notes"
        value={owner.notes}
        onChange={handleChange}
        multiline
        rows={4}
      />
    </EditPage>
  );
};

export default EditOwner2;
