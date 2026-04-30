import React, { useEffect, useState } from 'react';
import styles from './PatientProfileDoc.module.css';
import { MdChat, MdPhone, MdArrowBack, MdArrowForward } from 'react-icons/md';
import { HiPaperClip, HiDocumentText } from "react-icons/hi";
import { FaPills, FaFlask, FaNotesMedical, FaUserInjured, FaWeight, FaRulerVertical } from 'react-icons/fa';
import { GiBlood } from 'react-icons/gi';
import { IoMdAlert } from 'react-icons/io';

import AddPrescriptionModal from './AddPrescriptionModal';

function PatientProfileDoc() {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [photoURL, setPhotoURL] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  const [testReports, setTestReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    const fetchDemoPhoto = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const fetchedPhoto = data.results[0].picture.large;
        setPhotoURL(fetchedPhoto);
      } catch (error) {
        console.error('Error fetching demo photo:', error);
        setPhotoURL('https://i.imgur.com/3ZQZ3Zm.png'); // Professional placeholder
      }
    };

    fetchDemoPhoto();
  }, []);

  useEffect(() => {
    const fetchTestReports = async () => {
      setLoadingReports(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockResponse = [
          { id: 1, name: 'Complete Blood Count', date: '2025-04-15', type: 'Hematology' },
          { id: 2, name: 'Lipid Panel', date: '2025-04-10', type: 'Chemistry' },
          { id: 3, name: 'HbA1c Test', date: '2025-04-05', type: 'Diabetes' },
          { id: 4, name: 'Thyroid Function Test', date: '2025-03-28', type: 'Endocrine' },
          { id: 5, name: 'Liver Function Test', date: '2025-03-20', type: 'Chemistry' }
        ];
        
        setTestReports(mockResponse);
      } catch (error) {
        console.error('Error fetching test reports:', error);
      } finally {
        setLoadingReports(false);
      }
    };
  
    fetchTestReports();
  }, []);

  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = [
        {
          id: 1,
          description: 'Metformin',
          dosage: '500mg',
          date: '2025-04-10',
          duration: '30 days',
          instructions: 'Twice daily with meals'
        },
        {
          id: 2,
          description: 'Lisinopril',
          dosage: '10mg',
          date: '2025-04-10',
          duration: '30 days',
          instructions: 'Once daily in the morning'
        },
        {
          id: 3,
          description: 'Atorvastatin',
          dosage: '20mg',
          date: '2025-04-10',
          duration: '30 days',
          instructions: 'At bedtime'
        }
      ];

      setPrescriptions(response);
    };

    fetchPrescriptions();
  }, []);

  const handleAddPrescription = (newPrescription) => {
    setPrescriptions(prev => [...prev, { ...newPrescription, id: Date.now() }]);
  };

  const [patientData] = useState({
    name: 'Martha Smith',
    age: '66',
    gender: 'Female',
    bloodType: 'A+',
    allergies: 'Penicillin, Peanuts',
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Hyperlipidemia'],
    weight: '82 kg',
    height: '175 cm',
    bmi: '26.8',
    patientID: 'PAT-789456',
    lastVisit: '2025-04-10',
    nextAppointment: '2025-05-15',
    emergencyContact: '+1 310-555-7890 (John Smith)',
    address: '7246 Woodland Rd, Waukesha, WI 53186',
    phone: '+1 310-351-7774',
    email: 'martha.smith@example.com',
    insurance: 'Medicare Part B',
    pcp: 'Dr. James Wilson',
    appointments: [
      { date: '2025-05-15', reason: 'Diabetes Follow-up', time: '10:30 AM' },
      { date: '2025-06-20', reason: 'Annual Physical', time: '2:15 PM' },
      { date: '2025-07-10', reason: 'Lab Results Review', time: '9:00 AM' },
      { date: '2025-08-05', reason: 'Medication Review', time: '11:45 AM' },
      { date: '2025-09-12', reason: 'Cardiology Referral', time: '3:30 PM' },
    ]
  });

  const formatDay = (date) => {
    const day = date.getDate();
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
  
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  
    return (
      <div className={`${styles.dateBox} ${isToday ? styles.today : ''}`}>
        <div className={styles.weekday}>{weekday}</div>
        <div className={styles.day}>{day}</div>
      </div>
    );
  };
  
  const visibleAppointments = patientData.appointments.slice(scrollIndex, scrollIndex + 3);

  const scrollLeft = () => setScrollIndex(prev => Math.max(0, prev - 1));
  const scrollRight = () => setScrollIndex(prev => Math.min(patientData.appointments.length - 3, prev + 1));

  return (
    <div className={styles.profileContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.patientHeader}>
          <div className={styles.patientImageContainer}>
            <img src={photoURL} alt="Patient" className={styles.patientImage} />
            <div className={styles.patientStatus}>
              <span className={styles.statusIndicator}></span>
              <span>Active Patient</span>
            </div>
          </div>
          <div className={styles.patientMainInfo}>
            <h1>{patientData.name}</h1>
            <div className={styles.patientMeta}>
              <span><FaUserInjured /> {patientData.age} years • {patientData.gender}</span>
              <span><GiBlood /> {patientData.bloodType}</span>
              <span className={styles.patientId}>ID: {patientData.patientID}</span>
            </div>
            <div className={styles.patientContacts}>
              <div>
                <MdPhone className={styles.contactIcon} />
                {patientData.phone}
              </div>
              <button className={styles.chatButton}>
                <MdChat /> Message Patient
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Medical Overview */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaNotesMedical className={styles.cardIcon} />
              <h2>Medical Overview</h2>
            </div>
            <div className={styles.medicalGrid}>
              <div className={styles.medicalItem}>
                <div className={styles.medicalLabel}>Conditions</div>
                <div className={styles.medicalValue}>
                  {patientData.conditions.map((condition, index) => (
                    <span key={index} className={styles.conditionTag}>{condition}</span>
                  ))}
                </div>
              </div>
              <div className={styles.medicalItem}>
                <div className={styles.medicalLabel}>Allergies</div>
                <div className={styles.medicalValue}>
                  <span className={styles.allergyTag}><IoMdAlert /> {patientData.allergies}</span>
                </div>
              </div>
              <div className={styles.medicalItem}>
                <div className={styles.medicalLabel}>Vitals</div>
                <div className={styles.medicalValue}>
                  <span><FaWeight /> {patientData.weight}</span>
                  <span><FaRulerVertical /> {patientData.height}</span>
                  <span>BMI: {patientData.bmi}</span>
                </div>
              </div>
              <div className={styles.medicalItem}>
                <div className={styles.medicalLabel}>Last Visit</div>
                <div className={styles.medicalValue}>{patientData.lastVisit}</div>
              </div>
              <div className={styles.medicalItem}>
                <div className={styles.medicalLabel}>Next Appointment</div>
                <div className={styles.medicalValue}>{patientData.nextAppointment}</div>
              </div>
              <div className={styles.medicalItem}>
                <div className={styles.medicalLabel}>Primary Care Physician</div>
                <div className={styles.medicalValue}>{patientData.pcp}</div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaFlask className={styles.cardIcon} />
              <h2>Test Results</h2>
              <button className={styles.viewAllButton}>View All</button>
            </div>
            {loadingReports ? (
              <div className={styles.loading}>Loading reports...</div>
            ) : (
              <div className={styles.testResults}>
                {testReports.map((report) => (
                  <div key={report.id} className={styles.testResultItem}>
                    <div className={styles.testIcon}>
                      <HiDocumentText />
                    </div>
                    <div className={styles.testInfo}>
                      <div className={styles.testName}>{report.name}</div>
                      <div className={styles.testMeta}>
                        <span className={styles.testType}>{report.type}</span>
                        <span className={styles.testDate}>{report.date}</span>
                      </div>
                    </div>
                    <button className={styles.viewButton}>View</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Upcoming Appointments */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Upcoming Appointments</h2>
              <div className={styles.scrollControls}>
                <button onClick={scrollLeft} disabled={scrollIndex === 0}>
                  <MdArrowBack />
                </button>
                <button onClick={scrollRight} disabled={scrollIndex >= patientData.appointments.length - 3}>
                  <MdArrowForward />
                </button>
              </div>
            </div>
            <div className={styles.appointments}>
              {visibleAppointments.map((appointment, index) => {
                const date = new Date(appointment.date);
                return (
                  <div key={index} className={styles.appointment}>
                    {formatDay(date)}
                    <div className={styles.appointmentInfo}>
                      <div className={styles.appointmentTime}>{appointment.time}</div>
                      <div className={styles.appointmentReason}>{appointment.reason}</div>
                    </div>
                    <button className={styles.appointmentAction}>Details</button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prescriptions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaPills className={styles.cardIcon} />
              <h2>Active Prescriptions</h2>
              <button 
                className={styles.addButton}
                onClick={() => setShowPrescriptionModal(true)}
              >
                + Add New
              </button>
            </div>
            <div className={styles.prescriptions}>
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className={styles.prescriptionItem}>
                  <div className={styles.prescriptionMain}>
                    <div className={styles.prescriptionName}>{prescription.description}</div>
                    <div className={styles.prescriptionDosage}>{prescription.dosage}</div>
                  </div>
                  <div className={styles.prescriptionDetails}>
                    <div>
                      <span className={styles.detailLabel}>Started:</span> 
                      <span>{prescription.date}</span>
                    </div>
                    <div>
                      <span className={styles.detailLabel}>Duration:</span> 
                      <span>{prescription.duration}</span>
                    </div>
                    <div>
                      <span className={styles.detailLabel}>Instructions:</span> 
                      <span>{prescription.instructions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPrescriptionModal && (
        <AddPrescriptionModal
          onClose={() => setShowPrescriptionModal(false)}
          onAddPrescription={handleAddPrescription}
        />
      )}
    </div>
  );
}

export default PatientProfileDoc;