import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import LoginCreateAccount from './pages/LoginCreateAccount';
import LoginCheckValid from './pages/LoginCheckValid';
import LoginChoice from './pages/LoginChoice';
import EditVet from './pages/edit/EditVet';

// import PrivateRoute from './components/ProtectedRoute';
// import MainLayout from './layouts/MainLayout';
import SearchTest from './pages/search/SearchTest';
import SearchVet from './pages/search/SearchVet';
import EditOwner from './pages/edit/EditOwner';


function App() {
  return (
    <Router>
      <Routes>

        {/* public */}
        <Route path="/" element={<Login />} />
        <Route path="login-create-account" element={<LoginCreateAccount />} />
        <Route path="login-check-valid" element={<LoginCheckValid />} />
        <Route path="login-choice" element={<LoginChoice />} />
        <Route path="edit-owner" element={<EditOwner />} />
        <Route path="edit-vet" element={<EditVet />} />
        

        <Route path="searchtest" element={<SearchTest />} />
        <Route path="searchvet" element={<SearchVet />} />
        

        {/* <Route
          path="main"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="about" element={<About />} />
        </Route> */}

      </Routes>
    </Router>
  )
}

export default App
