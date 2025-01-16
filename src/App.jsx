import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import LoginCreateAccount from './pages/LoginCreateAccount';
import LoginCheckValid from './pages/LoginCheckValid';
import LoginChoice from './pages/LoginChoice';
import LoginForgotPassword from './pages/LoginForgotPassword';
import LoginForgotPassword2 from './pages/LoginForgotPassword2';

import Main from './pages/Main';
import MainHome from './pages/MainHome';
import MainPets from './pages/MainPets';
import MainOwners from './pages/MainOwners';

import EditVet from './pages/edit/EditVet';
import EditOwner from './pages/edit/EditOwner';
import EditOwner2 from './pages/edit/EditOwner2';
import EditPet from './pages/edit/EditPet';

import SearchTest from './pages/search/SearchTest';
import SearchVet from './pages/search/SearchVet';

import { useAuth } from './providers/AuthProvider';
import ViewOwner from './pages/view/ViewOwner';
import ViewVet from './pages/view/ViewVet';
import ViewUser from './pages/view/ViewUser';
import ViewPet from './pages/view/ViewPet';

function App() {
  const { isAuth } = useAuth();

  return (
    <Router>
      <Routes>

        {/* public */}
        <Route path="/" element={ isAuth ? <Navigate to="/main" /> : <Login /> } />        
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
              <Main />
            </PrivateRoute>
          }
        >
          {/* home redirect */}
          <Route index element={<Navigate to="home" replace />} />

          {/* sections */}
          <Route path="home" element={<MainHome />} />
          <Route path="pets" element={<MainPets />} />
          <Route path="owners" element={<MainOwners />} />

          {/* edits */}
          <Route path="edit-owner" element={<EditOwner />} />
          <Route path="edit-pet" element={<EditPet />} />

          {/* search */}
          <Route path="search-test" element={<SearchTest />} />

          {/* views */}
          <Route path="view-owner" element={<ViewOwner />} />
          <Route path="view-pet" element={<ViewPet />} />
          <Route path="view-vet" element={<ViewVet />} />
          <Route path="view-user" element={<ViewUser />} />

          {/* debug */}
          <Route path="edit-owner2" element={<EditOwner2 />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App
