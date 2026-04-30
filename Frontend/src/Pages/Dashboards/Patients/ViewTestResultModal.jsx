import React from 'react';
import { 
  FaVial, 
  FaUser, 
  FaIdCard, 
  FaCalendarAlt,
  FaPrint,
  FaTimes,
  FaUserMd,
  FaFlask,
  FaFileMedical,
  FaClinicMedical
} from 'react-icons/fa';
import { 
  CheckCircle, 
  Clock,
  AlertTriangle
} from 'react-feather';
import styles from './ViewTestResultModal.module.css';

const ViewTestResultModal = ({ result, onClose, onPrint }) => {
  if (!result) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint(result);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>
            <FaFileMedical className={styles.headerIcon} />
            Test Result Details
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalContent}>
          {/* Test Summary Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaVial className={styles.sectionIcon} />
              <h3>Test Summary</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Test Name</span>
                <span className={styles.detailValue}>{result.testName}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <div className={styles.statusCell}>
                  {result.status === 'completed' ? (
                    result.isAbnormal ? (
                      <AlertTriangle size={20} className={styles.statusAbnormal} />
                    ) : (
                      <CheckCircle size={20} className={styles.statusNormal} />
                    )
                  ) : (
                    <Clock size={20} className={styles.statusPending} />
                  )}
                  <span className={styles.statusText}>
                    {result.status}
                    {result.isAbnormal && ' (Abnormal)'}
                  </span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaCalendarAlt className={styles.inlineIcon} /> Date Collected
                </span>
                <span className={styles.detailValue}>{formatDate(result.date)}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Lab Facility</span>
                <span className={styles.detailValue}>{result.labName}</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaFlask className={styles.sectionIcon} />
              <h3>Test Results</h3>
            </div>

            <div className={styles.resultsContent}>
              <div className={styles.resultSummary}>
                <p className={result.isAbnormal ? styles.abnormalResult : styles.normalResult}>
                  {result.results}
                </p>
              </div>
              
              {result.status === 'completed' && (
                <div className={styles.resultDetails}>
                  <h4>Detailed Findings:</h4>
                  <ul className={styles.resultList}>
                    <li>All blood cell counts within normal range</li>
                    <li>Hemoglobin levels optimal</li>
                    <li>No signs of infection detected</li>
                    {result.isAbnormal && (
                      <li className={styles.abnormalItem}>Elevated levels detected - follow-up recommended</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Patient Information Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaUser className={styles.sectionIcon} />
              <h3>Patient Information</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Patient Name</span>
                <span className={styles.detailValue}>John Doe</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaIdCard className={styles.inlineIcon} /> Patient ID
                </span>
                <span className={styles.detailValue}>P12345678</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date of Birth</span>
                <span className={styles.detailValue}>January 15, 1980</span>
              </div>
            </div>
          </div>

          {/* Ordering Physician Section */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FaUserMd className={styles.sectionIcon} />
              <h3>Ordering Physician</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Doctor</span>
                <span className={styles.detailValue}>{result.doctor}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Specialty</span>
                <span className={styles.detailValue}>Primary Care</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            {/* <button 
              onClick={handlePrintClick}
              className={styles.printButton}
            >
              <FaPrint /> Print Results
            </button> */}
            <button 
              onClick={onClose}
              className={styles.closeModalButton}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTestResultModal;