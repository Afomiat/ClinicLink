import React, { useState, useEffect } from 'react';
import { 
  FaTimes,
  FaUser,
  FaIdCard,
  FaFlask,
  FaUserMd,
  FaCalendarAlt,
  FaNotesMedical,
  FaFileAlt,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import styles from './UpdateOrderModal.module.css';

const UpdateOrderModal = ({ order, onClose, onSave }) => {
  // Default empty order structure
  const defaultOrder = {
    id: '',
    patientName: '',
    patientId: '',
    tests: [''],
    orderingPhysician: '',
    dateOrdered: new Date().toISOString().slice(0, 16), // Format for datetime-local input
    dateCompleted: '',
    urgency: 'routine',
    status: 'pending',
    specialInstructions: ''
  };

  const [formData, setFormData] = useState(defaultOrder);

  // Initialize form data when component mounts or order changes
  useEffect(() => {
    if (order) {
      setFormData({
        id: order.id || '',
        patientName: order.patientName || '',
        patientId: order.patientId || '',
        tests: order.tests?.length ? [...order.tests] : [''],
        orderingPhysician: order.orderingPhysician || '',
        dateOrdered: order.dateOrdered || new Date().toISOString().slice(0, 16),
        dateCompleted: order.dateCompleted || '',
        urgency: order.urgency || 'routine',
        status: order.status || 'pending',
        specialInstructions: order.specialInstructions || ''
      });
    } else {
      setFormData(defaultOrder);
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestChange = (index, value) => {
    const updatedTests = [...formData.tests];
    updatedTests[index] = value;
    setFormData(prev => ({
      ...prev,
      tests: updatedTests
    }));
  };

  const addTest = () => {
    setFormData(prev => ({
      ...prev,
      tests: [...prev.tests, '']
    }));
  };

  const removeTest = (index) => {
    const updatedTests = formData.tests.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      tests: updatedTests.length > 0 ? updatedTests : ['']
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedOrder = {
      ...formData,
      // Ensure dateCompleted is cleared if status isn't completed
      dateCompleted: formData.status === 'completed' 
        ? formData.dateCompleted || new Date().toISOString() 
        : ''
    };
    onSave(updatedOrder);
    onClose();
  };

  // If no order is provided and we're not in create mode, show error
  if (!order && !formData.id) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.updateModalContainer}>
          <div className={styles.modalHeader}>
            <h2>Error: No Order Selected</h2>
            <button onClick={onClose} className={styles.closeButton}>
              <FaTimes />
            </button>
          </div>
          <div className={styles.updateForm}>
            <p>No order was provided for editing.</p>
            <div className={styles.formActions}>
              <button onClick={onClose} className={styles.cancelButton}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.updateModalContainer}>
        <div className={styles.modalHeader}>
          <h2>
            <FaFileAlt className={styles.headerIcon} />
            {formData.id ? `Update Lab Order: ${formData.id}` : 'Create New Lab Order'}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.updateForm}>
          {/* Patient Information Section */}
          <div className={styles.formSection}>
            <h3>
              <FaUser className={styles.sectionIcon} />
              Patient Information
            </h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="patientName" className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className={styles.formControl}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="patientId" className={styles.formLabel}>
                  <FaIdCard className={styles.sectionIcon} /> Patient ID
                </label>
                <input
                  type="text"
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className={styles.formControl}
                  required
                />
              </div>
            </div>
          </div>

          {/* Test Information Section */}
          <div className={styles.formSection}>
            <h3>
              <FaFlask className={styles.sectionIcon} />
              Test Information
            </h3>
            {formData.tests.map((test, index) => (
              <div key={index} className={styles.testItem}>
                <div className={styles.formGroup}>
                  <label htmlFor={`test-${index}`} className={styles.formLabel}>
                    Test #{index + 1}
                  </label>
                  <input
                    type="text"
                    id={`test-${index}`}
                    value={test}
                    onChange={(e) => handleTestChange(index, e.target.value)}
                    className={styles.formControl}
                    required
                  />
                </div>
                {formData.tests.length > 1 && (
                  <div className={styles.testActions}>
                    <button
                      type="button"
                      onClick={() => removeTest(index)}
                      className={styles.removeTestButton}
                    >
                      <FaTrash /> Remove Test
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTest}
              className={styles.addTestButton}
            >
              <FaPlus /> Add Test
            </button>
          </div>

          {/* Order Information Section */}
          <div className={styles.formSection}>
            <h3>
              <FaNotesMedical className={styles.sectionIcon} />
              Order Information
            </h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="orderingPhysician" className={styles.formLabel}>
                  <FaUserMd className={styles.sectionIcon} /> Ordering Physician
                </label>
                <input
                  type="text"
                  id="orderingPhysician"
                  name="orderingPhysician"
                  value={formData.orderingPhysician}
                  onChange={handleChange}
                  className={styles.formControl}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="dateOrdered" className={styles.formLabel}>
                  <FaCalendarAlt className={styles.sectionIcon} /> Date Ordered
                </label>
                <input
                  type="datetime-local"
                  id="dateOrdered"
                  name="dateOrdered"
                  value={formData.dateOrdered}
                  onChange={handleChange}
                  className={styles.formControl}
                  required
                />
              </div>
              {formData.status === 'completed' && (
                <div className={styles.formGroup}>
                  <label htmlFor="dateCompleted" className={styles.formLabel}>
                    <FaCalendarAlt className={styles.sectionIcon} /> Date Completed
                  </label>
                  <input
                    type="datetime-local"
                    id="dateCompleted"
                    name="dateCompleted"
                    value={formData.dateCompleted}
                    onChange={handleChange}
                    className={styles.formControl}
                  />
                </div>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="urgency" className={styles.formLabel}>Urgency</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className={`${styles.formControl} ${styles.selectControl}`}
                  required
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.formLabel}>Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`${styles.formControl} ${styles.selectControl}`}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Special Instructions Section */}
          <div className={styles.formSection}>
            <h3>Special Instructions</h3>
            <div className={styles.formGroup}>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                className={`${styles.formControl} ${styles.textareaControl}`}
                placeholder="Enter any special instructions for this lab order..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
            >
              {formData.id ? 'Save Changes' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderModal;