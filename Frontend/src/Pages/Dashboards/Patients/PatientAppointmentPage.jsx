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
              id: 'APT001',
              title: 'Annual Checkup',
              date: '2025-05-13',
              time: '10:00 AM',
              doctor: 'Dr. Sarah Johnson',
              status: 'confirmed',
              type: 'checkup',
              notes: 'Bring recent test results',
              color: '#4CAF50'
            },
            {
              id: 'APT002',
              title: 'Dermatology Consultation',
              date: '2023-07-16',
              time: '2:30 PM',
              doctor: 'Dr. Michael Chen',
              status: 'pending',
              type: 'consultation',
              notes: 'Skin allergy follow-up',
              color: '#FFC107'
            },
            {
              id: 'APT003',
              title: 'MRI Scan',
              date: '2023-07-18',
              time: '9:15 AM',
              doctor: 'Dr. Emily Wong',
              status: 'completed',
              type: 'diagnostic',
              notes: 'Fasting required',
              color: '#2196F3'
            },
            {
              id: 'APT004',
              title: 'Physical Therapy',
              date: '2023-07-20',
              time: '11:45 AM',
              doctor: 'Dr. Robert Smith',
              status: 'confirmed',
              type: 'therapy',
              notes: 'Bring exercise clothes',
              color: '#4CAF50'
            },
            {
              id: 'APT005',
              title: 'Cardiology Follow-up',
              date: '2023-07-22',
              time: '3:00 PM',
              doctor: 'Dr. Lisa Patel',
              status: 'cancelled',
              type: 'follow-up',
              notes: 'Bring ECG results',
              color: '#F44336'
            }
          ];

          setAppointments(mockAppointments);
          setFilteredAppointments(mockAppointments);
          
          const events = mockAppointments.map(apt => ({
            id: apt.id,
            title: `${apt.title} with ${apt.doctor}`,
            start: `${apt.date}T${convertTo24Hour(apt.time)}`,
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

  return (
    <div className={styles.patientAppointments}>
      <header className={styles.appointmentsHeader}>
        <div className={styles.headerContent}>
          <h1>
            <FiCalendar className={styles.headerIcon} />
            My Appointments
          </h1>
          <p className={styles.subtitle}>Manage your upcoming medical appointments</p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <motion.div className={`${styles.statCard} ${styles.primary}`} whileHover={{ scale: 1.03 }}>
          <div className={styles.statContent}>
            <h3>Total Appointments</h3>
            <div className={styles.statValue}>{appointments.length}</div>
          </div>
          <FiCalendar className={styles.statIcon} />
        </motion.div>
        
        <motion.div className={`${styles.statCard} ${styles.secondary}`} whileHover={{ scale: 1.03 }}>
          <div className={styles.statContent}>
            <h3>Confirmed</h3>
            <div className={styles.statValue}>
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
          </div>
          <FiCheckCircle className={styles.statIcon} />
        </motion.div>
        
        <motion.div className={`${styles.statCard} ${styles.tertiary}`} whileHover={{ scale: 1.03 }}>
          <div className={styles.statContent}>
            <h3>Pending</h3>
            <div className={styles.statValue}>
              {appointments.filter(a => a.status === 'pending').length}
            </div>
          </div>
          <FiLoader className={styles.statIcon} />
        </motion.div>
        
        <motion.div className={`${styles.statCard} ${styles.quaternary}`} whileHover={{ scale: 1.03 }}>
          <div className={styles.statContent}>
            <h3>Cancelled</h3>
            <div className={styles.statValue}>
              {appointments.filter(a => a.status === 'cancelled').length}
            </div>
          </div>
          <FiXCircle className={styles.statIcon} />
        </motion.div>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${currentView === 'list' ? styles.active : ''}`}
            onClick={() => setCurrentView('list')}
          >
            List View
          </button>
          <button
            className={`${styles.viewButton} ${currentView === 'calendar' ? styles.active : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            Calendar View
          </button>
        </div>
        
        <div className={styles.searchFilter}>
          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search appointments..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
            />
            {filters.searchQuery && (
              <button 
                className={styles.clearSearch}
                onClick={() => setFilters({...filters, searchQuery: ''})}
              >
                <FiX />
              </button>
            )}
          </div>
          
          <button 
            className={styles.filterButton}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter />
            Filters
            {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          

        </div>
        
        {isFilterOpen && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label>Status</label>
              <select 
                value={filters.status} 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className={styles.filterSelect}
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Date Range</label>
              <select 
                value={filters.dateRange} 
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                className={styles.filterSelect}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Appointment Type</label>
              <select 
                value={filters.appointmentType} 
                onChange={(e) => setFilters({...filters, appointmentType: e.target.value})}
                className={styles.filterSelect}
              >
                <option value="all">All Types</option>
                <option value="checkup">Checkup</option>
                <option value="consultation">Consultation</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="therapy">Therapy</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>

            <button 
              className={styles.clearFilters}
              onClick={() => {
                setFilters({
                  status: 'all',
                  dateRange: 'all',
                  searchQuery: '',
                  appointmentType: 'all'
                });
              }}
            >
              <FiX /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your appointments...</p>
        </div>
      ) : currentView === 'list' ? (
        <div className={styles.appointmentsList}>
{currentAppointments.length > 0 ? (
  <>
    <div className={styles.resultsTable}>
      <div className={styles.tableHeader}>
        <div className={styles.headerCell}>Appointment</div>
        <div className={styles.headerCell}>Status</div>
        <div className={styles.headerCell}>Date</div>
        <div className={styles.headerCell}>Doctor</div>
        <div className={styles.headerCell}>Actions</div>
      </div>

      {currentAppointments.map(appointment => (
        <div key={appointment.id} className={styles.tableRow}>
          <div className={styles.dataCell}>
            <div className={styles.testName}>{appointment.title}</div>
            <div className={styles.doctorName}>{appointment.type}</div>
          </div>
          <div className={styles.dataCell}>
            <div className={styles.statusContainer}>
              <span className={`${styles.statusBadge} ${styles[appointment.status]}`}>
                {appointment.status}
              </span>
            </div>
          </div>
          <div className={styles.dataCell}>
            {appointment.date}
            <div className={styles.timeText}>{appointment.time}</div>
          </div>
          <div className={styles.dataCell}>
            {appointment.doctor}
          </div>
          <div className={styles.actionCell}>
            <button 
              className={styles.actionDots}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentActionAppointment(appointment);
                setIsActionModalOpen(true);
              }}
            >
              •••
            </button>
          </div>
        </div>
      ))}
    </div>
                  
              {filteredAppointments.length > appointmentsPerPage && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                  >
                    <FiChevronLeft /> Previous
                  </button>
                  
                  <div className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                  >
                    Next <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <FiAlertCircle className={styles.noResultsIcon} />
              <h3>No appointments found</h3>
              <p>Try adjusting your filters or schedule a new appointment</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.calendarView}>
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
            height="auto"
            eventContent={(eventInfo) => (
              <div className={styles.calendarEvent}>
                <div className={styles.eventTime}>
                  {eventInfo.timeText}
                </div>
                <div className={styles.eventTitle}>
                  {eventInfo.event.title.split(' with ')[0]} {/* Show just the appointment title */}
                </div>
                <div className={styles.eventDoctor}>
                  {eventInfo.event.title.split(' with ')[1]} {/* Show doctor name */}
                </div>
                <div className={`${styles.eventStatus} ${styles[eventInfo.event.extendedProps.status]}`}>
                  {eventInfo.event.extendedProps.status}
                </div>
              </div>
            )}
            eventDidMount={(info) => {
              // Add tooltip with additional info
              if (info.event.extendedProps.notes) {
                info.el.setAttribute('title', info.event.extendedProps.notes);
              }
            }}
          />
        </div>
      )}


      {isActionModalOpen && (
      <AppointmentActionModal
        appointment={currentActionAppointment}
        onClose={() => setIsActionModalOpen(false)}
        onView={(appointment) => setSelectedAppointment(appointment)}
        onCancel={handleCancelAppointment}
      />
    )}
    <AnimatePresence>
  {selectedAppointment && (
    <AppointmentViewModal
      appointment={selectedAppointment}
      onClose={() => setSelectedAppointment(null)}
      onCancel={handleCancelAppointment}
      onReschedule={handleRescheduleAppointment}
      onEditNotes={(id, notes) => {
        // Implement notes editing functionality
        setAppointments(appointments.map(apt => 
          apt.id === id ? { ...apt, notes } : apt
        ));
      }}
    />
  )}
</AnimatePresence>
    </div>
  );
};

export default PatientAppointmentsPage;