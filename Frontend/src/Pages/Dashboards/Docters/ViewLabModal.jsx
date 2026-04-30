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
  CheckCircle2, 
  Hourglass, 
  Loader 
} from 'lucide-react';
import styles from './ViewLabModal.module.css';

const ViewLabModal = ({ order, onClose, onPrint }) => {
  if (!order) return null;

  const getStatusIcon = (status) => {
    const iconSize = 20;
    switch (status) {
      case 'pending':
        return <Hourglass size={iconSize} className={styles.statusPending} />;
      case 'in-progress':
        return <Loader size={iconSize} className={styles.statusInProgress} />;
      case 'completed':
        return <CheckCircle2 size={iconSize} className={styles.statusCompleted} />;
      default:
        return null;
    }
  };

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
      onPrint(order);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.viewModalContainer}>
        <div className={styles.modalHeader}>
          <h2>
            <FaFileMedical className={styles.headerIcon} />
            Lab Order Details
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.viewModalContent}>
          {/* Order Summary Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaVial className={styles.sectionIcon} />
              <h3>Order Summary</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Order ID</span>
                <span className={styles.detailValue}>{order.id}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <div className={styles.statusCell}>
                  {getStatusIcon(order.status)}
                  <span className={styles[`statusText${order.status.replace('-', '')}`]}>
                    {order.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaCalendarAlt className={styles.inlineIcon} /> Date Ordered
                </span>
                <span className={styles.detailValue}>{formatDate(order.dateOrdered)}</span>
              </div>
              
              {order.dateCompleted && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FaCalendarAlt className={styles.inlineIcon} /> Date Completed
                  </span>
                  <span className={styles.detailValue}>{formatDate(order.dateCompleted)}</span>
                </div>
              )}
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Urgency</span>
                <span className={styles[`urgency${order.urgency}`]}>
                  {order.urgency}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Information Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaUser className={styles.sectionIcon} />
              <h3>Patient Information</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Full Name</span>
                <span className={styles.detailValue}>{order.patientName}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaIdCard className={styles.inlineIcon} /> Patient ID
                </span>
                <span className={styles.detailValue}>{order.patientId}</span>
              </div>
            </div>
          </div>

          {/* Test Details Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaFlask className={styles.sectionIcon} />
              <h3>Test Details</h3>
            </div>

            <div className={styles.testsContainer}>
              {order.tests.map((test, index) => (
                <div key={index} className={styles.testDetail}>
                  <div className={styles.testHeader}>
                    <h4>{test}</h4>
                    {order.status === 'completed' && (
                      <span className={styles.resultBadge}>
                        Completed
                      </span>
                    )}
                  </div>
                  
                  {order.status === 'completed' && (
                    <>
                      <div className={styles.detailGrid}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Result</span>
                          <span className={styles.detailValue}>Normal</span>
                        </div>
                        
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Reference Range</span>
                          <span className={styles.detailValue}>Varies by test</span>
                        </div>
                      </div>
                      
                      <div className={styles.interpretation}>
                        <span className={styles.detailLabel}>Interpretation</span>
                        <p>Results are within normal limits. No further action required at this time.</p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ordering Information Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaUserMd className={styles.sectionIcon} />
              <h3>Ordering Information</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Ordering Physician</span>
                <span className={styles.detailValue}>{order.orderingPhysician}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Department</span>
                <span className={styles.detailValue}>Laboratory Services</span>
              </div>
            </div>
          </div>

          {/* Clinic Information Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaClinicMedical className={styles.sectionIcon} />
              <h3>Clinic Information</h3>
            </div>
            
            <div className={styles.clinicInfo}>
              <div className={styles.clinicName}>Healthcare Clinic Laboratory</div>
              <div className={styles.clinicAddress}>
                123 Medical Drive, Laboratory Wing<br />
                Anytown, ST 12345
              </div>
              <div className={styles.clinicContact}>
                Phone: (555) 987-6543 (Lab Direct)<br />
                Hours: Mon-Fri 7:00 AM - 7:00 PM
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            <button 
              type="button" 
              onClick={handlePrintClick}
              className={styles.printButton}
            >
              <FaPrint /> Print Lab Order
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelButton}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLabModal;