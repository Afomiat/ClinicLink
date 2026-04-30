import React from 'react';
import { FaEye, FaPrint, FaPencilAlt, FaTrash } from 'react-icons/fa';
import styles from './LabPage.module.css';

const LabOrderActionModal = ({ 
  order, 
  onClose, 
  onView, 
  onEdit, 
  onPrint,
  onDelete
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Order Actions</h2>
        <div className={styles.modalActions}>
          <button 
            className={styles.actionButton}
            onClick={() => {
              onView(order);
              onClose();
            }}
          >
            <FaEye className={styles.actionIcon} /> View Details
          </button>
          
          {order.status !== 'completed' && (
            <button 
              className={styles.actionButton}
              onClick={() => {
                onEdit(order);
                onClose();
              }}
            >
              <FaPencilAlt className={styles.actionIcon} /> Update Order
            </button>
          )}
          
          
          <button 
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
                onDelete(order.id);
              }
            }}
          >
            <FaTrash className={styles.actionIcon} /> Delete
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

export default LabOrderActionModal;