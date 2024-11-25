import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/ThemeProviderLocal.jsx';
import { SnackBarProvider } from './providers/SnackBarProvider.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ConfigProvider } from './contexts/ConfigContext.jsx';
import { TitleProvider } from './contexts/TitleContext.jsx';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <SnackBarProvider>
        <AuthProvider>
          <ConfigProvider>
            <TitleProvider>
              <App />
            </TitleProvider>
          </ConfigProvider>
        </AuthProvider>
      </SnackBarProvider>
    </ThemeProvider>
  </StrictMode>
)
