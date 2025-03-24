import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Dialog,
  Fab,
  Tabs,
  Tab,
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import { useAppBar } from '../../providers/AppBarProvider';
import { fetchClinic, formatCurrency, formatHour, getSupplyStr, formatDateLong, getReasonStr, formatDate } from '../../utils/lib';
import { strings } from "../../constants/strings"
import ListItemRectangle from '../../layouts/ListItemRectangle';
import ClinicItem from '../../layouts/ClinicItem';
import Clinic2Item from '../../layouts/Clinic2Item';

function ViewPetClinic({pet}) {

  const [page, setPage] = useState(1);
  const [clinicRoot, setClinicRoot] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClinic_ = async () => {
      setClinicRoot(await fetchClinic(pet.id, page));
      setIsLoading(false);
    };
    fetchClinic_();
  }, []);

  // if (!pet) return (
  //   <>
  //     <CircularProgress
  //       size={42}
  //       sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-21px', marginLeft: '-21px' }}
  //     />
  //     {/* <Dialog open={isLoading} /> */}
  //   </>
  // );

  return (
    // style={{ overflow: 'auto', maxHeight: '100vh' }}
    <Container maxWidth="xl" sx={{ mt: 4 }} >
      {clinicRoot.map((item, index) => {
        if (item.clinic)
          return <ClinicItem key={index} clinic={item.clinic} />;

        if (item.clinic2) 
          return <Clinic2Item key={index} clinic2={item.clinic2} />;

        return null;  // Si no tiene ninguna de las claves esperadas
      })}
    </Container>
  );
}

export default ViewPetClinic;

