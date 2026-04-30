import React, { useState } from 'react';
import { 
  FaUserAlt, 
  FaPhoneAlt, 
  FaCalendarAlt, 
  FaNotesMedical, 
  FaVenusMars,
  FaIdCard,
  FaWeight,
  FaRulerVertical,
  FaHeartbeat,
  FaAllergies,
  FaBriefcaseMedical
} from 'react-icons/fa';
import styles from './PatientPage.module.css';

const EditPatientModal = ({ patient, onClose, onSave }) => {
  const [editedPatient, setEditedPatient] = useState({
    ...patient,
    height: patient.height || '',
    weight: patient.weight || '',
    allergies: patient.allergies || '',
    medications: patient.medications || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editedPatient.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!editedPatient.age || isNaN(editedPatient.age) || editedPatient.age < 0 || editedPatient.age > 120) 
      newErrors.age = 'Valid age (0-120) is required';
    if (!editedPatient.phone.match(/^[0-9]{10,15}$/)) newErrors.phone = 'Valid phone number required';
    if (!editedPatient.lastVisit) newErrors.lastVisit = 'Last visit date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onSave({
      ...editedPatient,
      age: parseInt(editedPatient.age),
      height: editedPatient.height ? parseInt(editedPatient.height) : null,
      weight: editedPatient.weight ? parseFloat(editedPatient.weight) : null,
      lastVisit: new Date(editedPatient.lastVisit).toISOString().split('T')[0]
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.wideModal}`}>
        <div className={styles.modalHeader}>
          <h2>Edit Patient Record: {editedPatient.fullName}</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        
        {/* Tab Navigation */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'basic' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'medical' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('medical')}
          >
            Medical Details
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.patientForm}>
          {activeTab === 'basic' ? (
            <>
              {/* Basic Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Personal Information</h3>
                
                <div className={styles.formRow}>
                  {/* ID Field (read-only) */}
                  <div className={styles.formGroup}>
                    <label>
                      <span className={styles.labelIcon}><FaIdCard /></span>
                      Patient ID
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={editedPatient.id}
                      readOnly
                      className={styles.patientIdInput}
                    />
                  </div>

                  {/* Status */}
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      name="status"
                      value={editedPatient.status || 'Active'}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Full Name */}
                <div className={`${styles.formGroup} ${errors.fullName ? styles.error : ''}`}>
                  <label>
                    <span className={styles.labelIcon}><FaUserAlt /></span>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={editedPatient.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    autoFocus
                  />
                  {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                </div>

                {/* Age and Gender Row */}
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${errors.age ? styles.error : ''}`}>
                    <label>
                      <span className={styles.labelIcon}><FaUserAlt /></span>
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={editedPatient.age}
                      onChange={handleChange}
                      min="0"
                      max="120"
                      placeholder="28"
                    />
                    {errors.age && <span className={styles.errorMessage}>{errors.age}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      <span className={styles.labelIcon}><FaVenusMars /></span>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editedPatient.gender}
                      onChange={handleChange}
                      className={styles.genderSelect}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Phone Number */}
                <div className={`${styles.formGroup} ${errors.phone ? styles.error : ''}`}>
                  <label>
                    <span className={styles.labelIcon}><FaPhoneAlt /></span>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editedPatient.phone}
                    onChange={handleChange}
                    placeholder="0912345678"
                  />
                  {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                </div>

                {/* Last Visit */}
                <div className={`${styles.formGroup} ${errors.lastVisit ? styles.error : ''}`}>
                  <label>
                    <span className={styles.labelIcon}><FaCalendarAlt /></span>
                    Last Visit *
                  </label>
                  <input
                    type="date"
                    name="lastVisit"
                    value={editedPatient.lastVisit}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.lastVisit && <span className={styles.errorMessage}>{errors.lastVisit}</span>}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Medical Information Section */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Medical Information</h3>
                
                <div className={styles.formRow}>
                  {/* Height and Weight */}
                  <div className={styles.formGroup}>
                    <label>
                      <span className={styles.labelIcon}><FaRulerVertical /></span>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={editedPatient.height}
                      onChange={handleChange}
                      min="50"
                      max="250"
                      placeholder="170"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      <span className={styles.labelIcon}><FaWeight /></span>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={editedPatient.weight}
                      onChange={handleChange}
                      min="2"
                      max="300"
                      step="0.1"
                      placeholder="70.5"
                    />
                  </div>
                </div>

                {/* Blood Type */}
                <div className={styles.formGroup}>
                  <label>
                    <span className={styles.labelIcon}><FaHeartbeat /></span>
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    value={editedPatient.bloodType || 'A+'}
                    onChange={handleChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                {/* Diagnosis */}
                <div className={`${styles.formGroup} ${errors.diagnosis ? styles.error : ''}`}>
                  <label>
                    <span className={styles.labelIcon}><FaNotesMedical /></span>
                    Primary Diagnosis *
                  </label>
                  <input
                    type="text"
                    name="diagnosis"
                    value={editedPatient.diagnosis}
                    onChange={handleChange}
                    placeholder="e.g., Hypertension"
                  />
                  {errors.diagnosis && <span className={styles.errorMessage}>{errors.diagnosis}</span>}
                </div>

                {/* Allergies */}
                <div className={styles.formGroup}>
                  <label>
                    <span className={styles.labelIcon}><FaAllergies /></span>
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={editedPatient.allergies}
                    onChange={handleChange}
                    placeholder="List any known allergies"
                    rows="3"
                  />
                </div>

                {/* Current Medications */}
                <div className={styles.formGroup}>
                  <label>
                    <span className={styles.labelIcon}><FaBriefcaseMedical /></span>
                    Current Medications
                  </label>
                  <textarea
                    name="medications"
                    value={editedPatient.medications}
                    onChange={handleChange}
                    placeholder="List current medications"
                    rows="3"
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;