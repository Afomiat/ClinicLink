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
    <div className="max-w-[1400px] mx-auto p-gutter space-y-md min-h-screen bg-surface">
      {/* Header & Filter Section */}
      <section className="mb-lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-md">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface mb-xs">My Care Team</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage your providers and schedule follow-ups with ease.</p>
          </div>
          <button 
            onClick={() => setActiveTab('allDoctors')}
            className="bg-primary-container text-white font-label-md py-3 px-6 rounded-full flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Find New Doctor
          </button>
        </div>

        <div className="flex border-b border-outline-variant/30 mb-md overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button 
            onClick={() => setActiveTab('myDoctors')}
            className={`px-md py-3 font-label-md transition-all relative ${
              activeTab === 'myDoctors' ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            My Doctors
            {activeTab === 'myDoctors' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('allDoctors')}
            className={`px-md py-3 font-label-md transition-all relative ${
              activeTab === 'allDoctors' ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All Doctors
            {activeTab === 'allDoctors' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"></div>}
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-md">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-lg pr-sm py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-body-sm shadow-sm"
            />
          </div>
          <div className="flex items-center gap-sm w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">filter_list</span>
              <select 
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-lg pr-sm py-3 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-body-sm shadow-sm appearance-none"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty === 'All Specialties' ? 'all' : specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-secondary rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-medium">Loading care team...</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {currentDoctors.map(doctor => (
            <div 
              key={doctor.id}
              onClick={() => {
                setSelectedDoctor(doctor);
                setShowDoctorModal(true);
              }}
              className="bg-white rounded-2xl border border-outline-variant/30 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
            >
              <div className="p-sm flex gap-sm">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 shadow-sm">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-h3 text-h3 text-on-surface group-hover:text-secondary transition-colors leading-tight">{doctor.name}</h3>
                    <p className="font-body-sm text-on-surface-variant">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-sm text-on-surface">{doctor.rating}</span>
                    <span className="text-[11px] text-on-surface-variant">({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="px-sm pb-sm border-b border-outline-variant/10">
                <div className="bg-secondary-container/10 flex items-center gap-sm px-sm py-2 rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-sm">calendar_today</span>
                  <span className="font-label-sm text-on-secondary-container truncate">
                    {doctor.upcomingAppointment ? `Next: ${doctor.upcomingAppointment}` : 'Next Available: Today 2:00 PM'}
                  </span>
                </div>
              </div>

              <div className="p-sm flex gap-sm mt-auto">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/patient/messages', { state: { doctorId: doctor.id, activeTab: 'myDoctors' } });
                  }}
                  className="flex-1 border border-outline-variant text-on-surface-variant font-label-md py-2.5 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                >
                  Message
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookAppointment(doctor);
                  }}
                  className="flex-1 bg-secondary text-white font-label-md py-2.5 rounded-xl hover:bg-opacity-90 transition-all active:scale-95 shadow-md shadow-secondary/10"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}

          {/* Empty "Add" Card */}
          <div 
            onClick={() => setActiveTab('allDoctors')}
            className="bg-slate-50/50 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-lg group cursor-pointer hover:border-secondary hover:bg-white transition-all min-h-[250px]"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-md shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all">
              <span className="material-symbols-outlined text-secondary text-3xl">person_add</span>
            </div>
            <p className="font-h3 text-h3 text-on-surface">Add Specialist</p>
            <p className="font-body-sm text-on-surface-variant text-center mt-xs">Connect with more providers.</p>
          </div>
        </section>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-8">
          <button 
            onClick={() => paginate('prev')} 
            disabled={currentPage === 1}
            className="p-2 rounded-full border border-outline-variant text-on-surface-variant disabled:opacity-30 hover:bg-white hover:text-secondary shadow-sm transition-all"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-label-md transition-all ${
                  currentPage === i + 1 ? 'bg-secondary text-white shadow-md' : 'bg-white border border-outline-variant text-on-surface-variant hover:border-secondary'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => paginate('next')} 
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border border-outline-variant text-on-surface-variant disabled:opacity-30 hover:bg-white hover:text-secondary shadow-sm transition-all"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}

      {/* Modals */}
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
        {isScheduleModalOpen && (
          <ScheduleAppointmentModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            doctor={appointmentDoctor}
            onSchedule={(appointmentData) => {
              console.log('Scheduled:', appointmentData, 'With Doctor:', appointmentDoctor);
              setIsScheduleModalOpen(false);
            }}
          />
        )}
        {isRescheduleModalOpen && (
          <RescheduleModal
            isOpen={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            appointment={appointmentToReschedule}
            onReschedule={handleReschedule}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyDoctorsPage;