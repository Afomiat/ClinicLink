import React, { useState } from 'react';
import { FaPills, FaTimes, FaCheck, FaUserMd, FaPaperPlane } from 'react-icons/fa';
import styles from './RefillModal.module.css';

const RefillModal = ({ isOpen, onClose, prescriptions }) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [urgency, setUrgency] = useState('routine');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to your backend API
    console.log({
      prescription: selectedPrescription,
      urgency,
      message,
      doctor: selectedPrescription.doctor
    });
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.refillModal}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.modalHeader}>
          <FaPills className={styles.modalIcon} />
          <h2>Request Prescription Refill</h2>
          <p className={styles.modalSubtitle}>Your request will be sent to your doctor for approval</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.modalStep}>
              <h3>1. Select Prescription</h3>
              <div className={styles.prescriptionList}>
                {prescriptions.map(prescription => (
                  <div 
                    key={prescription.id}
                    className={`${styles.prescriptionOption} ${selectedPrescription?.id === prescription.id ? styles.selected : ''}`}
                    onClick={() => setSelectedPrescription(prescription)}
                  >
                    <div className={styles.prescriptionInfo}>
                      <h4>{prescription.medication}</h4>
                      <p>{prescription.dosage}</p>
                      <p className={styles.doctorInfo}>
                        <FaUserMd /> Dr. {prescription.doctor}
                      </p>
                    </div>
                    {selectedPrescription?.id === prescription.id && (
                      <FaCheck className={styles.checkIcon} />
                    )}
                  </div>
                ))}
              </div>

              {selectedPrescription && (
                <>
                  <h3>2. Request Details</h3>
                  <div className={styles.radioGroup}>
                    <label>Urgency:</label>
                    <div className={styles.radioOptions}>
                      <label className={styles.radioOption}>
                        <input 
                          type="radio" 
                          name="urgency" 
                          value="routine"
                          checked={urgency === 'routine'}
                          onChange={() => setUrgency('routine')}
                        />
                        <span>Routine (within 5 days)</span>
                      </label>
                      <label className={styles.radioOption}>
                        <input 
                          type="radio" 
                          name="urgency" 
                          value="urgent"
                          checked={urgency === 'urgent'}
                          onChange={() => setUrgency('urgent')}
                        />
                        <span>Urgent (within 48 hours)</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.textareaGroup}>
                    <label>Message to Doctor (Optional)</label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Example: I'm running low on this medication and need a refill..."
                    />
                  </div>
                </>
              )}
              
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.secondaryButton}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.primaryButton}
                  disabled={!selectedPrescription}
                >
                  <FaPaperPlane /> Send Request to Doctor
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.confirmationStep}>
            <div className={styles.successIcon}>
              <FaCheck />
            </div>
            <h3>Refill Request Sent!</h3>
            <p>Your request for <strong>{selectedPrescription.medication}</strong> has been sent to Dr. {selectedPrescription.doctor}.</p>
            
            <div className={styles.confirmationDetails}>
              <div className={styles.detailRow}>
                <span>Prescription ID:</span>
                <span>{selectedPrescription.originalPrescription.id}</span>
              </div>
              <div className={styles.detailRow}>
                <span>Urgency:</span>
                <span>{urgency === 'routine' ? 'Routine (5 days)' : 'Urgent (48 hours)'}</span>
              </div>
              {message && (
                <div className={styles.detailRow}>
                  <span>Your Message:</span>
                  <span>{message}</span>
                </div>
              )}
            </div>
            
            <button 
              className={styles.primaryButton}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefillModal;