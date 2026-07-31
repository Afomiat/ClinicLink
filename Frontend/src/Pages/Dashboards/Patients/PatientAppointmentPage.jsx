import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { exportToPDF } from '../../../utils/exportUtils';
import { 
  FiCalendar, FiClock, FiSearch, FiFilter, FiX, FiPlus, 
  FiChevronLeft, FiChevronRight, FiUser, FiAlertCircle, 
  FiCheckCircle, FiLoader, FiXCircle, FiActivity, FiDownload
} from 'react-icons/fi';
import { ChevronDown, ChevronUp } from 'react-feather';
import { motion, AnimatePresence } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './PatientAppointments.module.css';
import AppointmentActionModal from './AppointmentActionModal';
import ScheduleAppointmentModal from './ScheduleAppointmentModal';
import AppointmentViewModal from './AppointmentViewModal';
import RescheduleModal from './RescheduleModal';
import { ContactSupportModal } from './SharedModals';

const PatientAppointmentsPage = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentView, setCurrentView] = useState(location.state?.view || 'list');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentActionAppointment, setCurrentActionAppointment] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [calCurrentMonth, setCalCurrentMonth] = useState(new Date());
  const [selectedCalDate, setSelectedCalDate] = useState(new Date());

  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchQuery: '',
    appointmentType: 'all'
  });

  const [newAppointment, setNewAppointment] = useState({
    title: '',
    date: '',
    time: '',
    doctor: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    if (location.state?.view) {
      setCurrentView(location.state.view);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const getFutureDate = (daysAhead) => {
          const d = new Date();
          d.setDate(d.getDate() + daysAhead);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        setTimeout(() => {
          const mockAppointments = [
            {
              id: 'APT-NOW-1',
              title: 'General Health Checkup',
              date: getFutureDate(0),
              time: '10:00 AM',
              doctor: 'Dr. Sarah Mitchell',
              status: 'confirmed',
              type: 'General Practice',
              notes: 'Quarterly review of overall health and wellness.',
              color: '#dcfce7'
            },
            {
              id: 'APT-NOW-2',
              title: 'Dental Cleaning',
              date: getFutureDate(1),
              time: '02:30 PM',
              doctor: 'Dr. Emily Chen',
              status: 'pending',
              type: 'Dentistry',
              notes: 'Routine cleaning and fluoride treatment.',
              color: '#fef3c7'
            },
            {
              id: 'APT-MAY-3',
              title: 'Dermatology Exam',
              date: getFutureDate(3),
              time: '11:00 AM',
              doctor: 'Dr. Alan Vance',
              status: 'confirmed',
              type: 'Dermatology',
              notes: 'Skin mole evaluation.',
              color: '#dcfce7'
            },
            {
              id: 'APT-MAY-4',
              title: 'Physical Therapy',
              date: getFutureDate(6),
              time: '03:45 PM',
              doctor: 'Dr. Robert Blake',
              status: 'confirmed',
              type: 'Therapy',
              notes: 'Post-injury knee rehabilitation.',
              color: '#dcfce7'
            },
            {
              id: 'APT-MAY-5',
              title: 'Eye Examination',
              date: getFutureDate(9),
              time: '01:00 PM',
              doctor: 'Dr. Lisa Wong',
              status: 'confirmed',
              type: 'Ophthalmology',
              notes: 'Prescription update for glasses.',
              color: '#dcfce7'
            },
            {
              id: 'APT001',
              title: 'Cardiology Follow-up',
              date: getFutureDate(12),
              time: '09:30 AM',
              doctor: 'Dr. Sarah Mitchell',
              status: 'confirmed',
              type: 'Cardiology Specialist',
              notes: 'Regular heart rhythm checkup',
              color: '#dcfce7'
            },
            {
              id: 'APT-MAY-6',
              title: 'Dietary Consultation',
              date: getFutureDate(17),
              time: '10:30 AM',
              doctor: 'Dr. Maria Garcia',
              status: 'pending',
              type: 'Nutrition',
              notes: 'Weight management plan.',
              color: '#fef3c7'
            },
            {
              id: 'APT-MAY-7',
              title: 'Psychiatry Session',
              date: getFutureDate(19),
              time: '04:00 PM',
              doctor: 'Dr. David Foster',
              status: 'confirmed',
              type: 'Mental Health',
              notes: 'Regular monthly session.',
              color: '#dcfce7'
            },
            {
              id: 'APT002',
              title: 'Neurology Consultation',
              date: getFutureDate(25),
              time: '02:15 PM',
              doctor: 'Dr. James Chen',
              status: 'pending',
              type: 'Neurology',
              notes: 'Initial evaluation for migraines',
              color: '#fef3c7'
            },
            {
              id: 'APT003',
              title: 'Annual Checkup',
              date: '2025-10-12',
              time: '10:00 AM',
              doctor: 'Dr. Elena Rodriguez',
              status: 'completed',
              type: 'General Practice',
              notes: 'Bring recent test results',
              color: '#f1f5f9' // Lighter slate
            },
            {
              id: 'APT004',
              title: 'Pediatric Visit',
              date: '2025-08-05',
              time: '11:45 AM',
              doctor: 'Dr. Michael Thompson',
              status: 'cancelled',
              type: 'Pediatrics',
              notes: 'Routine vaccination',
              color: '#fee2e2' // Lighter red
            }
          ];

          setAppointments(mockAppointments);
          setFilteredAppointments(mockAppointments);
          
          const events = mockAppointments.map(apt => ({
            id: apt.id,
            title: `${apt.title} with ${apt.doctor}`,
            start: `${apt.date}T${convertTo24Hour(apt.time)}`,
            end: apt.endTime ? `${apt.date}T${convertTo24Hour(apt.endTime)}` : undefined,
            color: apt.color,
            extendedProps: {
              status: apt.status,
              type: apt.type,
              notes: apt.notes
            }
          }));
          
          setCalendarEvents(events);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let results = [...appointments];
    
    if (filters.status !== 'all') {
      results = results.filter(apt => apt.status === filters.status);
    }
    
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const currentDate = new Date();
      
      if (filters.dateRange === 'today') {
        results = results.filter(apt => apt.date === formatDate(today));
      } else if (filters.dateRange === 'week') {
        const nextWeek = new Date(currentDate.setDate(currentDate.getDate() + 7));
        results = results.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= today && aptDate <= nextWeek;
        });
      } else if (filters.dateRange === 'month') {
        const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        results = results.filter(apt => {
          const aptDate = new Date(apt.date);
          return aptDate >= today && aptDate <= nextMonth;
        });
      }
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(apt => 
        apt.title.toLowerCase().includes(query) || 
        apt.doctor.toLowerCase().includes(query) ||
        apt.notes.toLowerCase().includes(query)
      );
    }
    
    if (filters.appointmentType !== 'all') {
      results = results.filter(apt => apt.type === filters.appointmentType);
    }
    
    setFilteredAppointments(results);
    setCurrentPage(1);
  }, [filters, appointments]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (date) => date.toISOString().split('T')[0];

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}:00`;
  };

  const handleAddAppointment = () => {
    if (!newAppointment.title || !newAppointment.date || !newAppointment.time || !newAppointment.doctor) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newApt = {
      id: `APT${Math.floor(Math.random() * 10000)}`,
      ...newAppointment,
      status: 'pending',
      type: newAppointment.reason.toLowerCase().includes('check') ? 'checkup' : 'consultation',
      color: '#FFC107'
    };
    
    setAppointments([...appointments, newApt]);
    setFilteredAppointments([...filteredAppointments, newApt]);
    
    setCalendarEvents([...calendarEvents, {
      id: newApt.id,
      title: `${newApt.title} with ${newApt.doctor}`,
      start: `${newApt.date}T${convertTo24Hour(newApt.time)}`,
      color: newApt.color,
      extendedProps: {
        status: newApt.status,
        type: newApt.type,
        notes: newApt.notes
      }
    }]);
    
    setNewAppointment({
      title: '',
      date: '',
      time: '',
      doctor: '',
      reason: '',
      notes: ''
    });
    
    setShowAddModal(false);
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled', color: '#F44336' } : apt
    ));
    
    setFilteredAppointments(filteredAppointments.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled', color: '#F44336' } : apt
    ));
    
    setCalendarEvents(calendarEvents.map(event => 
      event.id === id ? { ...event, color: '#F44336' } : event
    ));
    
    setSelectedAppointment(null);
  };

  const handleRescheduleAppointment = (id, newDate, newTime) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, date: newDate, time: newTime } : apt
    ));
    
    setFilteredAppointments(filteredAppointments.map(apt => 
      apt.id === id ? { ...apt, date: newDate, time: newTime } : apt
    ));
    
    setCalendarEvents(calendarEvents.map(event => 
      event.id === id ? { 
        ...event, 
        start: `${newDate}T${convertTo24Hour(newTime)}` 
      } : event
    ));
    
    setSelectedAppointment(null);
  };

  const isUpcoming = (dateStr) => {
    // String comparison avoids timezone offset bugs where new Date('2026-07-31') becomes July 30th 8PM
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return dateStr >= todayStr;
  };
  const upcomingAppointments = filteredAppointments.filter(apt => isUpcoming(apt.date) && apt.status !== 'cancelled');
  const pastAppointments = filteredAppointments.filter(apt => !isUpcoming(apt.date) || apt.status === 'cancelled');

  return (
    <div className="max-w-[1280px] mx-auto px-lg py-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-lg gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface">Appointments</h2>
          <p className="text-body-md text-on-surface-variant mt-xs">Manage your upcoming clinical visits and history.</p>
        </div>
        <div className="flex items-center gap-sm">
          {/* View Switcher */}
          <div className="flex bg-surface-container-low p-1 rounded-xl">
            <button 
              onClick={() => setCurrentView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-label-md transition-all ${
                currentView === 'list' ? 'bg-white text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">list</span>
              List View
            </button>
            <button 
              onClick={() => setCurrentView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 text-label-md transition-all ${
                currentView === 'calendar' ? 'bg-white rounded-lg shadow-sm text-on-surface' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              Calendar
            </button>
          </div>
          <button 
            onClick={() => {
              exportToPDF(
                'Patient Appointments Schedule',
                ['ID', 'Title', 'Date', 'Time', 'Doctor', 'Specialty', 'Status'],
                filteredAppointments.map(a => [a.id, a.title, a.date, a.time, a.doctor, a.type, a.status]),
                'Appointments_Schedule'
              );
            }}
            className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 border border-slate-200/80 rounded-full text-xs font-bold hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <FiDownload size={14} /> Export Schedule
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <FiPlus size={16} />
            New Appointment
          </button>
        </div>
      </div>

      {currentView === 'list' ? (
        <div className="grid grid-cols-12 gap-gutter items-start">
          {/* Filters Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-md sticky top-24">
            <div className="bg-white rounded-xl p-sm border border-slate-100 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
              <div className="p-xs border-b border-slate-50 mb-sm flex items-center justify-between">
                <h3 className="font-label-md text-on-surface">Filters</h3>
                <button 
                  onClick={() => setFilters({ status: 'all', dateRange: 'all', searchQuery: '', appointmentType: 'all' })}
                  className="text-label-sm text-secondary hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-md p-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Status</label>
                  <div className="space-y-2">
                    {['all', 'confirmed', 'pending', 'completed'].map(status => (
                      <label key={status} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer capitalize font-medium">
                        <input 
                          type="radio"
                          checked={filters.status === status}
                          onChange={() => setFilters({...filters, status})}
                          className="rounded-full border-slate-300 text-secondary focus:ring-secondary"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
                <hr className="border-slate-50"/>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Specialty</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-secondary transition-colors pointer-events-none">medical_services</span>
                    <select 
                      value={filters.appointmentType}
                      onChange={(e) => setFilters({...filters, appointmentType: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-10 text-[13px] text-slate-600 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="all">All Specialties</option>
                      <option value="checkup">Checkup</option>
                      <option value="consultation">Consultation</option>
                      <option value="diagnostic">Diagnostic</option>
                      <option value="therapy">Therapy</option>
                      <option value="follow-up">Follow-up</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">expand_more</span>
                  </div>
                </div>
                <hr className="border-slate-50"/>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Date Filter</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-secondary transition-colors pointer-events-none">calendar_today</span>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-[13px] text-slate-600 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none cursor-pointer" 
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Promo/Support Card */}
            <div className="widget-card p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="icon-box w-12 h-12 mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-slate-900 text-xl">help_outline</span>
                </div>
                <h4 className="font-extrabold text-slate-900 font-manrope text-base">Need Help?</h4>
                <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                  Our support team is available 24/7 for emergency scheduling assistance.
                </p>
                <button 
                  onClick={() => setShowSupportModal(true)}
                  className="mt-4 text-xs font-black text-slate-900 uppercase tracking-widest hover:text-slate-700 cursor-pointer flex items-center gap-1.5"
                >
                  CONTACT SUPPORT →
                </button>
              </div>
              <FiActivity className="absolute -bottom-6 -right-6 text-slate-400/20 text-8xl rotate-12" />
            </div>
          </div>

          {/* Appointment List */}
          <div className="col-span-12 lg:col-span-9 space-y-4">
            {/* Section: Upcoming */}
            <div className="mb-sm">
              <h3 className="text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-4 font-bold flex items-center gap-2">
                Upcoming Visits
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px]">{upcomingAppointments.length}</span>
              </h3>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? upcomingAppointments.map(apt => (
                  <motion.div 
                    layout
                    key={apt.id} 
                    className="bg-white rounded-xl overflow-hidden border border-slate-100 transition-all hover:shadow-md" 
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <div className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/5 text-primary">
                          <span className="material-symbols-outlined text-2xl font-light">
                            event
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-[16px] text-slate-900 font-bold tracking-tight capitalize">{apt.type}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              apt.status === 'confirmed' ? 'bg-secondary/10 text-secondary' : 'bg-amber-500/10 text-amber-600'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>{apt.doctor}</span>
                            <span>•</span>
                            <span>{apt.title}</span>
                            <span>•</span>
                            <span>{apt.date} at {apt.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right pr-4 border-r border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</p>
                          <div className="flex gap-2 mt-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleCancelAppointment(apt.id); }}
                              className="px-2 py-1 text-[10px] font-bold text-error hover:bg-error/5 rounded transition-colors uppercase tracking-widest"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setAppointmentToReschedule(apt);
                                setIsRescheduleModalOpen(true);
                              }}
                              className="px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5 rounded transition-colors uppercase tracking-widest"
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                        <div className="p-2 rounded-full transition-all bg-slate-50 text-slate-400 hover:bg-primary hover:text-white">
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-xl p-12 text-center">
                    <p className="text-slate-400 text-sm font-medium">No upcoming appointments scheduled</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Past */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-[11px] text-slate-400 uppercase tracking-[0.15em] mb-4 font-bold flex items-center gap-2">
                History
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px]">{pastAppointments.length}</span>
              </h3>
              <div className="space-y-2">
                {pastAppointments.map(apt => (
                  <div key={apt.id} className="bg-white rounded-xl overflow-hidden border border-slate-100 transition-all hover:shadow-md cursor-pointer" onClick={() => setSelectedAppointment(apt)}>
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-500">
                          <span className="material-symbols-outlined text-2xl font-light">
                            history
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="text-[16px] text-slate-900 font-bold tracking-tight capitalize">{apt.type}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              apt.status === 'completed' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                            }`}>
                              {apt.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>{apt.doctor}</span>
                            <span>•</span>
                            <span>{apt.title}</span>
                            <span>•</span>
                            <span>{apt.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden md:block text-right pr-4 border-r border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                            className="mt-1 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50 rounded transition-colors uppercase tracking-widest"
                          >
                            View Summary
                          </button>
                        </div>
                        <div className="p-2 rounded-full transition-all bg-slate-50 text-slate-400 hover:bg-slate-200">
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Ultra-Luxurious & Cute Custom Interactive Calendar View ── */
        <div className="grid grid-cols-12 gap-6 items-start font-manrope">
          {/* Main Calendar Grid Card (Col 8) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-[0px_20px_60px_-15px_rgba(15,23,42,0.05)] relative overflow-hidden space-y-6">
            {/* Subtle SVG Pulse Pattern */}
            <svg className="absolute -bottom-10 -right-10 w-48 h-48 stroke-slate-100 fill-none opacity-40 pointer-events-none">
              <path d="M 0,50 L 50,50 L 60,10 L 70,90 L 80,30 L 90,70 L 100,50 L 200,50" strokeWidth="2" />
            </svg>

            {/* Calendar Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black shadow-md">
                  <FiCalendar size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {calCurrentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interactive Appointment Grid</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const today = new Date();
                    setCalCurrentMonth(today);
                    setSelectedCalDate(today);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                >
                  Today
                </button>
                <div className="flex gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setCalCurrentMonth(new Date(calCurrentMonth.getFullYear(), calCurrentMonth.getMonth() - 1, 1))}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setCalCurrentMonth(new Date(calCurrentMonth.getFullYear(), calCurrentMonth.getMonth() + 1, 1))}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-slate-900 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Status Legend Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" />
                Confirmed Visit
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm" />
                Pending Request
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                Past / Completed
              </span>
            </div>

            {/* Month Day Headers */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="py-2 text-[10px] font-black text-slate-400 tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {(() => {
                const year = calCurrentMonth.getFullYear();
                const month = calCurrentMonth.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const days = [];

                // Empty padding slots
                for (let i = 0; i < firstDay; i++) {
                  days.push(<div key={`empty-${i}`} className="min-h-[90px] rounded-2xl bg-slate-50/40 opacity-30 border border-slate-100/40" />);
                }

                // Days of month
                for (let i = 1; i <= daysInMonth; i++) {
                  const cellDate = new Date(year, month, i);
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                  const isToday = cellDate.toDateString() === new Date().toDateString();
                  const isSelected = selectedCalDate && cellDate.toDateString() === selectedCalDate.toDateString();

                  // Filter appointments for this date
                  const dayAppointments = appointments.filter(a => a.date === dateStr);

                  days.push(
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCalDate(cellDate)}
                      className={`min-h-[100px] p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                        isSelected 
                          ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 z-10' 
                          : isToday 
                          ? 'bg-secondary-container/20 border-secondary/20 text-slate-900' 
                          : 'bg-white border-slate-100/90 text-slate-700 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* Top Row: Day Number & Today indicator */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black h-6 w-6 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-white text-secondary font-black' : isToday ? 'bg-secondary text-white font-extrabold' : 'text-slate-900'
                        }`}>
                          {i}
                        </span>
                        {isToday && !isSelected && (
                          <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">Today</span>
                        )}
                      </div>

                      {/* Cute Event Badges */}
                      <div className="space-y-1 mt-1.5">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div 
                            key={apt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(apt);
                            }}
                            className={`px-2 py-1 rounded-xl text-[10px] font-bold truncate flex items-center gap-1.5 transition-transform hover:scale-105 ${
                              isSelected 
                                ? 'bg-slate-800 text-slate-200 border border-slate-700' 
                                : apt.status === 'confirmed' 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                                : apt.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-100'
                                : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                              apt.status === 'confirmed' ? 'bg-emerald-500' : apt.status === 'pending' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <span className="truncate">{apt.title}</span>
                          </div>
                        ))}

                        {dayAppointments.length > 2 && (
                          <p className={`text-[9px] font-black px-1 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                            +{dayAppointments.length - 2} more
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                }

                return days;
              })()}
            </div>
          </div>

          {/* Right Inspection Schedule Panel (Col 4) */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-[0px_20px_60px_-15px_rgba(15,23,42,0.05)] relative overflow-hidden font-manrope">
              {/* Card Header */}
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-5">
                <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-black border border-amber-100">
                  <FiClock size={20} />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {selectedCalDate ? selectedCalDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Selected Date'}
                  </h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Day Schedule Breakdown</p>
                </div>
              </div>

              {/* Day Appointments List */}
              {(() => {
                const dateStr = selectedCalDate ? `${selectedCalDate.getFullYear()}-${String(selectedCalDate.getMonth() + 1).padStart(2, '0')}-${String(selectedCalDate.getDate()).padStart(2, '0')}` : '';
                const selectedDayApts = appointments.filter(a => a.date === dateStr);

                if (selectedDayApts.length === 0) {
                  return (
                    <div className="py-10 text-center space-y-3">
                      <div className="h-16 w-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                        <FiCalendar size={28} />
                      </div>
                      <p className="text-xs font-bold text-slate-400">No visits scheduled for this date.</p>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all cursor-pointer shadow-md active:scale-95 inline-flex items-center gap-1.5"
                      >
                        <FiPlus size={14} /> Schedule Visit
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {selectedDayApts.map((apt) => (
                      <div 
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="p-4 bg-slate-50/70 hover:bg-slate-100/80 rounded-3xl border border-slate-100 transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {apt.status}
                          </span>
                          <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-xl shadow-sm border border-slate-100">
                            {apt.time}
                          </span>
                        </div>

                        <div>
                          <h5 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors">{apt.title}</h5>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">{apt.doctor} • {apt.type}</p>
                        </div>

                        {apt.notes && (
                          <p className="text-[11px] font-semibold text-slate-400 italic bg-white p-2.5 rounded-xl border border-slate-100/60 line-clamp-2">
                            "{apt.notes}"
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setAppointmentToReschedule(apt);
                              setIsRescheduleModalOpen(true);
                            }}
                            className="flex-1 py-2 bg-white hover:bg-slate-900 hover:text-white text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200/60 shadow-sm"
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(apt);
                            }}
                            className="py-2 px-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm"
                          >
                            Details →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedAppointment && (
          <AppointmentViewModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onCancel={handleCancelAppointment}
            onReschedule={handleRescheduleAppointment}
            onEditNotes={(id, notes) => {
              setAppointments(appointments.map(apt => apt.id === id ? { ...apt, notes } : apt));
            }}
          />
        )}
        {showAddModal && (
          <ScheduleAppointmentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSchedule={(data) => {
              setAppointments([...appointments, { ...data, id: Date.now().toString(), status: 'pending' }]);
              setShowAddModal(false);
            }}
          />
        )}
        <RescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          appointment={appointmentToReschedule}
          onReschedule={(newDate, newTime) => {
            handleRescheduleAppointment(appointmentToReschedule.id, newDate, newTime);
            setIsRescheduleModalOpen(false);
          }}
        />
        {showSupportModal && (
          <ContactSupportModal
            onClose={() => setShowSupportModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientAppointmentsPage;