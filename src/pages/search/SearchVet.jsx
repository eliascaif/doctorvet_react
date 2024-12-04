import React from 'react';
import SearchPage from './SearchPage';
import { ListItemText } from '@mui/material';
import { fetchVets } from '../../utils/lib';

const SearchVet = () => {

  const renderVetItem = (vet) => (
    <ListItemText primary={vet.name} secondary={vet.email} />
  );

  return (
    <SearchPage
      fetchFunction={fetchVets}
      fetchArgs={[config.user.email]}
      renderItem={renderVetItem}
      placeholder="Buscar veterinarias..."
    />
  );
};

export default SearchVet;












// // Función simulada para hacer llamadas a la API
// async function fetchRegions(searchText, page) {
//   // Aquí se realizaría la llamada real a la API
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const total_pages = 3;
//       const regions = [];
//       for (let i = 0; i < 10; i++) {
//         regions.push({ id: i + (page - 1) * 10, name: `Región ${i + 1}` });
//       }
//       resolve({ content: regions, total_pages });
//     }, 1000);
//   });
// }

// function SearchRegion({ onSelect, onCreateNew, suggest }) {
//   const fetchData = async (searchText, page) => {
//     return await fetchRegions(searchText, page);
//   };

//   const renderItem = (item) => <ListItemText primary={item.name} />;

//   const onItemSelect = (item) => {
//     if (onSelect) {
//       onSelect(item);
//     }
//   };

//   const handleCreateElement = () => {
//     if (onCreateNew) {
//       onCreateNew();
//     }
//   };

//   const renderNoResults = () => (
//     <div>
//       <Typography variant="body1">No se encontraron regiones.</Typography>
//       {suggest && (
//         <Button variant="contained" color="secondary" onClick={handleCreateElement}>
//           Crear Nueva Región
//         </Button>
//       )}
//     </div>
//   );

//   return (
//     <SearchBase
//       fetchData={fetchData}
//       renderItem={renderItem}
//       onItemSelect={onItemSelect}
//       renderNoResults={renderNoResults}
//     />
//   );
// }

// export default SearchRegion;
