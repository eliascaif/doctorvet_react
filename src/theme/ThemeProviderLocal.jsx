// import React from 'react';
import { createTheme } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';

export const theme = createTheme({
  components: {

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFormHelperText-root.Mui-error': {
            color: 'blue', // Cambiar el color del mensaje de error (helper text)
          },
          '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'blue', // Cambiar el color del borde del TextField en estado de error
          },
          '& .MuiInputLabel-root.Mui-error': {
            color: 'blue', // Cambiar el color del label en estado de error
          },
          '& .MuiInputBase-input': {
            color: 'black', // Mantener el color del texto del input en negro
          },
        },
      },
    },

    MuiContainer: {
      defaultProps: {
        maxWidth: 'md',
      },
      styleOverrides: {
        root: {
          minWidth: '400px', // Ajusta el valor según tus necesidades
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#fff', // Color del texto del elemento seleccionado
            backgroundColor: '#1976d2', // Color de fondo del elemento seleccionado
            '&:hover': {
              backgroundColor: '#1565c0', // Color de fondo al pasar el ratón sobre el elemento seleccionado
            },
          },
        },
      },
    },

  },
});

// export const theme = createTheme({
//   components: {
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .Mui-error': {
//             color: 'blue', // Cambiar el color del texto de error
//           },
//           '& .MuiFormHelperText-root.Mui-error': {
//             color: 'blue', // Cambiar el color del mensaje de error (helper text)
//           },
//           '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
//             borderColor: 'blue', // Cambiar el color del borde del TextField en estado de error
//           },
//           '& .MuiInputLabel-root.Mui-error': {
//             color: 'blue', // Cambiar el color del label en estado de error
//           },
//         },
//       },
//     },
//   },
// });

// const MyApp = () => {
//   return (
//     <ThemeProvider theme={theme}>
//       <TextField
//         label="Nombre"
//         variant="outlined"
//         error
//         helperText="Este campo es obligatorio"
//       />
//     </ThemeProvider>
//   );
// };
