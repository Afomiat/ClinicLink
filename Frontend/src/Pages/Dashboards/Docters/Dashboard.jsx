// src/components/Pages/Dashboards/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  FaVial,
  FaFlask,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaStethoscope,
  FaPills,
  FaCalendarAlt,
  FaUserInjured,
  FaArrowLeft,
  FaArrowRight,
  FaSearch
} from 'react-icons/fa';
import styles from './Dashboard.module.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import DashboardModal from './DashboardModal'
import { useDarkMode } from './DarkModeContext';
import AddPatientModal from './AddPatientModal';
import PrescriptionModal from './PrescriptionModal';
import LabOrderModal from './LabOrderModal';
import modalStyles from './PatientPage.module.css';
import ViewPrescriptionModal from './ViewPrescriptionModal';
import api from './Doc_Api/Dashboard_api';

const DoctorDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isLabOrderModalOpen, setIsLabOrderModalOpen] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [patientsWithAppointments, setPatientsWithAppointments] = useState([]);


  const { darkMode } = useDarkMode();
  const [doctorData, setDoctorData] = useState({
    profile: null,
    stats: null,
    appointments: [],
    prescriptions: [],
    labResults: []
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [
          doctorProfileRes,
          patientsRes,
          prescriptionsRes,
          appointmentsRes,
          labResultsRes
        ] = await Promise.all([
          api.getDoctorProfile(),
          api.getPatients(),
          api.getPrescriptions(),
          api.getAppointments(),
          api.getLabResults()
        ]);
        console.log( doctorProfileRes.data,'$$$$$$$$$$$$')
        setDoctorData({
          profile: doctorProfileRes.data,
          stats: {
            todaysAppointments: doctorProfileRes.data.metrics.todaysAppointments, // Use metrics from API
            
            totalPatients: patientsRes.data.length
          },
          appointments: appointmentsRes.data,
          prescriptions: prescriptionsRes.data,
          labResults: labResultsRes.data
        });

        setPatients(patientsRes.data);
        setPrescriptions(prescriptionsRes.data);
        setLabResults(labResultsRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const patientsThisWeek = patients.filter((patient) => {
    try {
      const visitDate = new Date(patient.lastVisit);
      if (isNaN(visitDate.getTime())) return false;

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - (today.getDay() + 6) % 7);
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return visitDate >= startOfWeek && visitDate <= endOfWeek;
    } catch (e) {
      console.error("Error parsing date for patient", patient.id, e);
      return false;
    }
  }).filter((patient) => {
    const lower = searchQuery.toLowerCase();
    return (
      patient.fullName.toLowerCase().includes(lower) ||
      (patient.phone && patient.phone.includes(lower)) ||
      (patient.diagnosis && patient.diagnosis.toLowerCase().includes(lower))
    );
  });

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientsThisWeek.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patientsThisWeek.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const displayedPrescriptions = showAll ? prescriptions : prescriptions.slice(0, 2);

  const handleSaveLabOrder = async (labOrderData) => {
    try {
      // In a real app, you would call an API endpoint to save the lab order
      // For now, we'll just update the local state
      const newLabResult = {
        id: Date.now(),
        patientName: labOrderData.patient.fullName,
        testName: labOrderData.labOrders[0].testName,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      
      setLabResults(prev => [...prev, newLabResult]);
      setIsLabOrderModalOpen(false);
    } catch (err) {
      console.error('Error saving lab order:', err);
    }
  };

  const handleSavePrescription = async (prescriptionData) => {
    try {
      // In a real app, you would call an API endpoint to save the prescription
      // For now, we'll just update the local state
      const newPrescription = {
        id: Date.now().toString(),
        patient: {
          fullName: prescriptionData.patient.fullName,
          patientId: prescriptionData.patient.id
        },
        prescriptions: prescriptionData.prescriptions,
        status: 'active',
        prescribedBy: doctorData.profile?.name || 'Dr. Unknown',
        date: new Date().toISOString().split('T')[0]
      };
      
      setPrescriptions(prev => [...prev, newPrescription]);
      setIsPrescriptionModalOpen(false);
    } catch (err) {
      console.error('Error saving prescription:', err);
    }
  };

  const handleAddPatient = (newPatient) => {
    const completePatient = {
      ...newPatient,
      id: newPatient.id || `P${Math.floor(100000 + Math.random() * 900000)}`,
      lastVisit: newPatient.lastVisit || new Date().toISOString().split('T')[0]
    };

    setPatients(prevPatients => [...prevPatients, completePatient]);
    setIsAddPatientModalOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Get the month and year for the header
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Function to get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysFromPrevMonth = firstDay;
    const prevMonthDays = new Date(year, month, 0).getDate();
    const totalDaysShown = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
    const daysFromNextMonth = totalDaysShown - (daysInMonth + daysFromPrevMonth);

    const days = [];

    for (let i = daysFromPrevMonth; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i + 1),
        currentMonth: false,
        isToday: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        currentMonth: true,
        isToday: dayDate.toDateString() === new Date().toDateString()
      });
    }

    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const weeks = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    weeks.push(daysInMonth.slice(i, i + 7));
  }

  const hasAppointment = (date) => {
    return doctorData.appointments.some(app => {
      const appDate = new Date(app.date);
      return appDate.toDateString() === date.toDateString();
    });
  };

  const formatDateDisplay = (dateStr) => {
    const today = new Date();
    const testDate = new Date(dateStr);

    if (testDate.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (testDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return testDate.toLocaleString('default', { month: 'short', day: 'numeric' });
  };
  console.log( doctorData,'second$$$$$$$$$$$$')
  const metricsData = {
    labels: ['Patient Metrics'],
    datasets: [
      {
        label: "Today's Appointments",
        data: [doctorData.profile?.metrics?.todaysAppointments || 0],
        backgroundColor: '#2A4759',
        borderColor: 'rgba(78, 115, 223, 1)',
        borderWidth: 0,
        borderRadius: {
          topLeft: 20,
          topRight: 20,
          bottomLeft: 20,
          bottomRight: 20
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: "New patients This Week",
        data: [doctorData.profile?.metrics?.newPatients || 0],        backgroundColor: 'rgba(28, 200, 138, 0.85)',
        borderColor: '#F79B72',
        borderWidth: 0,
        borderRadius: {
          topLeft: 20,
          topRight: 20,
          bottomLeft: 20,
          bottomRight: 20
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      },
      {
        label: "Total Patients",
        data: [doctorData.profile?.metrics?.totalPatients || 0],
        backgroundColor: '#B03052',
        borderColor: 'rgba(246, 194, 62, 1)',
        borderWidth: 0,
        borderRadius: {
          topLeft: 20,
          topRight: 20,
          bottomLeft: 20,
          bottomRight: 20
        },
        barPercentage: 0.6,
        categoryPercentage: 0.8
      }
    ]
  };
  
  const metricsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
      delay: (context) => {
        return context.dataIndex * 300 + context.datasetIndex * 150;
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#fff' : '#333',
          font: {
            family: "'Poppins', sans-serif",
            size: 12,
            weight: '500'
          },
          padding: 20,
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : '#fff',
        titleColor: darkMode ? '#fff' : '#333',
        bodyColor: darkMode ? '#fff' : '#333',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          drawBorder: false
        },
        ticks: {
          color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          font: {
            family: "'Poppins', sans-serif",
            size: 12
          },
          padding: 10,
          callback: (value) => {
            if (value % 1 === 0) return value;
          }
        },
        beginAtZero: true
      }
    }
  };
  console.log(doctorData,'doc')
  return (
    <>
      <div className={styles.container}>
        <div className={styles.innercontainer}>
          <div className={styles.doctorDashboardHeader}>
            <div className={styles.doctorInfo}>
              <div className={styles.clinicLogo}>
                {doctorData.profile?.clinic?.initials || 'EC'}
              </div>
              <div>
                <h2 className={styles.welcomeText}>
                  Welcome back, Dr. {doctorData.profile.doctor?.firstName} {doctorData.profile.doctor?.lastName}
                </h2>
                <p className={styles.specialization}>{doctorData.profile?.specialization}</p>
                <FaStethoscope style={{
                  marginRight: '12px',
                  transform: 'scaleX(-1)',
                  fontSize: '60px',
                  color: '#2c3e50',
                  marginLeft: '400px',
                  marginTop: '-150px'
                }} />
              </div>
            </div>

            <div className={styles.metricsContainer}>
              <div className={styles.chartContainer}>
                <Bar 
                  data={metricsData} 
                  options={metricsOptions} 
                  height={250}  // Fixed height for consistency
                />
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className={styles.recentPrescriptions}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaPills className={styles.titleIcon} /> Recent Prescriptions
              </h2>

              <div className={styles.headerActions}>
                <button 
                  className={styles.viewAllButton}
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <>
                      <FaChevronUp className={styles.collapseIcon} /> Collapse
                    </>
                  ) : (
                    <>
                      <FaChevronDown className={styles.collapseIcon} /> View All
                    </>
                  )}
                </button>
                <button 
                  className={styles.newPrescriptionButton}
                  onClick={() => setIsPrescriptionModalOpen(true)}
                >
                  <FaPlus /> New Prescription
                </button>
              </div>
            </div>

            <div className={`${styles.prescriptionsContainer} ${showAll ? styles.expanded : ''}`}>
              <div className={styles.prescriptionsGrid}>
                {displayedPrescriptions.map((prescription) => (
                  <div key={prescription.id} className={styles.prescriptionCard}>
                    <div className={styles.prescriptionHeader}>
                      <div>
                        <h3 className={styles.patientName}>{prescription.patient.fullName}</h3>
                        <p className={styles.prescriptionDate}>
                          {formatDateDisplay(prescription.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className={styles.prescriptionDetails}>
                      <div className={styles.medicationInfo}>
                        <span className={styles.medicationName}>
                          {prescription.prescriptions[0].medication}
                        </span>
                        <span className={styles.medicationDosage}>
                          {prescription.prescriptions[0].dosage}
                        </span>
                      </div>
                      {prescription.status === "active" && (
                        <span className={styles.ongoingTag}>Active</span>
                      )}
                    </div>
                    
                    <button 
                      className={styles.viewDetailsButton}
                      onClick={() => setViewingPrescription(prescription)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patients This Week Section with Pagination */}
          <div className={styles.patientSection}>
            <div className={styles.patientNameSearch}>
              <FaUserInjured className={`${styles.titleIcon} ${styles.patientTitle}`} />
              <h3 className={styles.secTitle}>Patients This Week</h3>
              <div className={styles.searchContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <table className={styles.patientTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Last Visit</th>
                  <th>Diagnosis</th>
                </tr>
              </thead>
              <tbody>
                {currentPatients.length === 0 ? (
                  <tr><td colSpan="6">No patients found this week.</td></tr>
                ) : (
                  currentPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>{patient.fullName}</td>
                      <td>{patient.age}</td>
                      <td>{patient.gender}</td>
                      <td>{formatDateDisplay(patient.lastVisit)}</td>
                      <td>{patient.diagnosis || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className={styles.pagination}>
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                <FaArrowLeft /> Previous
              </button>
              
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={styles.paginationButton}
              >
                Next <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
        
        <div className={styles.dashboardContainer}>
          {/* Calendar Section */}
          <div className={styles.calendarContainer}>
            <div className={styles.calendarHeader}>
              <div className={styles.headerControls}>
                <button onClick={handlePrevMonth} className={styles.navButton}>&lt;</button>
                <h2 className={styles.monthYear}>{month}, {year}</h2>
                <button onClick={handleNextMonth} className={styles.navButton}>&gt;</button>
              </div>
            </div>

            
            <div className={styles.weekdaysHeader}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className={styles.weekday}>{day}</div>
              ))}
            </div>
            
            <div className={styles.daysGrid}>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className={styles.weekRow}>
                  {week.map((day, dayIndex) => {
                    const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
                    const hasAppt = hasAppointment(day.date);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`${styles.day} 
                          ${day.currentMonth ? '' : styles.otherMonth} 
                          ${day.isToday ? styles.today : ''} 
                          ${isSelected ? styles.selected : ''}
                          ${hasAppt ? styles.hasAppointment : ''}`}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <div className={styles.dayNumber}>{day.date.getDate()}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className={styles.viewAppointmentsBtn}
            onClick={() => setIsAppointmentsModalOpen(true)}
          >
            <FaCalendarAlt /> View Appointments
          </button>

          <DashboardModal
            isOpen={isAppointmentsModalOpen}
            onClose={() => setIsAppointmentsModalOpen(false)}
            appointments={doctorData.appointments}
            daysInMonth={daysInMonth}
            year={year}
          />
          
          {/* Lab Results Section */}
          <div className={styles.labResultsContainer}>
            <div className={styles.labiconName} style={{ display: 'flex', alignItems: 'center' }}>
              <FaVial style={{ marginRight: '8px' }} className={styles.labicon}/>
              <strong>Lab Results</strong>
            </div>
            
            <div className={styles.resultsList}>
              {labResults.map((result) => (
                <div key={result.id} className={styles.resultItem}>
                  <div className={styles.resultContent}>
                    <div className={styles.iconBorder}>
                      <FaFlask className={styles.testIcon} />
                    </div>
                    <div className={styles.patientDetails}>
                      <div className={styles.patientName}>{result.patientName}</div>
                      <div className={styles.testName}>{result.testName}</div>
                    </div>
                  </div>
                  <div className={styles.timeTag}>
                    {formatDateDisplay(result.date)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.quickActions}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionButtons}>
              <button 
                className={`${styles.actionButton} ${styles.actionNew}`}
                onClick={() => setIsAddPatientModalOpen(true)}
              >
                <span className={styles.buttonContent}>
                  <span className={styles.buttonIcon}>+ New Patient</span> 
                </span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => setIsPrescriptionModalOpen(true)}
              >
                <span className={styles.buttonContent}>
                  <FaPills className={styles.buttonIcon} /> Prescription
                </span>
              </button>
              
              <button 
                className={styles.actionButton}
                onClick={() => setIsLabOrderModalOpen(true)}
              >
                <span className={styles.buttonContent}>
                  <FaVial className={styles.buttonIcon} /> Lab Order
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DashboardModal
        isOpen={isAppointmentsModalOpen}
        onClose={() => setIsAppointmentsModalOpen(false)}
        appointments={[...doctorData.appointments, ...schedules]}
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      
      {isAddPatientModalOpen && (
        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          onAddPatient={handleAddPatient}
          styles={modalStyles}
        />
      )}
      
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        onSave={handleSavePrescription}
      />
      
      <LabOrderModal
        isOpen={isLabOrderModalOpen}
        onClose={() => setIsLabOrderModalOpen(false)}
        onSave={handleSaveLabOrder}
      />
      
      {viewingPrescription && (
        <ViewPrescriptionModal
          prescription={viewingPrescription}
          onClose={() => setViewingPrescription(null)}
        />
      )}
    </>
  );
};

export default DoctorDashboard;