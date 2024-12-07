import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LoginCreateAccount from './pages/LoginCreateAccount';
import LoginCheckValid from './pages/LoginCheckValid';
import LoginChoice from './pages/LoginChoice';
import LoginForgotPassword from './pages/LoginForgotPassword';
import LoginForgotPassword2 from './pages/LoginForgotPassword2';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';

import EditVet from './pages/edit/EditVet';

import SearchTest from './pages/search/SearchTest';
import SearchVet from './pages/search/SearchVet';

import EditOwner from './pages/edit/EditOwner';

import { useAuth } from './providers/AuthProvider';

function App() {
  const { isAuthenticated } = useAuth();

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
        <Route path="edit-vet" element={<EditVet />} />
        <Route path="search-vet" element={<SearchVet />} />
        
        {/* private */}
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

          {/* edits */}
          <Route path="edit-owner" element={<EditOwner />} />

          {/* search */}
          <Route path="search-test" element={<SearchTest />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App
