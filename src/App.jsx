import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/ProtectedRoute';
import AuthContext from './contexts/AuthContext';

import Login from './pages/Login';
import LoginCreateAccount from './pages/LoginCreateAccount';
import LoginCheckValid from './pages/LoginCheckValid';
import LoginChoice from './pages/LoginChoice';
import LoginForgotPassword from './pages/LoginForgotPassword';
import LoginForgotPassword2 from './pages/LoginForgotPassword2';
import LoginForgotPassword3 from './pages/LoginForgotPassword3';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';

import EditVet from './pages/edit/EditVet';

import SearchTest from './pages/search/SearchTest';
import SearchVet from './pages/search/SearchVet';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Routes>

        {/* public */}
        <Route path="/" element={ isAuthenticated ? <Navigate to="/main" /> : <Login /> } />
        <Route path="login-create-account" element={<LoginCreateAccount />} />
        <Route path="login-check-valid" element={<LoginCheckValid />} />
        <Route path="login-choice" element={<LoginChoice />} />
        <Route path="login-forgot-password" element={<LoginForgotPassword />} />
        <Route path="login-forgot-password-2" element={<LoginForgotPassword2 />} />
        <Route path="login-forgot-password-3" element={<LoginForgotPassword3 />} />
        
        <Route path="edit-vet" element={<EditVet />} />
        
        <Route path="search-test" element={<SearchTest />} />
        <Route path="search-vet" element={<SearchVet />} />

        <Route
          path="main"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
        </Route>

      </Routes>
    </Router>
  )
}

export default App
