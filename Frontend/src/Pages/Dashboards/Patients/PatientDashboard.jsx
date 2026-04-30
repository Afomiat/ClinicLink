import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaUserMd,
  FaCalendarAlt,
  FaCommentAlt,
  FaFileMedicalAlt,
  FaPills,
  FaVial,
  FaSearch,
  FaArrowRight,
  FaBell,
  FaPlus
} from 'react-icons/fa';
import { FiX, FiEye, FiRefreshCw } from 'react-icons/fi';

import { RiHealthBookFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { GiHealthNormal } from 'react-icons/gi';
import styles from './PatientDashboard.module.css';
import PatientDashboardModal from './PatientDashboardModal';
import RescheduleModal from './RescheduleModal';
import RefillModal from './RefillModal'
import ViewPrescriptionModal from './ViewPrescriptionModal'
import ViewTestResultModal from './ViewTestResultModal';




const PatientDashboard = () => {
  const navigate = useNavigate();

  // Sample data - replace with real API calls
  const [patientData, setPatientData] = useState({
    profile: {
      name: "Sarah Johnson",
      firstName: "Sarah",
      lastName: "Johnson",
      age: 42,
      gender: "Female",
      phone: "+1 (555) 123-4567",
      avatar: "SJ",
      lastLogin: new Date().toISOString()
    },
    stats: {
      upcomingAppointments: 2,
      activePrescriptions: 3,
      testResults: 5
    },
    appointments: [
      {
        id: 1,
        doctor: "Robert Chen",
        specialty: "Cardiology",
        date: new Date(Date.now() + 86400000 * 3).toISOString(),
        time: "10:30 AM",
        location: "Main Hospital, Room 302",
        status: "Scheduled"
      },
      {
        id: 2,
        doctor: "Lisa Wong",
        specialty: "Dermatology",
        date: new Date(Date.now() + 86400000 * 8).toISOString(),
        time: "2:15 PM",
        location: "West Clinic",
        status: "Scheduled"
      }
    ],
    prescriptions: [
      {
        id: 1,
        medication: "Atorvastatin",
        dosage: "40mg once daily",
        status: "active",
        doctor: "Robert Chen",
        date: new Date(Date.now() - 86400000 * 7).toISOString(),
        instructions: "Take with food at bedtime"
      },
      {
        id: 2,
        medication: "Lisinopril",
        dosage: "10mg once daily",
        status: "active",
        doctor: "Robert Chen",
        date: new Date(Date.now() - 86400000 * 14).toISOString(),
        instructions: "Take in the morning"
      },
      {
        id: 3,
        medication: "selemon",
        dosage: "10mg once daily",
        status: "active",
        doctor: "Robert Chen",
        date: new Date(Date.now() - 86400000 * 14).toISOString(),
        instructions: "Take in the morning"
      }
      ,
      {
        id: 4,
        medication: "selemon",
        dosage: "10mg once daily",
        status: "active",
        doctor: "Robert Chen",
        date: new Date(Date.now() - 86400000 * 14).toISOString(),
        instructions: "Take in the morning"
      }
    ],
    testResults: [
      {
        id: 1,
        testName: "Complete Blood Count",
        status: "Completed",
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        labName: "City Lab Center",
        results: "All values within normal range"
      },
      {
        id: 2,
        testName: "Lipid Panel",
        status: "Completed",
        date: new Date(Date.now() - 86400000 * 10).toISOString(),
        labName: "Main Hospital Lab",
        results: "Cholesterol slightly elevated"
      }
    ]
  });
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState(null);
const [viewingTestResult, setViewingTestResult] = useState(null);

  const formatDate = (dateStr) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };
  const getUpcomingAppointment = () => {
    const now = new Date();
    const upcoming = patientData.appointments
      .filter(app => new Date(app.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  const getFilteredPrescriptions = () => {
  // Sort by date (newest first)
  const sorted = [...patientData.prescriptions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Return either all or just the first 3
  return showAllPrescriptions ? sorted : sorted.slice(0, 3);
};

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleReschedule = (updatedAppointment) => {
  setPatientData(prev => ({
    ...prev,
    appointments: prev.appointments.map(app => 
      app.id === updatedAppointment.id ? updatedAppointment : app
    ),
    stats: {
      ...prev.stats,
      upcomingAppointments: prev.appointments.filter(a => 
        new Date(a.date) > new Date() && 
        a.status !== 'Cancelled'
      ).length
    }
  }));
};

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {patientData.profile.avatar}
          </div>
          <div>
            <h1>Welcome back, <span>{patientData.profile.firstName}</span></h1>
            <p className={styles.lastLogin}>
              Last login: {formatDate(patientData.profile.lastLogin)}
            </p>
          </div>
        </div>

      </header>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.primary}`}>
          <RiHealthBookFill className={styles.statIcon} />
          <div>
            <h3>{patientData.stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.secondary}`}>
          <FaPills className={styles.statIcon} />
          <div>
            <h3>{patientData.stats.activePrescriptions}</h3>
            <p>Active Prescriptions</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.tertiary}`}>
          <FaVial className={styles.statIcon} />
          <div>
            <h3>{patientData.stats.testResults}</h3>
            <p>Test Results</p>
          </div>
        </div>
        
        <div className={`${styles.statCard} ${styles.quaternary}`}>
          <GiHealthNormal className={styles.statIcon} />
          <div>
            <h3>Good</h3>
            <p>Health Status</p>
          </div>
        </div>
      </div>

     {/* Upcoming Appointment */}
      {getUpcomingAppointment() && (
        <section className={styles.upcomingAppointment}>
          <div className={styles.sectionHeader}>
            <h2>
              <FaCalendarAlt /> Next Appointment
            </h2>
            <button 
              className={styles.viewAll}
              onClick={() => setIsModalOpen(true)}
            >
              View All <FaArrowRight />
            </button>
          </div>
          
          <div className={styles.appointmentCard}>
            <div className={styles.appointmentContent}>
              <div className={styles.doctorInfo}>
                <div className={styles.doctorAvatar}>
                  {getUpcomingAppointment().doctor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3>Dr. {getUpcomingAppointment().doctor}</h3>
                  <p className={styles.specialty}>{getUpcomingAppointment().specialty}</p>
                </div>
              </div>
              
              <div className={styles.appointmentDetails}>
                <div className={styles.dateTime}>
                  <span className={styles.date}>
                    {formatDate(getUpcomingAppointment().date)}
                  </span>
                  <span className={styles.time}>
                    {getUpcomingAppointment().time}
                  </span>
                </div>
                <p className={styles.location}>
                  {getUpcomingAppointment().location}
                </p>
              </div>
            </div>
            
            <div className={styles.actions}>

              <button 
                className={styles.secondaryButton}
                onClick={() => {
                  const upcomingAppt = getUpcomingAppointment();
                  if (upcomingAppt) {
                    setAppointmentToReschedule(upcomingAppt);
                    setIsRescheduleModalOpen(true);
                  }
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
        </section>
      )}

{/* Prescriptions Section */}
<section className={styles.prescriptions}>
  <div className={styles.sectionHeader}>
    <h2>
      <FaPills /> My Prescriptions
    </h2>
    <div className={styles.searchWrapper}>
      {/* <FaSearch className={styles.searchIcon} /> */}
      <input
        type="text"
        placeholder="Search prescriptions..."
        className={styles.searchInput}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button 
        className={styles.addButton}
        onClick={() => setIsRefillModalOpen(true)}
      >
        <FiRefreshCw /> Request Refill
      </button>
    </div>
  </div>
  
  <div className={styles.prescriptionsGrid}>
    {patientData.prescriptions
      .filter(prescription => {
        // Return all prescriptions if search query is empty
        if (!searchQuery.trim()) return true;
        
        // Case-insensitive search on medication name and doctor
        const query = searchQuery.toLowerCase();
        return (
          prescription.medication.toLowerCase().includes(query) ||
          prescription.doctor.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date (newest first)
      .slice(0, 3) // Take only first 3
      .map(prescription => (
        <div 
          key={prescription.id} 
          className={styles.prescriptionCard}
          onClick={() => setViewingPrescription(prescription)}
        >
          <div className={styles.prescriptionHeader}>
            <h3>{prescription.medication}</h3>
            {/* <span className={`${styles.status} ${prescription.status === 'active' ? styles.active : styles.inactive}`}>
              {prescription.status}
            </span> */}
          </div>
          
          <div className={styles.prescriptionBody}>
            <p className={styles.dosage}>{prescription.dosage}</p>
            <p className={styles.doctor}>Dr. {prescription.doctor}</p>
            <p className={styles.date}>Prescribed: {formatDate(prescription.date)}</p>
          </div>
          
          <div className={styles.prescriptionFooter}>
            <button 
              className={styles.viewButton}
              onClick={(e) => {
                e.stopPropagation();
                setViewingPrescription(prescription);
              }}
            >
              View Details <FaArrowRight />
            </button>
          </div>
        </div>
      ))}
  </div>
  
  {/* View All button that links to prescriptions page */}
  {patientData.prescriptions.length > 3 && (
    <div className={styles.viewAllWrapper}>
      <Link 
        to="prescriptions"
        className={styles.viewAll}
      >
        View All <FaArrowRight />
      </Link>
    </div>
  )}
</section>

      {/* Test Results Section */}
      <section className={styles.testResults}>
        <div className={styles.sectionHeader}>
          <h2>
            <FaVial /> Test Results
          </h2>
          <div className={styles.searchWrapper}>
            {/* <FaSearch className={styles.searchIcon} /> */}
            <input
              type="text"
              placeholder="Search test results..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className={styles.resultsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.col1}>Test Name</div>
            <div className={styles.col2}>Date</div>
            <div className={styles.col3}>Status</div>
            <div className={styles.col4}>Lab</div>
            <div className={styles.col5}>Action</div>
          </div>
          
            {patientData.testResults
              .filter(test =>
                test.testName.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(test => (
                <div key={test.id} className={styles.tableRow}>
                  <div className={styles.col1}>{test.testName}</div>
                  <div className={styles.col2}>{formatDate(test.date)}</div>
                  <div className={`${styles.col3} ${styles[test.status.toLowerCase()]}`}>
                    {test.status}
                  </div>
                  <div className={styles.col4}>{test.labName}</div>
                  <div className={styles.col5}>
                  <button 
                    className={styles.viewButton}
                    onClick={() => setViewingTestResult(test)}
                  >
                    View <FaArrowRight />
                  </button>

                  </div>
                </div>
            ))}

        </div>
      </section>

{/* Quick Actions */}
<section className={styles.quickActions}>
  <h2>Quick Actions</h2>
  <div className={styles.actionsGrid}>
    {/* Find a Doctor */}
    <button 
      onClick={() => navigate('doctors', { state: { activeTab: 'allDoctors' } })}
      className={styles.actionCard}
    >
      <FaUserMd className={styles.actionIcon} />
      <span>Find a Doctor</span>
    </button>

    {/* Book Appointment */}
    <button 
      onClick={() => navigate('appointments')}
      className={styles.actionCard}
    >
      <FaCalendarAlt className={styles.actionIcon} />
      <span>Book Appointment</span>
    </button>

    {/* Message Doctor */}
    <button 
      onClick={() => navigate('messages')}
      className={styles.actionCard}
    >
      <FaCommentAlt className={styles.actionIcon} />
      <span>Message Doctor</span>
    </button>

    {/* Medical Records */}
    <button 
      onClick={() => navigate('medical-records')}
      className={styles.actionCard}
    >
      <FaFileMedicalAlt className={styles.actionIcon} />
      <span>Medical Records</span>
    </button>
  </div>
</section>

      {/* Modal */}
      <PatientDashboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={patientData.profile}
        appointments={patientData.appointments}
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
    <RescheduleModal
      isOpen={isRescheduleModalOpen}
      onClose={() => setIsRescheduleModalOpen(false)}
      appointment={appointmentToReschedule}
      onReschedule={handleReschedule}
    />
    <RefillModal
      isOpen={isRefillModalOpen}
      onClose={() => {
        setIsRefillModalOpen(false);
        setStep(1); // Reset to first step when closing
        setIsSubmitted(false); // Reset submission state
      }}
      prescriptions={patientData.prescriptions}
    />
    {viewingPrescription && (
      <ViewPrescriptionModal 
        prescription={viewingPrescription}
        onClose={() => setViewingPrescription(null)}
      />

)}
{viewingTestResult && (
  <ViewTestResultModal
    result={viewingTestResult}
    onClose={() => setViewingTestResult(null)}
    onPrint={(result) => {
      // Optional: implement print logic
      console.log('Printing result:', result);
    }}
  />
)}

          
    </div>
  );
};

export default PatientDashboard;