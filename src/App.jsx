import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/ProtectedRoute';
import { useAuth } from './providers/AuthProvider';

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

//edits
import EditVet from './pages/edit/EditVet';
import EditOwner from './pages/edit/EditOwner';
import EditOwner2 from './pages/edit/EditOwner2';
import EditPet from './pages/edit/EditPet';
import EditSell_1 from './pages/edit/EditSell_1';

//search
import SearchVet from './pages/search/SearchVet';
import SearchDiagnostic from './pages/search/SearchDiagnostic';
import SearchManufacturer from './pages/search/SearchManufacturer';
import SearchOwner from './pages/search/SearchOwner';
import SearchPet from './pages/search/SearchPet';
import SearchPetCharacter from './pages/search/SearchPetPelage';
import SearchPetPelage from './pages/search/SearchPetPelage';
import SearchPetRace from './pages/search/SearchPetRace';
import SearchProduct from './pages/search/SearchProduct';
import SearchSymptom from './pages/search/SearchSymptom';
import SearchTreatment from './pages/search/SearchTreatment';

//views
import ViewOwner from './pages/view/ViewOwner';
import ViewVet from './pages/view/ViewVet';
import ViewUser from './pages/view/ViewUser';
import ViewPet from './pages/view/ViewPet';
import ViewManufacturer from './pages/view/ViewManufacturer';
import ViewProduct from './pages/view/ViewProduct';

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
          <Route path="edit-sell-1" element={<EditSell_1 />} />

          {/* search */}
          <Route path="search-diagnostic" element={<SearchDiagnostic />} />
          <Route path="search-manufacturer" element={<SearchManufacturer />} />
          <Route path="search-owner" element={<SearchOwner />} />
          <Route path="search-pet" element={<SearchPet />} />
          <Route path="search-pet-character" element={<SearchPetCharacter />} />
          <Route path="search-pet-pelage" element={<SearchPetPelage />} />
          <Route path="search-pet-race" element={<SearchPetRace />} />
          <Route path="search-product" element={<SearchProduct />} />
          <Route path="search-symptom" element={<SearchSymptom />} />
          <Route path="search-treatment" element={<SearchTreatment />} />

          {/* views */}
          <Route path="view-owner" element={<ViewOwner />} />
          <Route path="view-pet" element={<ViewPet />} />
          <Route path="view-vet" element={<ViewVet />} />
          <Route path="view-user" element={<ViewUser />} />
          <Route path="view-manufacturer" element={<ViewManufacturer />} />
          <Route path="view-product" element={<ViewProduct />} />

          {/* debug */}
          <Route path="edit-owner2" element={<EditOwner2 />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App
