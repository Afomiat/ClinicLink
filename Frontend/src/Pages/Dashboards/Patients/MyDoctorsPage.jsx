import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiStar, FiMessageSquare, 
  FiCalendar, FiMapPin, FiPhone, FiMail, FiUser, FiUsers,
  FiCheckCircle, FiChevronLeft, FiChevronRight, FiPlus, FiActivity, FiClock, FiVideo, FiSmile,
  FiHeart, FiZap, FiEye, FiThermometer, FiDroplet
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ScheduleAppointmentModal from './ScheduleAppointmentModal';
import DoctorDetailModal from './DoctorDetailModal';
import RescheduleModal from './RescheduleModal';

const MyDoctorsPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [appointmentDoctor, setAppointmentDoctor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('myDoctors');
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const doctorsPerPage = 6;

  const specialties = [
    { id: 'all', label: 'All Specialists', icon: <FiUsers size={18} /> },
    { id: 'Cardiology', label: 'Cardiology', icon: <FiHeart size={18} /> },
    { id: 'Dermatology', label: 'Dermatology', icon: <FiDroplet size={18} /> },
    { id: 'Pediatrics', label: 'Pediatrics', icon: <FiSmile size={18} /> },
    { id: 'Neurology', label: 'Neurology', icon: <FiZap size={18} /> },
    { id: 'Orthopedics', label: 'Orthopedics', icon: <FiActivity size={18} /> },
    { id: 'Ophthalmology', label: 'Ophthalmology', icon: <FiEye size={18} /> },
    { id: 'Endocrinology', label: 'Endocrinology', icon: <FiThermometer size={18} /> }
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setTimeout(() => {
        const mockMyDoctors = [
          {
            id: 'DOC001',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            rating: 4.8,
            reviews: 124,
            experience: '12 years',
            status: 'online',
            image: 'https://randomuser.me/api/portraits/women/65.jpg',
            upcomingAppointment: 'Aug 15, 10:30 AM',
            contact: { phone: '(555) 123-4567', email: 's.johnson@medicalcenter.com', address: '123 Medical Drive, Phoenix, AZ' }
          },
          {
            id: 'DOC002',
            name: 'Dr. Michael Chen',
            specialty: 'Dermatology',
            rating: 4.7,
            reviews: 98,
            experience: '9 years',
            status: 'busy',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            upcomingAppointment: null,
            contact: { phone: '(555) 234-5678', email: 'm.chen@clinic.org', address: '456 Health Avenue, Cleveland, OH' }
          },
          {
            id: 'DOC003',
            name: 'Dr. Emily Wong',
            specialty: 'Pediatrics',
            rating: 4.9,
            reviews: 156,
            experience: '7 years',
            status: 'online',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
            upcomingAppointment: 'Aug 22, 2:00 PM',
            contact: { phone: '(555) 345-6789', email: 'e.wong@childrens.org', address: '789 Pediatric Way, Boston, MA' }
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
            status: 'offline',
            image: 'https://randomuser.me/api/portraits/men/75.jpg',
            upcomingAppointment: null,
            contact: { phone: '(555) 456-7890', email: 'r.davis@neuro.edu', address: '101 Brain Street, New York, NY' }
          },
          {
            id: 'DOC005',
            name: 'Dr. Lisa Patel',
            specialty: 'Endocrinology',
            rating: 4.7,
            reviews: 112,
            experience: '8 years',
            status: 'online',
            image: 'https://randomuser.me/api/portraits/women/68.jpg',
            upcomingAppointment: null,
            contact: { phone: '(555) 567-8901', email: 'l.patel@endo.org', address: '202 Hormone Lane, Chicago, IL' }
          }
        ];

        setDoctors(mockMyDoctors);
        setAllDoctors(mockAllDoctors);
        setLoading(false);
      }, 800);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let results = activeTab === 'myDoctors' ? [...doctors] : [...allDoctors];
    if (searchTerm) {
      results = results.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedSpecialty !== 'all') {
      results = results.filter(doc => doc.specialty === selectedSpecialty);
    }
    setFilteredDoctors(results);
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialty, doctors, allDoctors, activeTab]);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handleBookAppointment = (doctor) => {
    setAppointmentDoctor(doctor);
    setIsScheduleModalOpen(true);
  };

  const handleReschedule = (updated) => {
    setIsRescheduleModalOpen(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-lg py-lg font-inter bg-background min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface font-manrope flex items-center gap-3">
            My Care Team
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
              {doctors.length} Active
            </span>
          </h2>
          <p className="text-body-md text-on-surface-variant mt-xs">Compassionate care from world-class medical specialists.</p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search specialists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-full text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all w-[300px] shadow-sm"
            />
          </div>
          <button 
            onClick={() => setActiveTab(activeTab === 'myDoctors' ? 'allDoctors' : 'myDoctors')}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95"
          >
            <FiPlus />
            {activeTab === 'myDoctors' ? 'Discover Doctors' : 'My Favorites'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter items-start">
        {/* Sidebar Filters */}
        <div className="col-span-12 lg:col-span-3 space-y-md sticky top-24">
          <div className="bg-white rounded-2xl p-sm border border-slate-100 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <div className="p-xs border-b border-slate-50 mb-sm flex items-center justify-between">
              <h3 className="text-sm font-black font-manrope text-slate-900 uppercase tracking-widest">Specialties</h3>
              <button 
                onClick={() => setSelectedSpecialty('all')}
                className="text-[10px] font-black text-secondary hover:underline uppercase tracking-[0.2em]"
              >
                Reset
              </button>
            </div>
            
            <div className="space-y-1">
              {specialties.map(spec => (
                <label 
                  key={spec.id} 
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition-all ${
                    selectedSpecialty === spec.id ? 'bg-primary/5 text-primary' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <input 
                    type="radio"
                    checked={selectedSpecialty === spec.id}
                    onChange={() => setSelectedSpecialty(spec.id)}
                    className="sr-only"
                  />
                  <span className={`flex items-center justify-center h-5 w-5 ${selectedSpecialty === spec.id ? 'text-primary' : 'text-slate-400'}`}>
                    {spec.icon}
                  </span>
                  <span className="text-[13px] font-bold font-manrope tracking-tight">
                    {spec.label}
                  </span>
                  {selectedSpecialty === spec.id && (
                    <motion.div layoutId="activeSpecialty" className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <FiClock />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Quick Follow-up</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                You have 2 doctors waiting for your follow-up results.
              </p>
              <button className="mt-4 text-xs font-black text-primary uppercase tracking-widest hover:underline">
                View Requests →
              </button>
            </div>
            <FiActivity className="absolute -bottom-6 -right-6 text-primary/10 text-8xl rotate-12" />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="col-span-12 lg:col-span-9">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-300">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
              <p className="text-sm font-bold uppercase tracking-widest">Finding Specialists...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {currentDoctors.map((doc) => (
                  <motion.div
                    key={doc.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col h-full"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-6 right-6">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        doc.status === 'online' ? 'bg-success/5 border-success/20 text-success' : 
                        doc.status === 'busy' ? 'bg-warning/5 border-warning/20 text-warning' : 
                        'bg-slate-50 border-slate-200 text-slate-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          doc.status === 'online' ? 'bg-success animate-pulse' : 
                          doc.status === 'busy' ? 'bg-warning' : 'bg-slate-300'
                        }`} />
                        {doc.status}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center flex-1">
                      <div className="relative mb-4">
                        <div className="h-24 w-24 rounded-3xl overflow-hidden shadow-lg border-4 border-white group-hover:scale-105 transition-transform duration-500">
                          <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-xl shadow-md flex items-center justify-center text-amber-500 border border-slate-50">
                          <FiStar size={14} fill="currentColor" />
                        </div>
                      </div>

                      <h3 className="text-[17px] font-black font-manrope text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                        {doc.specialty}
                      </p>

                      <div className="w-full flex items-center justify-center gap-6 py-4 border-y border-slate-50 mb-6">
                        <div className="text-center">
                          <p className="text-sm font-black text-slate-900">{doc.rating}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Rating</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100" />
                        <div className="text-center">
                          <p className="text-sm font-black text-slate-900">{doc.reviews}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Reviews</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-100" />
                        <div className="text-center">
                          <p className="text-sm font-black text-slate-900">{doc.experience.split(' ')[0]}y</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Exp</p>
                        </div>
                      </div>

                      {doc.upcomingAppointment && (
                        <div className="w-full bg-secondary/5 rounded-2xl p-3 mb-6 flex items-center gap-3 border border-secondary/10">
                          <div className="h-8 w-8 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                            <FiCalendar size={14} />
                          </div>
                          <div className="text-left">
                            <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Upcoming Visit</p>
                            <p className="text-[11px] font-bold text-slate-700">{doc.upcomingAppointment}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/patient/messages', { state: { doctorId: doc.id } });
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 hover:border-slate-200 transition-all active:scale-95"
                        >
                          <FiMessageSquare size={14} />
                          Chat
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookAppointment(doc);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#000000] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/20 active:scale-95"
                        >
                          <FiCalendar size={14} />
                          Book
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 text-slate-400 hover:bg-white hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all"
              >
                <FiChevronLeft />
              </button>
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-12 w-12 rounded-2xl text-xs font-black transition-all ${
                      currentPage === i + 1 ? 'bg-primary text-white shadow-xl' : 'bg-white border border-slate-100 text-slate-400 hover:border-primary/20 hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-100 text-slate-400 hover:bg-white hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all"
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDoctorModal && selectedDoctor && (
          <DoctorDetailModal
            doctor={selectedDoctor}
            onClose={() => setShowDoctorModal(false)}
            isMyDoctor={doctors.some(d => d.id === selectedDoctor.id)}
            onReschedule={() => {
              setIsRescheduleModalOpen(true);
              setShowDoctorModal(false);
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
          />
        )}
        {isRescheduleModalOpen && (
          <RescheduleModal
            isOpen={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            onReschedule={handleReschedule}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyDoctorsPage;