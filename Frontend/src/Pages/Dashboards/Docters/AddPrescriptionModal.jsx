import React, { useState, useEffect } from 'react';
import styles from './PatientProfileDoc.module.css';

const AddPrescriptionModal = ({ onClose, onAddPrescription }) => {
  const [formData, setFormData] = useState({
    description: '',
    dosage: '',
    date: '',
    duration: ''
  });

  const [errors, setErrors] = useState({});

  // Set today's date as default when component mounts
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.dosage) newErrors.dosage = 'Dosage is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddPrescription({
        ...formData,
        date: new Date(formData.date).toISOString().split('T')[0]
      });
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add Prescription</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Amoxicillin"
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Dosage</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g. 500mg"
            />
            {errors.dosage && <span className={styles.error}>{errors.dosage}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className={styles.error}>{errors.date}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g. 7 days"
            />
            {errors.duration && <span className={styles.error}>{errors.duration}</span>}
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;