import React, { useState } from 'react';
import { 
  FaVial, 
  FaCalendarAlt, 
  FaTimes,
  FaPlus,
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import styles from './LabOrderModal.module.css';

const LabOrderModal = ({ isOpen, onClose, onSave }) => {
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    patientId: '',
  });

  const [labOrders, setLabOrders] = useState([
    {
      id: Date.now(),
      testName: '',
      testCode: '',
      testCategory: '',
      urgency: 'Routine',
      reason: '',
      notes: '',
      dateRequested: new Date().toISOString().split('T')[0]
    }
  ]);

  const [errors, setErrors] = useState({});

  const testCategories = [
    'Hematology',
    'Biochemistry',
    'Microbiology',
    'Immunology',
    'Radiology',
    'Pathology',
    'Molecular Diagnostics'
  ];

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLabOrderChange = (id, field, value) => {
    setLabOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { ...order, [field]: value }
          : order
      )
    );
  };

  const addLabOrder = () => {
    setLabOrders(prev => [
      ...prev,
      {
        id: Date.now(),
        testName: '',
        testCode: '',
        testCategory: '',
        urgency: 'Routine',
        reason: '',
        notes: '',
        dateRequested: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  const removeLabOrder = (id) => {
    if (labOrders.length > 1) {
      setLabOrders(prev => prev.filter(order => order.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate patient info
    if (!patientInfo.fullName) newErrors.fullName = 'Full name is required';
    if (!patientInfo.patientId) newErrors.patientId = 'Patient ID is required';
    
    // Validate lab orders
    labOrders.forEach((order, index) => {
      if (!order.testName) newErrors[`testName-${index}`] = 'Test name is required';
      if (!order.testCategory) newErrors[`testCategory-${index}`] = 'Test category is required';
      if (!order.reason) newErrors[`reason-${index}`] = 'Reason is required';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        patient: patientInfo,
        labOrders
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
            <FaVial className={styles.headerIcon} />
            New Lab Order
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.labOrderForm}>
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

          {/* Lab Orders Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionNumber}>2</div>
              <h3>Lab Order Details</h3>
            </div>

            {labOrders.map((order, index) => (
              <div key={order.id} className={styles.labOrderItem}>
                <div className={styles.labOrderHeader}>
                  <h4>Test #{index + 1}</h4>
                  {labOrders.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeLabOrder(order.id)}
                      className={styles.removeButton}
                    >
                      Remove Test
                    </button>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${errors[`testName-${index}`] ? styles.error : ''}`}>
                    <label>Test Name</label>
                    <input
                      type="text"
                      value={order.testName}
                      onChange={(e) => handleLabOrderChange(order.id, 'testName', e.target.value)}
                      placeholder="Complete Blood Count"
                    />
                    {errors[`testName-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`testName-${index}`]}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Test Code (Optional)</label>
                    <input
                      type="text"
                      value={order.testCode}
                      onChange={(e) => handleLabOrderChange(order.id, 'testCode', e.target.value)}
                      placeholder="CBC"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${errors[`testCategory-${index}`] ? styles.error : ''}`}>
                    <label>Test Category</label>
                    <select
                      value={order.testCategory}
                      onChange={(e) => handleLabOrderChange(order.id, 'testCategory', e.target.value)}
                    >
                      <option value="">Select category</option>
                      {testCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors[`testCategory-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`testCategory-${index}`]}
                      </span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label>Urgency Level</label>
                    <div className={styles.urgencyOptions}>
                      <label className={`${styles.urgencyOption} ${order.urgency === 'Routine' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name={`urgency-${order.id}`}
                          value="Routine"
                          checked={order.urgency === 'Routine'}
                          onChange={() => handleLabOrderChange(order.id, 'urgency', 'Routine')}
                        />
                        Routine
                      </label>
                      <label className={`${styles.urgencyOption} ${order.urgency === 'Urgent' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name={`urgency-${order.id}`}
                          value="Urgent"
                          checked={order.urgency === 'Urgent'}
                          onChange={() => handleLabOrderChange(order.id, 'urgency', 'Urgent')}
                        />
                        Urgent
                      </label>
                      <label className={`${styles.urgencyOption} ${order.urgency === 'Stat' ? styles.selected : ''}`}>
                        <input
                          type="radio"
                          name={`urgency-${order.id}`}
                          value="Stat"
                          checked={order.urgency === 'Stat'}
                          onChange={() => handleLabOrderChange(order.id, 'urgency', 'Stat')}
                        />
                        Stat
                      </label>
                    </div>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.fullWidth} ${errors[`reason-${index}`] ? styles.error : ''}`}>
                    <label>Reason / Clinical Notes</label>
                    <textarea
                      value={order.reason}
                      onChange={(e) => handleLabOrderChange(order.id, 'reason', e.target.value)}
                      placeholder="Explain why this test is being ordered..."
                      rows={3}
                    />
                    {errors[`reason-${index}`] && (
                      <span className={styles.errorMessage}>
                        <FaInfoCircle /> {errors[`reason-${index}`]}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Additional Notes (Optional)</label>
                    <textarea
                      value={order.notes}
                      onChange={(e) => handleLabOrderChange(order.id, 'notes', e.target.value)}
                      placeholder="Any special instructions for the lab..."
                      rows={2}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Date Requested</label>
                    <input
                      type="date"
                      value={order.dateRequested}
                      onChange={(e) => handleLabOrderChange(order.id, 'dateRequested', e.target.value)}
                    />
                  </div>
                </div>

                {order.urgency === 'Stat' && (
                  <div className={styles.statWarning}>
                    <FaExclamationTriangle />
                    <span>STAT orders will be prioritized and processed immediately</span>
                  </div>
                )}
              </div>
            ))}

            <button 
              type="button" 
              onClick={addLabOrder}
              className={styles.addButton}
            >
              <FaPlus /> Add Another Test
            </button>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Submit Lab Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabOrderModal;