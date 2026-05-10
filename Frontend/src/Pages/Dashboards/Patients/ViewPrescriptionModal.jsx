import React from 'react';
import { 
  FaPills, 
  FaTimes, 
  FaUserMd, 
  FaCalendarAlt,
  FaPrint,
  FaFileMedicalAlt
} from 'react-icons/fa';
import styles from './ViewPrescriptionModal.module.css';

const ViewPrescriptionModal = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescription: ${prescription.medication}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
            body {
              font-family: 'Poppins', sans-serif;
              line-height: 1.6;
              color: #2d3748;
              padding: 30px;
              background-color: #f8fafc;
            }
            .prescription-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .clinic-info {
              text-align: right;
            }
            .clinic-name {
              font-size: 1.5rem;
              font-weight: 600;
              color: #3182ce;
              margin-bottom: 5px;
            }
            .healthplus-logo {
              font-size: 1.8rem;
              font-weight: 700;
              color: #3182ce;
              margin-bottom: 5px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 1.2rem;
              font-weight: 500;
              color: #3182ce;
              margin-bottom: 15px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e2e8f0;
            }
            .patient-info {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 15px;
            }
            .info-item {
              margin-bottom: 10px;
            }
            .label {
              font-weight: 500;
              color: #4a5568;
              display: block;
              margin-bottom: 3px;
              font-size: 0.9rem;
            }
            .value {
              font-weight: 400;
              color: #2d3748;
            }
            .medication {
              background: #f8fafc;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              border-left: 4px solid #3182ce;
            }
            .medication-name {
              font-size: 1.1rem;
              font-weight: 500;
              color: #2d3748;
              margin-bottom: 15px;
            }
            .medication-details {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 15px;
            }
            .signature-area {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px dashed #cbd5e0;
              width: 300px;
            }
            .signature-line {
              margin-top: 40px;
              border-top: 1px solid #2d3748;
              width: 200px;
            }
            .footer-note {
              margin-top: 30px;
              font-size: 0.8rem;
              color: #718096;
              text-align: center;
            }
            .rx-symbol {
              font-size: 1.5rem;
              color: #3182ce;
              margin-right: 10px;
            }
            @media print {
              body {
                padding: 0;
                background: white;
              }
              .prescription-container {
                box-shadow: none;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="prescription-container">
            <div class="header">
              <div>
                <div style="display: flex; align-items: center;">
                  <span class="rx-symbol">℞</span>
                  <h2 style="margin: 0;">PRESCRIPTION</h2>
                </div>
                <div style="font-size: 0.9rem; color: #718096;">
                  Date Printed: ${new Date().toLocaleString()}
                </div>
              </div>
              <div class="clinic-info">
                <div class="healthplus-logo">HEALTHPLUS</div>
                <div>Comprehensive Healthcare Solutions</div>
                <div>456 Wellness Avenue</div>
                <div>Medicity, ST 54321</div>
                <div>Phone: (555) 987-6543</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">PATIENT INFORMATION</div>
              <div class="patient-info">
                <div class="info-item">
                  <span class="label">Patient Name</span>
                  <span class="value">${prescription.patientName || 'Sarah Johnson'}</span>
                </div>
                <div class="info-item">
                  <span class="label">Date of Birth</span>
                  <span class="value">${prescription.dob || '01/01/1980'}</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">PRESCRIBED MEDICATION</div>
              <div class="medication">
                <div class="medication-name">${prescription.medication}</div>
                <div class="medication-details">
                  <div class="info-item">
                    <span class="label">Dosage</span>
                    <span class="value">${prescription.dosage}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Instructions</span>
                    <span class="value">${prescription.instructions}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Quantity</span>
                    <span class="value">${prescription.quantity || '30'}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Refills</span>
                    <span class="value">${prescription.refills || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">PRESCRIBING PHYSICIAN</div>
              <div class="patient-info">
                <div class="info-item">
                  <span class="label">Name</span>
                  <span class="value">Dr. ${prescription.doctor}</span>
                </div>
                <div class="info-item">
                  <span class="label">Date Prescribed</span>
                  <span class="value">${new Date(prescription.date).toLocaleDateString()}</span>
                </div>
                <div class="info-item">
                  <span class="label">HealthPlus ID</span>
                  <span class="value">HP-${Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
              </div>
            </div>
            
            <div class="signature-area">
              <div style="margin-bottom: 5px;">Physician Signature:</div>
              <div class="signature-line"></div>
              <div style="margin-top: 5px; font-size: 0.9rem; color: #718096;">
                Dr. ${prescription.doctor}
              </div>
            </div>
            
            <div class="footer-note">
              This HealthPlus prescription is valid for fulfillment at any participating pharmacy.<br />
              For questions, please contact HealthPlus at (555) 987-6543.
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.viewModal}>
        <div className={styles.modalHeader}>
          <h2>
            <FaFileMedicalAlt className={styles.headerIcon} />
            Prescription Details
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.prescriptionDetail}>
          {/* <div className={styles.healthplusHeader}>
            <div className={styles.healthplusLogo}>HEALTHPLUS</div>
            <div className={styles.healthplusTagline}>Your Trusted Healthcare Partner</div>
          </div> */}

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <FaPills className={styles.sectionIcon} />
              Medication Information
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Medication</span>
                <span className={styles.detailValue}>{prescription.medication}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dosage</span>
                <span className={styles.detailValue}>{prescription.dosage}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.detailValue} ${styles.statusBadge} ${prescription.status === 'active' ? styles.active : styles.inactive}`}>
                  {prescription.status}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>HealthPlus ID</span>
                <span className={styles.detailValue}>HP-${Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <FaCalendarAlt className={styles.sectionIcon} />
              Prescription Dates
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date Prescribed</span>
                <span className={styles.detailValue}>
                  {new Date(prescription.date).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Filled</span>
                <span className={styles.detailValue}>
                  {prescription.lastFilled ? new Date(prescription.lastFilled).toLocaleDateString() : 'Not filled yet'}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>
              <FaUserMd className={styles.sectionIcon} />
              Prescribing Doctor
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Doctor</span>
                <span className={styles.detailValue}>Dr. {prescription.doctor}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Specialty</span>
                <span className={styles.detailValue}>{prescription.specialty || 'HealthPlus General Practice'}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3 className={styles.sectionTitle}>Instructions</h3>
            <div className={styles.instructions}>
              {prescription.instructions}
              <div className={styles.healthplusNote}>
                <strong>HealthPlus Note:</strong> Please follow these instructions carefully. Contact HealthPlus if you have any questions.
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button 
              onClick={handlePrint}
              className={styles.printButton}
            >
              <FaPrint /> Print Prescription
            </button>
            <button 
              onClick={onClose}
              className={styles.closeDetailButton}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescriptionModal;