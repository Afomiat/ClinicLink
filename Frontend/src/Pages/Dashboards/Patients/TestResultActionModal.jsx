import React from 'react';
import { FaEye, FaPrint, FaTimes } from 'react-icons/fa';
import styles from './TestResultActionModal.module.css';


const TestResultActionModal = ({ result, onClose, onView, onPrint }) => {
  if (!result) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Test Result Actions</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.actionButtons}>
            <button 
              className={styles.actionButton}
              onClick={() => {
                onView(result);
                onClose();
              }}
            >
              <FaEye className={styles.buttonIcon} />
              View Details
            </button>
            <button 
              className={styles.actionButton}
              onClick={() => {
                onPrint(result);
                onClose();
              }}
            >
              <FaPrint className={styles.buttonIcon} />
              Print Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultActionModal;