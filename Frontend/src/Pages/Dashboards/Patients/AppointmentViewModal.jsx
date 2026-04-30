import React, { useState } from 'react';
import { 
  FiX, FiCalendar, FiClock, FiUser, FiAlertCircle, 
  FiEdit2, FiTrash2, FiCheckCircle, FiFileText 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AppointmentViewModal.module.css';
import RescheduleModal from './RescheduleModal'; // Import the RescheduleModal


const AppointmentViewModal = ({ 
  appointment, 
  onClose, 
  onCancel, 
  onReschedule,
  onEditNotes
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(appointment?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: appointment?.date || '',
    time: appointment?.time || ''
  });
    const [showRescheduleModal, setShowRescheduleModal] = useState(false); // State to control RescheduleModal visibility


  const handleSaveNotes = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onEditNotes(appointment.id, editedNotes);
      setIsEditingNotes(false);
      setIsSubmitting(false);
    }, 800);
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      alert('Please select both date and time');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onReschedule(appointment.id, rescheduleData.date, rescheduleData.time);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const statusColors = {
    confirmed: '#10B981',
    pending: '#F59E0B',
    completed: '#3B82F6',
    cancelled: '#EF4444'
  };

  const getStatusIcon = () => {
    switch(appointment?.status) {
      case 'confirmed': return <FiCheckCircle className={styles.statusIcon} />;
      case 'pending': return <FiClock className={styles.statusIcon} />;
      case 'completed': return <FiCheckCircle className={styles.statusIcon} />;
      case 'cancelled': return <FiX className={styles.statusIcon} />;
      default: return <FiAlertCircle className={styles.statusIcon} />;
    }
  };

  return (
    <AnimatePresence>
      {appointment && (
        <motion.div 
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className={styles.modalContainer}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.headerContent}>
                <FiCalendar className={styles.headerIcon} />
                <h2>Appointment Details</h2>
              </div>
              <button 
                className={styles.closeButton}
                onClick={onClose}
                disabled={isSubmitting}
              >
                <FiX />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.appointmentHeader}>
                <h3 className={styles.appointmentTitle}>{appointment.title}</h3>
                <div 
                  className={styles.statusBadge}
                  style={{ backgroundColor: statusColors[appointment.status] }}
                >
                  {getStatusIcon()}
                  <span>{appointment.status}</span>
                </div>
              </div>
              
              <div className={styles.detailGrid}>
                <div className={styles.detailCard}>
                  <div className={styles.detailIconContainer}>
                    <FiCalendar className={styles.detailIcon} />
                  </div>
                  <div>
                    <p className={styles.detailLabel}>Date</p>
                    <p className={styles.detailValue}>{appointment.date}</p>
                  </div>
                </div>
                
                <div className={styles.detailCard}>
                  <div className={styles.detailIconContainer}>
                    <FiClock className={styles.detailIcon} />
                  </div>
                  <div>
                    <p className={styles.detailLabel}>Time</p>
                    <p className={styles.detailValue}>{appointment.time}</p>
                  </div>
                </div>
                
                <div className={styles.detailCard}>
                  <div className={styles.detailIconContainer}>
                    <FiUser className={styles.detailIcon} />
                  </div>
                  <div>
                    <p className={styles.detailLabel}>Doctor</p>
                    <p className={styles.detailValue}>{appointment.doctor}</p>
                  </div>
                </div>
                
                <div className={styles.detailCard}>
                  <div className={styles.detailIconContainer}>
                    <FiAlertCircle className={styles.detailIcon} />
                  </div>
                  <div>
                    <p className={styles.detailLabel}>Type</p>
                    <p className={styles.detailValue}>{appointment.type}</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.notesSection}>
                <div className={styles.sectionHeader}>
                  <FiFileText className={styles.sectionIcon} />
                  <h4>Appointment Notes</h4>
                  {!isEditingNotes && appointment.status !== 'cancelled' && (
                    <button 
                      className={styles.editButton}
                      onClick={() => setIsEditingNotes(true)}
                    >
                      <FiEdit2 size={14} /> Edit
                    </button>
                  )}
                </div>
                
                {isEditingNotes ? (
                  <div className={styles.notesEditor}>
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Enter notes about this appointment..."
                      rows="4"
                      className={styles.notesTextarea}
                    />
                    <div className={styles.notesActions}>
                      <button 
                        className={styles.cancelEditButton}
                        onClick={() => {
                          setIsEditingNotes(false);
                          setEditedNotes(appointment.notes);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button 
                        className={styles.saveNotesButton}
                        onClick={handleSaveNotes}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Notes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.notesContent}>
                    {appointment.notes || 'No additional notes provided.'}
                  </p>
                )}
              </div>
              
              {appointment.status !== 'cancelled' && (
                <div className={styles.rescheduleSection}>
                  <h4 className={styles.sectionTitle}>Reschedule Appointment</h4>
                  <div className={styles.rescheduleForm}>
                    <div className={styles.formGroup}>
                      <label>New Date</label>
                      <input
                        type="date"
                        value={rescheduleData.date}
                        onChange={(e) => setRescheduleData({
                          ...rescheduleData,
                          date: e.target.value
                        })}
                        min={new Date().toISOString().split('T')[0]}
                        className={styles.dateInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>New Time</label>
                      <input
                        type="time"
                        value={rescheduleData.time}
                        onChange={(e) => setRescheduleData({
                          ...rescheduleData,
                          time: e.target.value
                        })}
                        className={styles.timeInput}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className={styles.modalFooter}>
              {appointment.status !== 'cancelled' && (
                <>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => onCancel(appointment.id)}
                    disabled={isSubmitting}
                  >
                    <FiTrash2 className={styles.buttonIcon} />
                    Cancel Appointment
                  </button>
                    <button 
                      className={styles.rescheduleButton}
                      onClick={() => setShowRescheduleModal(true)} // Open RescheduleModal
                      disabled={isSubmitting}
                    >
                      <FiEdit2 className={styles.buttonIcon} />
                      Reschedule
                    </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
            <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        appointment={appointment}
        onReschedule={handleRescheduleSubmit}
      />
    </AnimatePresence>
    
  );
};

export default AppointmentViewModal;