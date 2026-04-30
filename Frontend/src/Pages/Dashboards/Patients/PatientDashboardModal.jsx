import React, { useState } from 'react';
import styles from './PatientDashboardModal.module.css';
import { 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlus,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaUserMd
} from 'react-icons/fa';

const PatientDashboardModal = ({ 
  isOpen, 
  onClose, 
  patient,
  appointments = [],
  currentDate = new Date(),
  onPrevMonth,
  onNextMonth
}) => {
  if (!isOpen) return null;
  
  const [selectedDate, setSelectedDate] = useState(null);

  const parseAppointmentDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) throw new Error('Invalid date');
      return date;
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return new Date();
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: new Date(year, month, i - firstDay + 1),
        currentMonth: false,
        isToday: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      days.push({
        date: dayDate,
        currentMonth: true,
        isToday: dayDate.toDateString() === new Date().toDateString()
      });
    }
    
    // Next month days to complete the grid
    const daysToAdd = 7 - (days.length % 7);
    if (daysToAdd < 7) {
      for (let i = 1; i <= daysToAdd; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          currentMonth: false,
          isToday: false
        });
      }
    }
    
    return days;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => {
      try {
        const appDate = parseAppointmentDate(app.date);
        return (
          appDate.getDate() === date.getDate() &&
          appDate.getMonth() === date.getMonth() &&
          appDate.getFullYear() === date.getFullYear()
        );
      } catch (error) {
        console.error('Error comparing dates for appointment:', app, error);
        return false;
      }
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    // Simple formatting - you might want to use a proper time formatter
    return timeStr.replace(/(\d+)(:\d+)?\s*(AM|PM)/i, '$1$2 $3');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.patientProfile}>
              <div className={styles.avatar}>
                {patient?.avatar || <FaUser className={styles.avatarIcon} />}
              </div>
              <div className={styles.patientInfo}>
                <h2 className={styles.patientName}>{patient?.name}</h2>
                <div className={styles.patientMeta}>
                  <span className={styles.metaItem}>
                    <FaUser className={styles.metaIcon} /> {patient?.age} • {patient?.gender}
                  </span>
                  <span className={styles.metaItem}>
                    <FaPhone className={styles.metaIcon} /> {patient?.phone}
                  </span>
                </div>
              </div>
            </div>
            
            <button className={styles.closeButton} onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.calendarSection}>
            <div className={styles.calendarHeader}>
              <div className={styles.monthNavigation}>
                <button onClick={onPrevMonth} className={styles.navButton}>
                  <FaChevronLeft />
                </button>
                <h3 className={styles.monthTitle}>{monthName} {year}</h3>
                <button onClick={onNextMonth} className={styles.navButton}>
                  <FaChevronRight />
                </button>
              </div>
              
              {/* <button 
                className={styles.addButton}
                onClick={() => {
                  setSelectedDate(new Date());
                  // Here you would typically open an appointment creation modal
                }}
              >
                <FaPlus /> New Appointment
              </button> */}
            </div>
            
            <div className={styles.calendarGrid}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className={styles.dayHeader}>{day}</div>
              ))}

              {daysInMonth.map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day.date);
                
                return (
                  <div 
                    key={index} 
                    className={`${styles.calendarDay} 
                      ${day.currentMonth ? '' : styles.otherMonth} 
                      ${day.isToday ? styles.today : ''}
                      ${dayAppointments.length > 0 ? styles.hasAppointments : ''}`}
                  >
                    <div className={styles.dayNumber}>
                      {day.date.getDate()}
                      {dayAppointments.length > 0 && (
                        <span className={styles.appointmentBadge}>
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>
                    
                    <div className={styles.appointmentsContainer}>
                      {dayAppointments.map((appointment, idx) => (
                        <div 
                          key={idx} 
                          className={`${styles.appointmentEvent} ${styles[appointment.status?.toLowerCase() || '']}`}
                        >
                          <div className={styles.appointmentTime}>
                            <FaClock className={styles.appointmentIcon} />
                            {formatTime(appointment.time)}
                          </div>
                          
                          <div className={styles.appointmentTitle}>
                            <FaUserMd className={styles.appointmentIcon} />
                            Dr. {appointment.doctor}
                          </div>
                          {appointment.status && (
                            <div className={styles.appointmentStatus}>
                              {appointment.status}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardModal;