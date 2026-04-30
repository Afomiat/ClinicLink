import React from 'react';
import { FiEye, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import styles from './PrescriptionPage.module.css';

const PrescriptionActionModal = ({ 
  prescription, 
  onClose, 
  onEdit, 
  onRefill, 
  onDelete,
  onView 
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Prescription Actions</h2>
        <div className={styles.modalActions}>
          <button 
            className={styles.actionButton}
            onClick={() => {
              onView(prescription);
              onClose();
            }}
          >
            <FiEye className={styles.actionIcon} /> View Details
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={() => {
              onEdit(prescription);
              onClose();
            }}
          >
            <FiEdit className={styles.actionIcon} /> Edit Prescription
          </button>

          {prescription.status !== 'active' && (
            <button 
              className={styles.actionButton}
              onClick={() => {
                onRefill(prescription);
                onClose();
              }}
            >
              <FiRefreshCw className={styles.actionIcon} /> Refill
            </button>
          )}
          
          <button 
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete prescription ${prescription.id}?`)) {
                onDelete(prescription.id);
              }
            }}
          >
            <FiTrash2 className={styles.actionIcon} /> Delete
          </button>
          
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionActionModal;