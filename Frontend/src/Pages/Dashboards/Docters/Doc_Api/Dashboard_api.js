import axios from 'axios';

export default {
  // Doctor endpoints
  getDoctorProfile: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/doctor.json'),

  // Patient endpoints
  getPatients: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/patients.json'),
  
  getPatientStats: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/patient-stats.json'),

  // Prescription endpoints
  getPrescriptions: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/prescriptions.json'),

  // Appointment endpoints
  getAppointments: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/appointments.json'),
  
  getTodaysAppointments: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/todays-appointments.json'),

  // Lab endpoints
  getLabResults: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/lab-results.json'),
  
  getLabTests: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/lab-tests.json'),

  // Report endpoints
  getSummaryStats: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/summary-stats.json'),
  
  getDiagnosisStats: () =>
    axios.get('https://raw.githubusercontent.com/Afomiat/mock-api/main/mock-api/diagnosis-stats.json')
};