import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/ThemeProviderLocal.jsx';
import { SnackBarProvider } from './providers/SnackBarProvider.jsx'
import { AuthProvider } from './providers/AuthProvider.jsx';
import { ConfigProvider } from './providers/ConfigProvider.jsx';
import { AppBarProvider } from './providers/AppBarProvider.jsx';
import { LoadingProvider } from './providers/LoadingProvider.jsx';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <SnackBarProvider>
        <LoadingProvider>
          <AuthProvider>
            <ConfigProvider>
              <AppBarProvider>
                <App />
              </AppBarProvider>
            </ConfigProvider>
          </AuthProvider>
        </LoadingProvider>
      </SnackBarProvider>
    </ThemeProvider>
  </StrictMode>
)
