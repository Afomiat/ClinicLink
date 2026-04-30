import React from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight,FaPlus } from 'react-icons/fa';
import styles from './Modal.module.css';
import  { useState } from 'react';
import ScheduleModal from './ScheduleModal'


const AppointmentsModal = ({ 
  isOpen, 
  onClose, 
  appointments = [],
//   schedules = [], // Add schedules prop

  currentDate = new Date(),
  onPrevMonth,
  onNextMonth
}) => {
  if (!isOpen) return null;
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSaveSchedule = (newSchedule) => {
    // Here you would typically save to your state or backend
    console.log('New schedule:', newSchedule);
    // Add to your appointments/schedules state
  };
  // Parse appointment dates properly
  const parseAppointmentDate = (dateStr, year) => {
    try {
      // Handle multiple date formats
      if (typeof dateStr === 'string') {
        // Format 1: "Month Day" (e.g., "April 14")
        if (/^[a-zA-Z]+\s\d+$/.test(dateStr)) {
          const [monthName, day] = dateStr.split(' ');
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
          if (!isNaN(monthIndex)) {
            return new Date(year, monthIndex, parseInt(day));
          }
        }
        
        // Format 2: ISO string (e.g., "2024-05-05")
        const isoDate = new Date(dateStr);
        if (!isNaN(isoDate.getTime())) {
          return isoDate;
        }
        
        // Format 3: Numeric date (e.g., "5/5/2024")
        const numericDate = new Date(dateStr);
        if (!isNaN(numericDate.getTime())) {
          return numericDate;
        }
      }
      
      // Format 4: Already a Date object
      if (dateStr instanceof Date) {
        return dateStr;
      }
      
      throw new Error('Unrecognized date format');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return new Date(); // Fallback to current date
    }
  };
  // Generate calendar days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push({
        date: new Date(year, month, -i),
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
    
    // Next month days (to fill the grid)
    while (days.length % 7 !== 0) {
      days.push({
        date: new Date(year, month + 1, days.length % 7 + 1),
        currentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Get appointments for specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => {
      try {
        const appDate = parseAppointmentDate(app.date, currentDate.getFullYear());
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
// Add this right before the return statement
console.log('--- Debugging Appointments ---');
appointments.forEach(app => {
  const parsedDate = parseAppointmentDate(app.date, currentDate.getFullYear());
  console.log(`Appointment: ${app.patientName}`, {
    originalDate: app.date,
    parsedDate: parsedDate.toString(),
    currentMonth: currentDate.getMonth(),
    parsedMonth: parsedDate.getMonth()
  });
});
  return (
    <>
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className={styles.modalHeader}>
            <div className={styles.monthNavigation}>
                <button onClick={onPrevMonth} className={styles.navButton}>
                <FaChevronLeft />
                </button>
                <h2 className={styles.modalTitle}>{monthName} {year}</h2>
                <button onClick={onNextMonth} className={styles.navButton}>
                <FaChevronRight />
                </button>
            </div>
            <button 
    className={styles.addButton}
    onClick={() => {
        console.log('Add Schedule button clicked'); // Debug log
        setSelectedDate(currentDate);
        setIsScheduleModalOpen(true);
        console.log('isScheduleModalOpen should be true:', isScheduleModalOpen); // Debug log
    }}
>
    <FaPlus /> Add Schedule
</button>
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
                ${day.isToday ? styles.today : ''}`}
            onClick={() => {
                setSelectedDate(day.date);
                setIsScheduleModalOpen(true);
            }}
            >
            <div className={styles.dayNumber}>
                {day.date.getDate()}
                {dayAppointments.length > 0 && (
                <span className={styles.appointmentIndicator}></span>
                )}
            </div>
            
            <div className={styles.appointmentsContainer}>
                {dayAppointments.map((item, idx) => (
                <div 
                    key={idx} 
                    className={`${styles.appointmentEvent} ${item.type ? styles.scheduleEvent : ''}`}
                    style={{ 
                    borderLeftColor: item.color || '#6366f1',
                    backgroundColor: item.color ? `${item.color}20` : '#e0e7ff'
                    }}
                >
                    <div className={styles.appointmentTime}>
                    {item.time || (item.startTime && `${item.startTime} - ${item.endTime}`)}
                    </div>
                    <div className={styles.appointmentTitle}>
                    {item.patientName || item.title}
                    </div>
                    {(item.diagnosis || item.note) && (
                    <div className={styles.appointmentDetail}>
                        {item.diagnosis || item.note}
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
    <ScheduleModal
    isOpen={isScheduleModalOpen}
    onClose={() => setIsScheduleModalOpen(false)}
    onSave={handleSaveSchedule}
    selectedDate={selectedDate}
  />
</>
  );
};

export default AppointmentsModal;