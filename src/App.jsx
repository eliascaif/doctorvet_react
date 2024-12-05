import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/ProtectedRoute';
//import AuthContext from './contexts/AuthContext';

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

import { useAuth } from './contexts/AuthContext';

function App() {
  //const { isAuthenticated } = useContext(AuthContext);
  const { isAuthenticated } = useAuth();
  //console.log(useAuth());

  return (
    <Router>
      <Routes>

        {/* public */}
        <Route path="/" element={ isAuthenticated ? <Navigate to="/main" /> : <Login /> } />
        {/* <Route path="/" element={ <Login /> } /> */}
        
        <Route path="login-create-account" element={<LoginCreateAccount />} />
        <Route path="login-check-valid" element={<LoginCheckValid />} />
        <Route path="login-choice" element={<LoginChoice />} />
        <Route path="edit-owner" element={<EditOwner />} />
        <Route path="edit-vet" element={<EditVet />} />
        
        <Route path="searchtest" element={<SearchTest />} />
        <Route path="searchvet" element={<SearchVet />} />
        
        {/* <Route
        <Route path="login-forgot-password" element={<LoginForgotPassword />} />
        <Route path="login-forgot-password-2" element={<LoginForgotPassword2 />} />
        
        <Route path="edit-vet" element={<EditVet />} />
        
        <Route path="search-test" element={<SearchTest />} />
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
        </Route>

      </Routes>
    </Router>
  )
}

export default App
