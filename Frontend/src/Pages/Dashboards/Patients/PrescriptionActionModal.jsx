import React from 'react';
import { FiX, FiEye, FiRefreshCw } from 'react-icons/fi';
import styles from './PrescriptionActionModal.module.css';

const PrescriptionActionModal = ({ 
  prescription, 
  onClose, 
  onView, 
  onRefill 
}) => {
  if (!prescription) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Prescription Actions</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.actionButtons}>
            <button 
              className={styles.actionButton}
              onClick={() => {
                onView(prescription);
                onClose();
              }}
            >
              <FiEye className={styles.buttonIcon} />
              View Details
            </button>
            {prescription.medications.some(m => m.refills > 0) && (
              <button 
                className={styles.actionButton}
                onClick={() => {
                  onRefill(prescription);
                  onClose();
                }}
              >
                <FiRefreshCw className={styles.buttonIcon} />
                Request Refill
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionActionModal;