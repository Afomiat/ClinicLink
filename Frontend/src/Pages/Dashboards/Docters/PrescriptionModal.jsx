// src/components/Pages/Dashboards/PrescriptionModal.jsx
import React, { useState } from 'react';
import { 
  FaPills, 
  FaCalendarAlt, 
  FaTimes,
  FaPlus,
  FaMinus,
  FaInfoCircle
} from 'react-icons/fa';
import styles from './PrescriptionModal.module.css';

const PrescriptionModal = ({ isOpen, onClose, onSave }) => {
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    patientId: '',
  });

  const [prescriptions, setPrescriptions] = useState([
    {
      id: Date.now(),
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      form: 'Tablet',
      quantity: 1,
      startDate: '',
      endDate: ''
    }
  ]);

  const [errors, setErrors] = useState({});

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePrescriptionChange = (id, field, value) => {
    setPrescriptions(prev => 
      prev.map(prescription => 
        prescription.id === id 
          ? { ...prescription, [field]: value }
          : prescription
      )
    );
  };

  const addPrescription = () => {
    setPrescriptions(prev => [
      ...prev,
      {
        id: Date.now(),
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        form: 'Tablet',
        quantity: 1,
        startDate: '',
        endDate: ''
      }
    ]);
  };

  const removePrescription = (id) => {
    if (prescriptions.length > 1) {
      setPrescriptions(prev => prev.filter(p => p.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate patient info
    if (!patientInfo.fullName) newErrors.fullName = 'Full name is required';
    if (!patientInfo.patientId) newErrors.patientId = 'Patient ID is required';
    
    // Validate prescriptions
    prescriptions.forEach((prescription, index) => {
      if (!prescription.medication) newErrors[`medication-${index}`] = 'Medication is required';
      if (!prescription.dosage) newErrors[`dosage-${index}`] = 'Dosage is required';
      if (!prescription.frequency) newErrors[`frequency-${index}`] = 'Frequency is required';
      if (!prescription.duration) newErrors[`duration-${index}`] = 'Duration is required';
      if (!prescription.startDate) newErrors[`startDate-${index}`] = 'Start date is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        patient: patientInfo,
        prescriptions
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>
            <FaPills className={styles.headerIcon} />
            New Prescription
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.prescriptionForm}>
          {/* Patient Information Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>1</div>
              <h3>Patient Information</h3>
            </div>
            
            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${errors.fullName ? styles.error : ''}`}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={patientInfo.fullName}
                  onChange={handlePatientChange}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <span className={styles.errorMessage}>
                    <FaInfoCircle /> {errors.fullName}
                  </span>
                )}
              </div>

              <div className={`${styles.formGroup} ${errors.patientId ? styles.error : ''}`}>
                <label>Patient ID</label>
                <input
                  type="text"
                  name="patientId"
                  value={patientInfo.patientId}
                  onChange={handlePatientChange}
                  placeholder="P000123"
                />
                {errors.patientId && (
                  <span className={styles.errorMessage}>
                    <FaInfoCircle /> {errors.patientId}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>2</div>
              <h3>Prescription Details</h3>
            </div>

            {prescriptions.map((prescription, index) => (
              <div key={prescription.id} className={styles.prescriptionItem}>
                <div className={styles.prescriptionHeader}>
                  <h4>Medication #{index + 1}</h4>
                  {prescriptions.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removePrescription(prescription.id)}
                      className={styles.removeButton}
                    >
                      <FaMinus /> Remove
                    </button>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${errors[`medication-${index}`] ? styles.error : ''}`}>
                    <label>Medication Name</label>
                    <input
                      type="text"
                      value={prescription.medication}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'medication', e.target.value)}
                      placeholder="Amoxicillin"
                    />
                    {errors[`medication-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`medication-${index}`]}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${errors[`dosage-${index}`] ? styles.error : ''}`}>
                    <label>Dosage</label>
                    <input
                      type="text"
                      value={prescription.dosage}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'dosage', e.target.value)}
                      placeholder="500mg"
                    />
                    {errors[`dosage-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`dosage-${index}`]}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${errors[`frequency-${index}`] ? styles.error : ''}`}>
                    <label>Frequency</label>
                    <select
                      value={prescription.frequency}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'frequency', e.target.value)}
                    >
                      <option value="">Select frequency</option>
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="Four times daily">Four times daily</option>
                      <option value="As needed">As needed</option>
                    </select>
                    {errors[`frequency-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`frequency-${index}`]}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${errors[`duration-${index}`] ? styles.error : ''}`}>
                    <label>Duration</label>
                    <input
                      type="text"
                      value={prescription.duration}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'duration', e.target.value)}
                      placeholder="7 days"
                    />
                    {errors[`duration-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`duration-${index}`]}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Instructions</label>
                    <input
                      type="text"
                      value={prescription.instructions}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'instructions', e.target.value)}
                      placeholder="Take after meals"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Form</label>
                    <select
                      value={prescription.form}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'form', e.target.value)}
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Cream">Cream</option>
                      <option value="Drops">Drops</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={prescription.quantity}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'quantity', parseInt(e.target.value))}
                    />
                  </div>

                  <div className={`${styles.formGroup} ${errors[`startDate-${index}`] ? styles.error : ''}`}>
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={prescription.startDate}
                      onChange={(e) => {
                        handlePrescriptionChange(prescription.id, 'startDate', e.target.value);
                        // Auto-calculate end date if duration is set
                        if (prescription.duration) {
                          const days = parseInt(prescription.duration);
                          if (!isNaN(days)) {
                            const startDate = new Date(e.target.value);
                            const endDate = new Date(startDate);
                            endDate.setDate(startDate.getDate() + days);
                            handlePrescriptionChange(
                              prescription.id, 
                              'endDate', 
                              endDate.toISOString().split('T')[0]
                            );
                          }
                        }
                      }}
                    />
                    {errors[`startDate-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`startDate-${index}`]}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>End Date</label>
                    <input
                      type="date"
                      value={prescription.endDate}
                      onChange={(e) => handlePrescriptionChange(prescription.id, 'endDate', e.target.value)}
                      readOnly={!!prescription.duration}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addPrescription}
              className={styles.addButton}
            >
              <FaPlus /> Add Another Medication
            </button>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;