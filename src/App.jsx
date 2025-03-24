import  { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/ProtectedRoute';
import AuthContext from './contexts/AuthContext';

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
import EditOwner from './pages/edit/EditOwner';
import EditOwner2 from './pages/edit/EditOwner2';
import EditPet from './pages/edit/EditPet';
import EditSell from './pages/edit/EditSell';
import EditPurchase from './pages/edit/EditPurchase';
import EditVetServiceAssoc from './pages/edit/EditVetServiceAssoc';
import EditVetSchedule from './pages/edit/EditVetSchedule';
import EditVetPoint from './pages/edit/EditVetPoint';
import EditVetDeposit from './pages/edit/EditVetDeposit';
import EditUser from './pages/edit/EditUser';

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
import SearchProvider from './pages/search/SearchProvider';
import SearchUser from './pages/search/SearchUser';
import SearchService from './pages/search/SearchService';

import { useAuth } from './providers/AuthProvider';
import ViewOwner from './pages/view/ViewOwner';

import ViewVet from './pages/view/ViewVet';
import ViewVetChange from './pages/view/ViewVetChange';
import ViewUser from './pages/view/ViewUser';
import ViewPet from './pages/view/ViewPet';
import ViewManufacturer from './pages/view/ViewManufacturer';
import ViewProduct from './pages/view/ViewProduct';
import ViewVetServicesSchedules from './pages/view/ViewVetServicesSchedules';
import ViewVetUsers from './pages/view/ViewVetUsers';
import ViewVetPoints from './pages/view/ViewVetPoints';
import ViewVetDeposits from './pages/view/ViewVetDeposits';
import { EditProductCategory } from './pages/edit/EditProductCategory';

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
        
        <Route path="edit-vet" element={<EditVet />} />
        <Route path="edit-pet" element={<EditPet />} />
        
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
          <Route path="view-owner/:id" element={<ViewOwner />} />
          <Route path="view-vet" element={<ViewVet />} />
          <Route path="edit-product-category" element={<EditProductCategory />} />

          {/* edits */}
          <Route path="edit-owner" element={<EditOwner />} />
          <Route path="edit-pet" element={<EditPet />} />
          <Route path="edit-sell" element={<EditSell />} />
          <Route path="edit-purchase" element={<EditPurchase />} />
          <Route path="edit-vet-service-assoc" element={<EditVetServiceAssoc />} />
          <Route path="edit-vet-schedule" element={<EditVetSchedule />} />
          <Route path="edit-vet-point" element={<EditVetPoint />} />
          <Route path="edit-vet-deposit" element={<EditVetDeposit />} />
          <Route path="users/:id/edit" element={<EditUser />} />

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
          <Route path="search-provider" element={<SearchProvider />} />
          <Route path="search-user" element={<SearchUser />} />
          <Route path="search-service" element={<SearchService />} />

          {/* views */}
          <Route path="view-vet" element={<ViewVet />} />
          <Route path="view-vet-change" element={<ViewVetChange />} />
          <Route path="view-vet-services-schedules" element={<ViewVetServicesSchedules />} />
          <Route path="view-vet-users" element={<ViewVetUsers />} />
          <Route path="view-vet-points" element={<ViewVetPoints />} />
          <Route path="view-vet-deposits" element={<ViewVetDeposits />} />
          <Route path="view-user" element={<ViewUser />} />
          <Route path="view-owner" element={<ViewOwner />} />
          <Route path="view-pet" element={<ViewPet />} />
          <Route path="view-manufacturer" element={<ViewManufacturer />} />
          <Route path="view-product" element={<ViewProduct />} />

          {/* debug */}
          <Route path="edit-owner2" element={<EditOwner2 />} />
          <Route path="edit-owner2" element={<EditOwner2 />} />

        </Route>

      </Routes>
    </Router>
  )
}

export default App
