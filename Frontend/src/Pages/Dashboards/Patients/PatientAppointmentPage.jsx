import React, { useState, useEffect } from 'react';
import { 
  FiCalendar, FiClock, FiSearch, FiFilter, FiX, FiPlus, 
  FiChevronLeft, FiChevronRight, FiUser, FiAlertCircle, 
  FiCheckCircle, FiLoader, FiXCircle
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



const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentView, setCurrentView] = useState('list');
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentActionAppointment, setCurrentActionAppointment] = useState(null);

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
    const fetchAppointments = async () => {
      try {
        setTimeout(() => {
          const mockAppointments = [
            {
              id: 'APT-NOW-1',
              title: 'General Health Checkup',
              date: new Date().toISOString().split('T')[0],
              time: '10:00 AM',
              doctor: 'Dr. Sarah Mitchell',
              status: 'confirmed',
              type: 'General Practice',
              notes: 'Quarterly review of overall health and wellness.',
              color: '#dcfce7' // Lighter green
            },
            {
              id: 'APT-NOW-2',
              title: 'Dental Cleaning',
              date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
              time: '02:30 PM',
              doctor: 'Dr. Emily Chen',
              status: 'pending',
              type: 'Dentistry',
              notes: 'Routine cleaning and fluoride treatment.',
              color: '#fef3c7' // Lighter amber
            },
            {
              id: 'APT-MAY-3',
              title: 'Dermatology Exam',
              date: '2026-05-05',
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
              date: '2026-05-08',
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
              date: '2026-05-12',
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
              date: '2026-05-15',
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
              date: '2026-05-20',
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
              date: '2026-05-22',
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
              date: '2026-05-28',
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

  const isUpcoming = (dateStr) => new Date(dateStr) >= new Date().setHours(0,0,0,0);
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full hover:shadow-lg transition-all active:scale-95 duration-150 font-label-md"
          >
            <span className="material-symbols-outlined">add</span>
            Schedule New Appointment
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
            <div className="bg-secondary-container rounded-xl p-sm text-on-secondary-container">
              <span className="material-symbols-outlined text-secondary">help_outline</span>
              <h4 className="font-label-md mt-2">Need Help?</h4>
              <p className="text-label-sm mt-1 opacity-80">Our support team is available 24/7 for emergency scheduling assistance.</p>
              <button className="mt-md w-full bg-white text-secondary py-2 rounded-lg font-label-md hover:bg-slate-50 transition-colors">Contact Support</button>
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
                    className="bg-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer" 
                    onClick={() => setSelectedAppointment(apt)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-surface-container overflow-hidden flex-shrink-0 border border-slate-50">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${apt.doctor}&background=d3e4fe&color=0b1c30`} 
                          alt={apt.doctor} 
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-[16px] text-slate-900 font-bold tracking-tight group-hover:text-secondary transition-colors">{apt.doctor}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            apt.status === 'confirmed' ? 'bg-secondary/10 text-secondary' : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">medical_information</span>
                            {apt.title}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">event</span>
                            {apt.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">schedule</span>
                            {apt.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleCancelAppointment(apt.id); }}
                        className="px-3 py-1.5 text-[12px] font-bold text-error hover:bg-error/5 rounded-lg transition-colors uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                        className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-[12px] font-black text-slate-600 hover:bg-slate-100 rounded-lg transition-all uppercase tracking-widest"
                      >
                        Reschedule
                      </button>
                      <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-300">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
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
                  <div key={apt.id} className="bg-white rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between border border-slate-100 group transition-all cursor-pointer hover:shadow-md" onClick={() => setSelectedAppointment(apt)}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-surface-container overflow-hidden flex-shrink-0 border border-slate-100/50">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${apt.doctor}&background=e5eeff&color=0b1c30`} 
                          alt={apt.doctor} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-[15px] text-slate-900 font-bold tracking-tight group-hover:text-secondary transition-colors">{apt.doctor}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            apt.status === 'completed' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{apt.type} • {apt.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); }}
                        className="px-3 py-1.5 text-[11px] font-black text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors uppercase tracking-widest"
                      >
                        <span className="material-symbols-outlined text-[18px]">description</span>
                        Summary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-md border border-slate-100 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            eventClick={(info) => {
              const apt = appointments.find(a => a.id === info.event.id);
              setSelectedAppointment(apt);
            }}
            eventContent={(eventInfo) => {
              const isMonthView = eventInfo.view.type === 'dayGridMonth';
              return (
                <div 
                  className={`flex flex-col overflow-hidden h-full border-l-[6px] transition-all ${
                    isMonthView ? 'gap-0.5 px-2 py-1 rounded-r-lg' : 'gap-1.5 px-4 py-3 rounded-r-2xl'
                  }`}
                  style={{ 
                    backgroundColor: eventInfo.event.backgroundColor, 
                    borderColor: eventInfo.event.borderColor || eventInfo.event.backgroundColor 
                  }}
                >
                  <div className={`flex items-center justify-between ${isMonthView ? 'mb-0' : 'mb-1.5'}`}>
                    <p className={`${isMonthView ? 'text-[10px]' : 'text-[13px]'} font-extrabold leading-tight text-slate-900 truncate`}>
                      {eventInfo.event.title.split(' with ')[0]}
                    </p>
                    <p className={`${isMonthView ? 'text-[8px]' : 'text-[11px]'} font-black text-slate-600/60 uppercase`}>
                      {eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className={`flex items-center opacity-90 ${isMonthView ? 'gap-1' : 'gap-2.5'}`}>
                    <span className={`material-symbols-outlined text-slate-500 ${isMonthView ? 'text-[11px]' : 'text-[14px]'}`}>person</span>
                    <p className={`${isMonthView ? 'text-[9px]' : 'text-[12px]'} font-bold text-slate-700 truncate`}>
                      {eventInfo.event.title.split(' with ')[1]}
                    </p>
                  </div>
                </div>
              );
            }}
            eventClassNames="!rounded-lg !border-none !shadow-sm hover:!shadow-md transition-all cursor-pointer !overflow-hidden"
            height="700px"
          />
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
      </AnimatePresence>
    </div>
  );
};

export default PatientAppointmentsPage;