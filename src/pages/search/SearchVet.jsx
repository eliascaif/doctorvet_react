import React, { useState } from 'react';
import SearchPageUpdateItem from './SearchPageUpdateItem';
import { fetchVets } from '../../utils/lib';
import { useSearchParams } from 'react-router-dom';
import { handleError } from '../../utils/lib';
import ListItemVetSuscribe from '../../layouts/ListItemVetSuscribe';
import axios from 'axios';
import useConfirmDialog from '../../hooks/UseConfirmDialog';
import { useLoading } from "../../providers/LoadingProvider";

const SearchVet = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); 
  //const preAccessToken = searchParams.get("pre_access_token");
  const [results, setResults] = useState([]);
  const { showDialog, ConfirmDialog } = useConfirmDialog();
  const { isLoading, setIsLoading } = useLoading();

  const renderVetItem = (vet) => (
    <ListItemVetSuscribe 
      key={vet.id} 
      vet={vet}
      associated={vet.associated}
      requested={vet.requested}
      onSuscribeClick={() => handleSuscribe(vet, email)}
      onCancelSuscribeClick={() => handleCancelSuscribe(vet, email)}
      />
  );

  const handleSuscribe = async (vet, email) => {
    try {
      setIsLoading(true);

      const userConfirmed = await showDialog(
        '¿Unirse a veterinaria?'
      );
      
      if (userConfirmed) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}users_requests?create_request`,
          { user_email: email, id_vet: vet.id }
        );
        console.log(response);
  
        // Actualizar el estado local del veterinario
        setResults((prevResults) =>
          prevResults.map((item) =>
            item.id === vet.id
              ? { ...item, requested: 1 } 
              : item
          )
        );
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSuscribe = async (vet, email) => {
    try {
      setIsLoading(true);

      const userConfirmed = await showDialog(
        '¿Eliminar solicitud?'
      );

      if (userConfirmed) {
        const params = {
          user_email: email,
          id_vet: vet.id,
        };
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}users_requests`,
          { params: params }
        );
        //console.log(response);
  
        // Actualizar el estado local del veterinario
        setResults((prevResults) =>
          prevResults.map((item) =>
            item.id === vet.id
              ? { ...item, requested: 0 } 
              : item
          )
        );
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchPageUpdateItem
        fetchFunction={fetchVets}
        fetchArgs={[email]}
        renderItem={renderVetItem}
        placeholder="Buscar veterinaria..."
        results={results}
        setResults={setResults}      
      />
      <ConfirmDialog />
    </>
  );
};

export default SearchVet;