import React from 'react';
import { 
  FaPills, 
  FaCalendarAlt, 
  FaTimes,
  FaUser,
  FaIdCard,
  FaPrint,
  FaUserMd,
  FaClinicMedical,
  FaFilePrescription
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
          <title>Prescription: ${prescription.id}</title>
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
            .section {
              margin-bottom: 25px;
              page-break-inside: avoid;
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
            @page {
              size: auto;
              margin: 10mm;
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
                  <h2 style="margin: 0;">PRESCRIPTION #${prescription.id}</h2>
                </div>
                <div style="font-size: 0.9rem; color: #718096;">
                  Date Printed: ${new Date().toLocaleString()}
                </div>
              </div>
              <div class="clinic-info">
                <div class="clinic-name">HEALTHCARE CLINIC</div>
                <div>123 Medical Drive, Suite 100</div>
                <div>Anytown, ST 12345</div>
                <div>Phone: (555) 123-4567</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">PATIENT INFORMATION</div>
              <div class="patient-info">
                <div class="info-item">
                  <span class="label">Full Name</span>
                  <span class="value">${prescription.patient.fullName}</span>
                </div>
                <div class="info-item">
                  <span class="label">Patient ID</span>
                  <span class="value">${prescription.patient.patientId}</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">PRESCRIBED MEDICATIONS</div>
              ${prescription.prescriptions.map(med => `
                <div class="medication">
                  <div class="medication-name">${med.medication} <span style="color: #718096; font-weight: 400;">(${med.form})</span></div>
                  <div class="medication-details">
                    <div class="info-item">
                      <span class="label">Dosage</span>
                      <span class="value">${med.dosage}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Frequency</span>
                      <span class="value">${med.frequency}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Duration</span>
                      <span class="value">${med.duration}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Quantity</span>
                      <span class="value">${med.quantity}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Instructions</span>
                      <span class="value">${med.instructions || 'Take as directed'}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Dates</span>
                      <span class="value">${new Date(med.startDate).toLocaleDateString()} - ${new Date(med.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div class="section">
              <div class="section-title">PRESCRIBING PHYSICIAN</div>
              <div class="patient-info">
                <div class="info-item">
                  <span class="label">Name</span>
                  <span class="value">Dr. Sarah Johnson</span>
                </div>
                <div class="info-item">
                  <span class="label">License Number</span>
                  <span class="value">MD-123456</span>
                </div>
                <div class="info-item">
                  <span class="label">Date Prescribed</span>
                  <span class="value">${new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div class="signature-area">
              <div style="margin-bottom: 5px;">Physician Signature:</div>
              <div class="signature-line"></div>
              <div style="margin-top: 5px; font-size: 0.9rem; color: #718096;">
                Dr. Sarah Johnson
              </div>
            </div>
            
            <div class="footer-note">
              This is a valid medical prescription. Please present to pharmacy for fulfillment.<br />
              For questions, please contact our office at (555) 123-4567.
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
      <div className={styles.viewModalContainer}>
        <div className={styles.modalHeader}>
          <h2>
            <FaFilePrescription className={styles.headerIcon} />
            Prescription Details
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.viewModalContent}>
          {/* Patient Information Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaUser className={styles.sectionIcon} />
              <h3>Patient Information</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Full Name</span>
                <span className={styles.detailValue}>{prescription.patient.fullName}</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaIdCard className={styles.inlineIcon} /> Patient ID
                </span>
                <span className={styles.detailValue}>{prescription.patient.patientId}</span>
              </div>
            </div>
          </div>

          {/* Prescriptions Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaPills className={styles.sectionIcon} />
              <h3>Prescription Details</h3>
            </div>

            <div className={styles.medicationsContainer}>
              {prescription.prescriptions.map((medication, index) => (
                <div key={index} className={styles.medicationDetail}>
                  <div className={styles.medicationHeader}>
                    <h4>Medication #{index + 1}</h4>
                    <span className={styles.statusBadge}>
                      {prescription.status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  
                  <div className={styles.medicationName}>
                    {medication.medication} <span>({medication.form})</span>
                  </div>
                  
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Dosage</span>
                      <span className={styles.detailValue}>{medication.dosage}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Frequency</span>
                      <span className={styles.detailValue}>{medication.frequency}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Duration</span>
                      <span className={styles.detailValue}>{medication.duration}</span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Quantity</span>
                      <span className={styles.detailValue}>{medication.quantity}</span>
                    </div>
                  </div>
                  
                  <div className={styles.instructions}>
                    <span className={styles.detailLabel}>Instructions</span>
                    <p>{medication.instructions || 'Take as directed'}</p>
                  </div>
                  
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <FaCalendarAlt className={styles.inlineIcon} /> Start Date
                      </span>
                      <span className={styles.detailValue}>
                        {new Date(medication.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>
                        <FaCalendarAlt className={styles.inlineIcon} /> End Date
                      </span>
                      <span className={styles.detailValue}>
                        {new Date(medication.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescribing Information Section */}
          <div className={styles.detailSection}>
            <div className={styles.sectionHeader}>
              <FaUserMd className={styles.sectionIcon} />
              <h3>Prescribing Physician</h3>
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>Dr. Sarah Johnson</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>License Number</span>
                <span className={styles.detailValue}>MD-123456</span>
              </div>
              
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date Prescribed</span>
                <span className={styles.detailValue}>
                  {new Date().toLocaleDateString()}
                </span>
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
              <div className={styles.clinicName}>Healthcare Clinic</div>
              <div className={styles.clinicAddress}>
                123 Medical Drive, Suite 100<br />
                Anytown, ST 12345
              </div>
              <div className={styles.clinicContact}>
                Phone: (555) 123-4567<br />
                Email: info@healthcareclinic.com
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            <button 
              type="button" 
              onClick={handlePrint}
              className={styles.printButton}
            >
              <FaPrint /> Print Prescription
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

export default ViewPrescriptionModal;