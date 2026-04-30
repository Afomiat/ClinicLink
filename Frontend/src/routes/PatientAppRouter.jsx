import { Routes, Route } from 'react-router-dom';
// import { DarkModeProvider } from '../context/PatientDarkModeContext';
import PatientLayout from '../Layout/Patient/PatientLayout';
import PatientDashboard from '../Pages/Dashboards/Patients/PatientDashboard';
import PatientTestResults from '../Pages/Dashboards/Patients/PatientTestResults';
import PatientAppointmentsPage from '../Pages/Dashboards/Patients/PatientAppointmentPage';
import MyDoctorsPage from '../Pages/Dashboards/Patients/MyDoctorsPage';
import PatientPrescriptionsPage from '../Pages/Dashboards/Patients/PatientPrescriptionsPage';
import PaymentIntegration from '../Pages/Dashboards/Patients/PaymentPage';
import PatientProfile from '../Pages/Dashboards/Patients/PatientProfile';
import NotificationCenter from '../Pages/Dashboards/Patients/NotificationCenter'
import MedicalRecords from '../Pages/Dashboards/Patients/MedicalRecords';
import DoctorMessaging from '../Pages/Dashboards/Patients/MessagePage'
const PatientAppRouter = () => {
  return (
      <Routes>
 
        <Route path="/" element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="test-results" element={<PatientTestResults />} />
            <Route path="appointments" element={<PatientAppointmentsPage />} />
            <Route path="doctors" element={<MyDoctorsPage />} />
            <Route path="prescriptions" element={<PatientPrescriptionsPage />} />
            <Route path="payment" element={<PaymentIntegration />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="notifications" element={<NotificationCenter />} />
            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="messages" element={<DoctorMessaging />} />











        </Route>

 
      </Routes>
  );
};

export default PatientAppRouter;