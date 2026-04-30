import React, { useState, useEffect } from 'react';
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
  FaBriefcaseMedical,
  FaTimes
} from 'react-icons/fa';
import styles from './PatientPage.module.css';

const AddPatientModal = ({ onClose, onAddPatient }) => {
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    age: '',
    gender: 'Male',
    phone: '',
    lastVisit: '',
    diagnosis: '',
    bloodType: 'A+',
    status: 'Active',
    height: '',
    weight: '',
    allergies: '',
    medications: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.age || isNaN(formData.age) || formData.age < 0 || formData.age > 120) 
      newErrors.age = 'Valid age (0-120) is required';
    if (!formData.phone.match(/^[0-9]{10,15}$/)) newErrors.phone = 'Valid phone number required';
    if (!formData.lastVisit) newErrors.lastVisit = 'Last visit date is required';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onAddPatient({
      ...formData,
      age: parseInt(formData.age),
      height: formData.height ? parseInt(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      lastVisit: new Date(formData.lastVisit).toISOString().split('T')[0],
      id: formData.id || `P${Math.floor(100000 + Math.random() * 900000)}`
    });
    
    setIsSubmitting(false);
    onClose();
  };

  // Auto-generate ID on mount
  useEffect(() => {
    const randomId = `P${Math.floor(100000 + Math.random() * 900000)}`;
    setFormData(prev => ({ ...prev, id: randomId }));
  }, []);

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.wideModal}`}>
        <div className={styles.modalHeader}>
          <div>
            <h2>Register New Patient</h2>
            <p>Complete all required fields to add a new patient record</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
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
                  {/* ID Field (auto-generated but editable) */}
                  <div className={styles.formGroup}>
                    <label>
                      <span className={styles.labelIcon}><FaIdCard /></span>
                      Patient ID
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleChange}
                      placeholder="Auto-generated"
                      className={styles.patientIdInput}
                    />
                  </div>

                  {/* Status */}
                  <div className={styles.formGroup}>
                    <label>Status</label>
                    <select
                      name="status"
                      value={formData.status}
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
                    value={formData.fullName}
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
                      value={formData.age}
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
                      value={formData.gender}
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
                    value={formData.phone}
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
                    value={formData.lastVisit}
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
                      value={formData.height}
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
                      value={formData.weight}
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
                    value={formData.bloodType}
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
                    value={formData.diagnosis}
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
                    value={formData.allergies}
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
                    value={formData.medications}
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
                  Registering...
                </>
              ) : (
                'Register Patient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;