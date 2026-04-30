import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { 
  FiSearch, FiFilter, FiStar, FiMessageSquare, 
  FiCalendar, FiMapPin, FiPhone, FiMail, FiUser,
  FiCheckCircle, FiChevronLeft, FiChevronRight, FiPlus
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MyDoctorsPage.module.css';
import ScheduleAppointmentModal from './ScheduleAppointmentModal';
import DoctorDetailModal from './DoctorDetailModal';
import RescheduleModal from './RescheduleModal';
import { useNavigate } from 'react-router-dom';


const MyDoctorsPage = () => {
  
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [appointmentDoctor, setAppointmentDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

const location = useLocation();
const [activeTab, setActiveTab] = useState(
  location.state?.activeTab || 'myDoctors'  // Use state if provided, otherwise default
);  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
   const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);

  const doctorsPerPage = 3;
useEffect(() => {
  if (location.state?.activeTab) {
    window.history.replaceState({}, '');
  }
}, [location.state]);
  useEffect(() => {
    // Simulate API call to fetch doctors
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          const mockMyDoctors = [
            {
              id: 'DOC001',
              name: 'Dr. Sarah Johnson',
              specialty: 'Cardiology',
              rating: 4.8,
              reviews: 124,
              experience: '12 years',
              image: 'https://randomuser.me/api/portraits/women/65.jpg',
              upcomingAppointment: '2023-08-15 at 10:30 AM',
              contact: {
                phone: '(555) 123-4567',
                email: 's.johnson@medicalcenter.com',
                address: '123 Medical Drive, Phoenix, AZ 85054'
              },
              about: 'Board-certified cardiologist with extensive experience in preventive cardiology and heart failure management. Special interest in women\'s cardiovascular health.',
              education: [
                'MD, Harvard Medical School',
                'Residency, Massachusetts General Hospital',
                'Fellowship, Johns Hopkins Hospital'
              ]
            },
            {
              id: 'DOC002',
              name: 'Dr. Michael Chen',
              specialty: 'Dermatology',
              rating: 4.7,
              reviews: 98,
              experience: '9 years',
              image: 'https://randomuser.me/api/portraits/men/32.jpg',
              upcomingAppointment: null,
              contact: {
                phone: '(555) 234-5678',
                email: 'm.chen@clevelandclinic.org',
                address: '456 Health Avenue, Cleveland, OH 44195'
              },
              about: 'Dermatologist specializing in medical and cosmetic dermatology. Expertise in skin cancer detection and treatment, acne, and psoriasis management.',
              education: [
                'MD, Stanford University School of Medicine',
                'Residency, UCSF Medical Center',
                'Fellowship, NYU Langone Health'
              ]
            },
            {
              id: 'DOC003',
              name: 'Dr. Emily Wong',
              specialty: 'Pediatrics',
              rating: 4.9,
              reviews: 156,
              experience: '7 years',
              image: 'https://randomuser.me/api/portraits/women/44.jpg',
              upcomingAppointment: '2023-08-22 at 2:00 PM',
              contact: {
                phone: '(555) 345-6789',
                email: 'e.wong@childrenshospital.org',
                address: '789 Pediatric Way, Boston, MA 02115'
              },
              about: 'Pediatrician dedicated to providing compassionate care for children from birth through adolescence. Special focus on childhood nutrition and development.',
              education: [
                'MD, University of Pennsylvania',
                'Residency, Children\'s Hospital of Philadelphia',
                'Fellowship, Boston Children\'s Hospital'
              ]
            }
          ];

          const mockAllDoctors = [
            ...mockMyDoctors,
            {
              id: 'DOC004',
              name: 'Dr. Robert Davis',
              specialty: 'Neurology',
              rating: 4.6,
              reviews: 87,
              experience: '11 years',
              image: 'https://randomuser.me/api/portraits/men/75.jpg',
              upcomingAppointment: null,
              contact: {
                phone: '(555) 456-7890',
                email: 'r.davis@neurocenter.edu',
                address: '101 Brain Street, New York, NY 10016'
              },
              about: 'Neurologist with expertise in movement disorders and neurodegenerative diseases. Specializes in Parkinson\'s disease and multiple sclerosis treatment.',
              education: [
                'MD, Columbia University',
                'Residency, Mayo Clinic',
                'Fellowship, Massachusetts General Hospital'
              ]
            },
            {
              id: 'DOC005',
              name: 'Dr. Lisa Patel',
              specialty: 'Endocrinology',
              rating: 4.7,
              reviews: 112,
              experience: '8 years',
              image: 'https://randomuser.me/api/portraits/women/68.jpg',
              upcomingAppointment: null,
              contact: {
                phone: '(555) 567-8901',
                email: 'l.patel@diabetescenter.org',
                address: '202 Hormone Lane, Chicago, IL 60611'
              },
              about: 'Endocrinologist specializing in diabetes management and thyroid disorders. Passionate about patient education and preventive care.',
              education: [
                'MD, Johns Hopkins University',
                'Residency, Cleveland Clinic',
                'Fellowship, Stanford Hospital'
              ]
            },
            {
              id: 'DOC006',
              name: 'Dr. James Wilson',
              specialty: 'Orthopedics',
              rating: 4.8,
              reviews: 134,
              experience: '15 years',
              image: 'https://randomuser.me/api/portraits/men/82.jpg',
              upcomingAppointment: null,
              contact: {
                phone: '(555) 678-9012',
                email: 'j.wilson@orthoclinic.com',
                address: '303 Joint Avenue, Houston, TX 77030'
              },
              about: 'Orthopedic surgeon specializing in sports medicine and joint replacement. Team physician for several professional sports teams.',
              education: [
                'MD, Duke University',
                'Residency, Hospital for Special Surgery',
                'Fellowship, Steadman Clinic'
              ]
            },
            {
              id: 'DOC007',
              name: 'Dr. Angela Martinez',
              specialty: 'Ophthalmology',
              rating: 4.7,
              reviews: 105,
              experience: '10 years',
              image: 'https://randomuser.me/api/portraits/women/72.jpg',
              upcomingAppointment: null,
              contact: {
                phone: '(555) 789-0123',
                email: 'a.martinez@eyecare.org',
                address: '404 Vision Blvd, Miami, FL 33101'
              },
              about: 'Ophthalmologist specializing in cataract surgery and refractive procedures. Expert in treating glaucoma and retinal diseases.',
              education: [
                'MD, University of Miami',
                'Residency, Bascom Palmer Eye Institute',
                'Fellowship, Wills Eye Hospital'
              ]
            }
          ];

          setDoctors(mockMyDoctors);
          setAllDoctors(mockAllDoctors);
          setFilteredDoctors(mockMyDoctors);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let results = activeTab === 'myDoctors' ? [...doctors] : [...allDoctors];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(doc => 
        doc.name.toLowerCase().includes(term) || 
        doc.specialty.toLowerCase().includes(term)
      );
    }
    
    // Filter by specialty
    if (selectedSpecialty !== 'all') {
      results = results.filter(doc => doc.specialty === selectedSpecialty);
    }
    
    setFilteredDoctors(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedSpecialty, doctors, allDoctors, activeTab]);

  // Get current doctors for pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Neurology',
    'Orthopedics',
    'Ophthalmology',
    'Endocrinology'
  ];
const handleReschedule = (updatedAppointment) => {
  // Update the doctor's upcoming appointment
  setDoctors(doctors.map(doctor => {
    if (doctor.id === selectedDoctor.id) {
      return {
        ...doctor,
        upcomingAppointment: `${updatedAppointment.date} at ${updatedAppointment.time}`
      };
    }
    return doctor;
  }));
  
  // Also update in allDoctors if needed
  setAllDoctors(allDoctors.map(doctor => {
    if (doctor.id === selectedDoctor.id) {
      return {
        ...doctor,
        upcomingAppointment: `${updatedAppointment.date} at ${updatedAppointment.time}`
      };
    }
    return doctor;
  }));

  setIsRescheduleModalOpen(false);
  // You might want to show a success notification here
};

  const handleBookAppointment = (doctor) => {
    setAppointmentDoctor(doctor);
    setIsScheduleModalOpen(true);
  };

  const paginate = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleAddDoctor = (doctor) => {
    // In a real app, this would call an API to add the doctor to the user's list
    if (!doctors.some(d => d.id === doctor.id)) {
      setDoctors([...doctors, doctor]);
      // Show a success message or notification
    }
  };

  return (
    <div className={styles.myDoctorsPage}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>
            <FiUser className={styles.headerIcon} />
            Doctors
          </h1>
          <p className={styles.subtitle}>Manage and connect with healthcare providers</p>
        </div>
      </header>

      <div className={styles.doctorsTabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'myDoctors' ? styles.active : ''}`}
          onClick={() => setActiveTab('myDoctors')}
        >
          <FiUser /> My Doctors
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'allDoctors' ? styles.active : ''}`}
          onClick={() => setActiveTab('allDoctors')}
        >
          <FiSearch /> Find Doctors
        </button>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchFilter}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'myDoctors' ? 'my doctors' : 'all doctors'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterDropdown}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map(specialty => (
                <option 
                  key={specialty} 
                  value={specialty === 'All Specialties' ? 'all' : specialty}
                >
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading doctors...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <>
          <div className={styles.doctorsGrid}>
            {currentDoctors.map(doctor => (
              <motion.div 
                key={doctor.id}
                className={styles.doctorCard}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setShowDoctorModal(true);
                }}
              >
                <div className={styles.doctorImageContainer}>
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className={styles.doctorImage}
                  />
                  {/* {activeTab === 'allDoctors' && !doctors.some(d => d.id === doctor.id) && (
                    <button 
                      className={styles.addButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddDoctor(doctor);
                      }}
                    >
                      <FiPlus /> Add to My Doctors
                    </button>
                  )} */}
                </div>
                
                <div className={styles.doctorInfo}>
                  <h3>{doctor.name}</h3>
                  
                  <div className={styles.rating}>
                    <p className={styles.specialty}>{doctor.specialty}</p>
                    <FiStar className={styles.starIcon} />
                    <span>{doctor.rating}</span>
                    <span className={styles.reviews}>({doctor.reviews} reviews)</span>
                  </div>
                  
                  <div className={styles.experience}>
                    <span>{doctor.experience} experience</span>
                  </div>
                  
                  {doctor.upcomingAppointment && (
                    <div className={styles.upcomingAppointment}>
                      <FiCalendar className={styles.icon} />
                      <span>Next: {doctor.upcomingAppointment}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.cardFooter}>
                  <button 
                    className={styles.messageButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/patient/messages', { 
                        state: { 
                          doctorId: doctor.id,
                          activeTab: 'myDoctors' 
                        } 
                      });
                    }}
                  >
                    <FiMessageSquare /> Message
                  </button>
                  <button
                    className={styles.bookButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookAppointment(doctor);
                    }}
                  >
                    <FiCalendar /> Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDoctors.length > doctorsPerPage && (
            <div className={styles.paginationContainer}>
              <div className={styles.pagination}>
                <button 
                  onClick={() => paginate('prev')} 
                  disabled={currentPage === 1}
                  className={`${styles.paginationButton} ${styles.paginationButtonPremium}`}
                  aria-label="Previous page"
                >
                  <FiChevronLeft className={styles.paginationIcon} />
                </button>
                
                <span className={styles.pageNumberPremium}>
                  {currentPage}<span className={styles.totalPages}> / {totalPages}</span>
                </span>
                
                <button 
                  onClick={() => paginate('next')} 
                  disabled={currentPage === totalPages}
                  className={`${styles.paginationButton} ${styles.paginationButtonPremium}`}
                  aria-label="Next page"
                >
                  <FiChevronRight className={styles.paginationIcon} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={styles.noResults}>
          <h3>No doctors found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      <AnimatePresence>
        {showDoctorModal && selectedDoctor && (
           <DoctorDetailModal
              doctor={selectedDoctor}
              onClose={() => setShowDoctorModal(false)}
              isMyDoctor={doctors.some(d => d.id === selectedDoctor.id)}
              onAddDoctor={handleAddDoctor}
              onReschedule={() => {
                const [date, time] = selectedDoctor.upcomingAppointment.split(' at ');
                setAppointmentToReschedule({
                  doctor: selectedDoctor.name,
                  specialty: selectedDoctor.specialty,
                  date: date,
                  time: time,
                  location: selectedDoctor.contact.address
                });
                setShowDoctorModal(false);
                setIsRescheduleModalOpen(true);
              }}
              onBookAppointment={(doctor) => {
                setAppointmentDoctor(doctor);
                setShowDoctorModal(false);
                setIsScheduleModalOpen(true);
              }}
            />
                    )}
        <ScheduleAppointmentModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          doctor={appointmentDoctor}
          onSchedule={(appointmentData) => {
            console.log('Scheduled:', appointmentData, 'With Doctor:', appointmentDoctor);
            setIsScheduleModalOpen(false);
          }}
        />
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          appointment={appointmentToReschedule}
          onReschedule={handleReschedule}
        />


      </AnimatePresence>
    </div>
  );
};


export default MyDoctorsPage;