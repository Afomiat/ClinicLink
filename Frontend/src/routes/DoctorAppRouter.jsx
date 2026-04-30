// src/routes/DoctorAppRouter.jsx
import { Route, Routes } from 'react-router-dom';
import Layout from '../Layout/Doctor/DoctorLayout';
import DoctorDashboard from '../Pages/Dashboards/Docters/Dashboard';
import ProfilePage from '../Pages/Dashboards/Docters/DocProfilePage';
import PatientPage from '../Pages/Dashboards/Docters/PatientPage';
import PatientProfileDoc from '../Pages/Dashboards/Docters/PatientProfileDoc';
import ReportPage from '../Pages/Dashboards/Docters/ReportPage';
import AppointmentPage from '../Pages/Dashboards/Docters/AppointmentPage';
import LabPage from '../Pages/Dashboards/Docters/LabPage';
import PrescriptionPage from '../Pages/Dashboards/Docters/PrescriptionPage';
import DoctorMessaging from '../Pages/Dashboards/Docters/DoctorMessaging';
import DoctorNotificationCenter from '../Pages/Dashboards/Docters/DoctorNotificationCenter'

const DoctorAppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="patients">
          <Route index element={<PatientPage />} />
          <Route path=":patientId" element={<PatientProfileDoc />} />
        </Route>
        <Route path="appointments" element={<AppointmentPage />} />
        <Route path="reports" element={<ReportPage />} />
        <Route path="lab" element={<LabPage />} />
        <Route path="prescriptions" element={<PrescriptionPage />} />
        <Route path="messages" element={<DoctorMessaging />} />
        <Route path="notifications" element={<DoctorNotificationCenter />} />


      </Route>
    </Routes>
  );
};

export default DoctorAppRouter;