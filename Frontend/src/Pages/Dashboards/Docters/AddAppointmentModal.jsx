import React, { useState } from 'react';
import styles from './AppointmentPage.module.css';

const AddAppointmentModal = ({ onClose, onAddAppointment }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    reason: '',
    date: '',
    time: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Patient name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.age || isNaN(formData.age)) newErrors.age = 'Valid age is required';
    if (!formData.reason) newErrors.reason = 'Reason is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onAddAppointment({
        ...formData,
        id: Date.now(),
        status: 'pending',
        image: 'https://via.placeholder.com/40'
      });
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add Appointment</h2>
        <form onSubmit={handleSubmit}>
  <div className={styles.formGroup}>
    <label>Patient Name</label>
    <input name="name" value={formData.name} onChange={handleChange} />
    {errors.name && <span className={styles.error}>{errors.name}</span>}
  </div>

  {/* Gender and Age side by side */}
  <div className={styles.formRow}>
    <div className={styles.formGroupHalf}>
      <label>Gender</label>
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && <span className={styles.error}>{errors.gender}</span>}
    </div>

    <div className={styles.formGroupHalf}>
      <label>Age</label>
      <input type="number" name="age" value={formData.age} onChange={handleChange} />
      {errors.age && <span className={styles.error}>{errors.age}</span>}
    </div>
  </div>

  {/* Room Number */}
  <div className={styles.formGroup}>
    <label>Room Number</label>
    <input name="roomNumber" value={formData.roomNumber || ''} onChange={handleChange} />
  </div>

  <div className={styles.formGroup}>
    <label>Reason</label>
    <input name="reason" value={formData.reason} onChange={handleChange} />
    {errors.reason && <span className={styles.error}>{errors.reason}</span>}
  </div>

  <div className={styles.formRow}>
    <div className={styles.formGroupHalf}>
      <label>Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} />
      {errors.date && <span className={styles.error}>{errors.date}</span>}
    </div>

    <div className={styles.formGroupHalf}>
      <label>Time</label>
      <input type="time" name="time" value={formData.time} onChange={handleChange} />
      {errors.time && <span className={styles.error}>{errors.time}</span>}
    </div>
  </div>

  

  <div className={styles.formActions}>
    <button type="submit" className={styles.submitButton}>Add</button>
    <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
  </div>
</form>

      </div>
    </div>
  );
};

export default AddAppointmentModal;