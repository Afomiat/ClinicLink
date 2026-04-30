import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import { 
  FaUserInjured, FaPhoneAlt, FaCalendarAlt, FaVenusMars,
  FaNotesMedical, FaVenus, FaMars, FaPlus 
} from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import styles from './PatientPage.module.css';
import AddPatientModal from './AddPatientModal';
import EditPatientModal from './EditPatientModal';
import { DotsThreeVertical } from "phosphor-react";
import PatientActionModal from './PatientActionModal';
import api from './Doc_Api/Dashboard_api';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function PatientPage() {
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();
  const [showActionModal, setShowActionModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both patients and stats in parallel
        const [patientsRes, statsRes] = await Promise.all([
          api.getPatients(),
          api.getPatientStats()
        ]);

        setPatients(patientsRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Chart.js configurations with null checks
  const genderChartData = stats ? {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [stats.genderDistribution.male, stats.genderDistribution.female],
        backgroundColor: ['#4E79A7', '#F28E2B'],
        borderColor: ['#3a5f8a', '#d97d26'],
        borderWidth: 1,
        hoverOffset: 10
      }
    ]
  } : null;

  const diagnosisChartData = stats ? {
    labels: stats.diagnosisData.map(item => item.ageGroup),
    datasets: [
      {
        label: 'Diabetes',
        data: stats.diagnosisData.map(item => item.Diabetes),
        backgroundColor: '#4E79A7',
        borderRadius: 4
      },
      {
        label: 'Hypertension',
        data: stats.diagnosisData.map(item => item.Hypertension),
        backgroundColor: '#F28E2B',
        borderRadius: 4
      },
      {
        label: 'Asthma',
        data: stats.diagnosisData.map(item => item.Asthma),
        backgroundColor: '#E15759',
        borderRadius: 4
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            family: "'Segoe UI', Roboto, sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#2c3e50',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4
      }
    }
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'right'
      }
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading patient data...</p>
    </div>
  );
const handleDeletePatient = (id) => {
  setPatients((prevPatients) => prevPatients.filter((p) => p.id !== id));
};

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient); // this opens the modal
  };
// Add these handler functions inside your PatientPage component, before the return statement:

const handleAddPatient = (newPatient) => {
  setPatients((prev) => [...prev, newPatient]);
  setShowAddModal(false);
};

const handleEditPatient = (updatedPatient) => {
  setPatients((prev) =>
    prev.map((patient) =>
      patient.id === updatedPatient.id ? updatedPatient : patient
    )
  );
  setShowEditModal(false);
};



  return (
    <div className={styles.container}>
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <h1><FaUserInjured /> Patient Management</h1>
        <div className={styles.headerActions}>
          <button 
            className={styles.primaryButton}
            onClick={() => setShowAddModal(true)}
          >
            <FaPlus /> New Patient
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className={styles.analyticsDashboard}>
        {/* Patient Summary Cards */}
        {stats && (
          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}>
              <h3>Total Patients</h3>
              <p>{stats.totalPatients}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Active Patients</h3>
              <p>{stats.activePatients}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>New This Month</h3>
              <p>{stats.newThisMonth}</p>
            </div>
          </div>
        )}

        {/* Data Visualization Section */}
        <div className={styles.dataVisualization}>
          {/* Gender Distribution */}
          {genderChartData && (
            <div className={styles.chartCard}>
              <h2><FaVenusMars /> Gender Distribution</h2>
              <div className={styles.chartContainer}>
                <Pie 
                  data={genderChartData} 
                  options={pieOptions}
                />
              </div>
            </div>
          )}

          {/* Diagnosis by Age Group */}
          {diagnosisChartData && (
            <div className={styles.chartCard}>
              <h2><FaNotesMedical /> Diagnosis by Age Group</h2>
              <div className={styles.chartContainer}>
                <Bar 
                  data={diagnosisChartData} 
                  options={chartOptions}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className={styles.patientsTableContainer}>
        <div className={styles.tableHeader}>
          <h2><FaUserInjured /> Patient Records</h2>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.patientsTable}>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Last Visit</th>
                <th>Diagnosis</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className={patient.status === "Inactive" ? styles.inactiveRow : ''}>
                    <td>{patient.id}</td>
                    <td>
                      <div className={styles.patientNameCell}>
                        <span>{patient.fullName}</span>
                        {patient.phone && (
                          <span className={styles.phoneNumber}>
                            <FaPhoneAlt /> {patient.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{patient.age}</td>
                    <td>
                      <span className={`${styles.genderBadge} ${patient.gender === 'Male' ? styles.male : styles.female}`}>
                        {patient.gender === 'Male' ? <FaMars /> : <FaVenus />}
                        {patient.gender}
                      </span>
                    </td>
                    <td>
                      <div className={styles.dateCell}>
                        <FaCalendarAlt />
                        {patient.lastVisit}
                      </div>
                    </td>
                    <td>{patient.diagnosis || 'N/A'}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${patient.status === 'Active' ? styles.active : styles.inactive}`}>
                        {patient.status || 'Active'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={styles.actionMenuButton} 
                        onClick={() => {
                          setCurrentPatient(patient);
                          setShowActionModal(true);
                        }}
                        aria-label="Patient actions"
                      >
                        <DotsThreeVertical size={20} className={styles.actionDots} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className={styles.noResults}>
                    No patients found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddPatientModal 
          onClose={() => setShowAddModal(false)} 
          onAddPatient={handleAddPatient} 
        />
      )}
      
      {showEditModal && currentPatient && (
        <EditPatientModal
          patient={currentPatient}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditPatient}
        />
      )}
      
      {showActionModal && currentPatient && (
        <PatientActionModal
          patient={currentPatient}
          onClose={() => setShowActionModal(false)}
          onEdit={() => {
            setShowActionModal(false);
            setShowEditModal(true);
          }}
          onDelete={handleDeletePatient}
          // onView={handleProfileClick}
        />
      )}
    </div>
  );
}