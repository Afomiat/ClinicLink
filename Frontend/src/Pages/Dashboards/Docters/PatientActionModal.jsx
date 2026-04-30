import React, { useState } from 'react';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from './PatientPage.module.css';

const PatientActionModal = ({ patient, onClose, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleViewProfile = () => {
    navigate(`/doctor/patients/${patient.id}`);
    onClose();
  };

  const confirmDelete = () => {
    onDelete(patient.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      {!showDeleteConfirm && (
        <div className={styles.modalContent}>
          <h2>Patient Actions</h2>
          <div className={styles.modalActions}>

            <button 
              className={styles.actionButton}
              onClick={handleViewProfile}
            >
              <FiEye className={styles.actionIcon} /> View Profile
            </button>

            <button 
              className={styles.actionButton}
              onClick={() => {
                onEdit(patient);
                onClose();
              }}
            >
              <FiEdit className={styles.actionIcon} /> Edit Patient
            </button>

            <button 
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => setShowDeleteConfirm(true)}
            >
              <FiTrash2 className={styles.actionIcon} /> Delete Patient
            </button>

            <button 
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles.confirmationModal}>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete <strong>{patient.fullName}</strong>?</p>
          <div className={styles.confirmationActions}>
            <button 
              className={`${styles.actionButton} ${styles.deleteConfitmButton}`} 
              onClick={confirmDelete}
            >
              Delete
            </button>
            <button 
              className={styles.cancelButton} 
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientActionModal;
