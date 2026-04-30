import React, { useState, useEffect } from 'react';
import styles from './RescheduleModal.module.css';
import { 
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RescheduleModal = ({ 
  isOpen, 
  onClose, 
  appointment,
  onReschedule
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select date, 2: Select time, 3: Confirm

  useEffect(() => {
    if (isOpen) {
      // Simulate fetching available slots from API
      setIsLoading(true);
      setTimeout(() => {
        const slots = generateMockSlots(currentMonth);
        setAvailableSlots(slots);
        setIsLoading(false);
      }, 800);
    }
  }, [isOpen, currentMonth]);

  const generateMockSlots = (month) => {
    const slots = {};
    const daysInMonth = new Date(
      month.getFullYear(), 
      month.getMonth() + 1, 
      0
    ).getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(month.getFullYear(), month.getMonth(), i);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        slots[date.toISOString().split('T')[0]] = [
          '9:00 AM', '10:30 AM', '11:00 AM',
          '1:00 PM', '2:30 PM', '3:00 PM'
        ];
      }
    }
    return slots;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    ));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    ));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const rescheduledAppointment = {
      ...appointment,
      date: selectedDate.toISOString(),
      time: selectedTime,
      status: 'Rescheduled',
      rescheduleReason: reason
    };
    
    onReschedule(rescheduledAppointment);
    setIsLoading(false);
    onClose();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`prev-${i}`} className={styles.calendarDayEmpty}></div>
      );
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const hasSlots = availableSlots[dateString]?.length > 0;
      const isSelected = selectedDate.toISOString().split('T')[0] === dateString;
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <motion.div
          key={`day-${i}`}
          className={`
            ${styles.calendarDay} 
            ${hasSlots ? styles.available : styles.unavailable}
            ${isSelected ? styles.selected : ''}
            ${isToday ? styles.today : ''}
          `}
          whileHover={{ scale: hasSlots ? 1.05 : 1 }}
          whileTap={{ scale: hasSlots ? 0.95 : 1 }}
          onClick={() => hasSlots && handleDateSelect(date)}
        >
          <span className={styles.dayNumber}>{i}</span>
          {hasSlots && (
            <span className={styles.slotIndicator}>
              {availableSlots[dateString].length} slots
            </span>
          )}
          {isToday && <span className={styles.todayBadge}>Today</span>}
        </motion.div>
      );
    }
    
    return days;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.modal}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
            <div className={styles.modalHeader}>
            {step > 1 && (
                <button 
                className={styles.backButton}
                onClick={() => setStep(step - 1)}
                aria-label="Go back"
                >
                <FaChevronLeft />
                </button>
            )}
            <div className={styles.headerContent}>
                <h2>Reschedule Appointment</h2>
                <p className={styles.subtitle}>Select a new date and time for your appointment</p>
            </div>
            <button 
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
            >
                <FaTimes />
            </button>
            </div>

          <div className={styles.modalBody}>
            <div className={styles.appointmentCard}>
              <div className={styles.doctorInfo}>
                <div className={styles.avatar}>
                  {appointment.doctor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3>
                    <FaUserMd /> Dr. {appointment.doctor}
                  </h3>
                  <p className={styles.specialty}>{appointment.specialty}</p>
                </div>
              </div>
              
              <div className={styles.appointmentMeta}>
                <div className={styles.metaItem}>
                  <FaCalendarAlt />
                  <span>
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <FaClock />
                  <span>{appointment.time}</span>
                </div>
                <div className={styles.metaItem}>
                  <FaMapMarkerAlt />
                  <span>{appointment.location}</span>
                </div>
              </div>
            </div>

            <div className={styles.progressSteps}>
              <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
                <span>1</span>
                <p>Select Date</p>
              </div>
              <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
                <span>2</span>
                <p>Select Time</p>
              </div>
              <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
                <span>3</span>
                <p>Confirm</p>
              </div>
            </div>

            {step === 1 && (
                  <motion.div
    key="step1"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className={styles.dateSelection}
  >
              <div className={styles.dateSelection}>
                <div className={styles.calendarHeader}>
                  <button 
                    className={styles.navButton}
                    onClick={handlePrevMonth}
                    disabled={isLoading}
                  >
                    <FaChevronLeft />
                  </button>
                  <h3 className={styles.monthTitle}>
                    {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
                  </h3>
                  <button 
                    className={styles.navButton}
                    onClick={handleNextMonth}
                    disabled={isLoading}
                  >
                    <FaChevronRight />
                  </button>
                </div>
                
                <div className={styles.calendarGrid}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={styles.dayHeader}>{day}</div>
                  ))}
                  
                  {isLoading ? (
                    <div className={styles.loadingCalendar}>
                      <div className={styles.loadingSpinner}></div>
                      <p>Loading available dates...</p>
                    </div>
                  ) : (
                    renderCalendar()
                  )}
                </div>
              </div>
              </motion.div>
            )}

            {step === 2 && (
                  <motion.div
    key="step2"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className={styles.timeSelection}
  >
              <div className={styles.timeSelection}>
                <div className={styles.selectedDate}>
                <FaCalendarAlt />
                <h3>
                    {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                    })}
                </h3>
                <button 
                    className={styles.textBackButton}
                    onClick={() => setStep(1)}
                >
                    Change date
                </button>
                </div>
                
                <div className={styles.timeSlotsGrid}>
                  {availableSlots[selectedDate.toISOString().split('T')[0]]?.map(time => (
                    <motion.button
                      key={time}
                      type="button"
                      className={`${styles.timeSlot} ${
                        selectedTime === time ? styles.selected : ''
                      }`}
                      onClick={() => handleTimeSelect(time)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>
              </motion.div>
            )}

            {step === 3 && (
                  <motion.div
    key="step3"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className={styles.confirmationStep}
  >
              <div className={styles.confirmationStep}>
                <div className={styles.confirmationCard}>
                  <h3>Appointment Details</h3>
                  <div className={styles.detailRow}>
                    <span>Doctor:</span>
                    <span>Dr. {appointment.doctor}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Date:</span>
                    <span>
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span>Location:</span>
                    <span>{appointment.location}</span>
                  </div>
                </div>
                
                <div className={styles.reasonInput}>
                  <label>
                    <FaInfoCircle /> Reason for rescheduling (optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Let us know why you're rescheduling..."
                    rows={3}
                  />
                </div>
                
                <div className={styles.actionButtons}>
                <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setStep(2)}
                disabled={isLoading}
                >
                Back
                </button>
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className={styles.buttonLoading}>
                        <span className={styles.spinner}></span>
                        Processing...
                      </span>
                    ) : (
                      'Confirm Reschedule'
                    )}
                  </button>
                </div>
              </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RescheduleModal;