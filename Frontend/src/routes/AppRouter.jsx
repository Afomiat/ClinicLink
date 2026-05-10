import { Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from '../Pages/Dashboards/Docters/DarkModeContext';
import Home from '../Pages/Home/Home';
import DoctorAppRouter from './DoctorAppRouter';
import PatientAppRouter from './PatientAppRouter';

const AppRouter = () => {
  return (
    <DarkModeProvider>
      <Routes>
        {/* Public routes - Redirecting to Patient Dashboard as requested */}
        <Route path="/" element={<Navigate to="/patient" replace />} />
        <Route path="/home" element={<Home />} />
        
        {/* Doctor dashboard routes */}
        <Route path="/doctor/*" element={<DoctorAppRouter />} />
        <Route path="/patient/*" element={<PatientAppRouter />} />


        {/* Fallback/404 route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </DarkModeProvider>
  );
};

export default AppRouter;