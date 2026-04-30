import React from 'react';
import { FaEye, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import styles from './AppointmentActionModal.module.css';

const AppointmentActionModal = ({ appointment, onClose, onView, onCancel }) => {
  if (!appointment) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Appointment Actions</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.actionButtons}>
            <button 
              className={styles.actionButton}
              onClick={() => {
                onView(appointment);
                onClose();
              }}
            >
              <FaEye className={styles.buttonIcon} />
              View Details
            </button>
            
            {appointment.status !== 'cancelled' && (
              <button 
                className={styles.actionButton}
                onClick={() => {
                  onCancel(appointment);
                  onClose();
                }}
              >
                <FaTimes className={styles.buttonIcon} />
                Cancel Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentActionModal;