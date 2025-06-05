import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppointmentWrapper from './pages/AppointmentWrapper';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import AssesmentPage from './pages/AssessmentPage';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/appointment" element={<AppointmentWrapper />} />
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/riskAssessment" element={<AssesmentPage/>} />
        
        {/* Protected Route */}
        <Route path="//home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
