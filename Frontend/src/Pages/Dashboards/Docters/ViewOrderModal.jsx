import React from 'react';
import { 
  FaTimes,
  FaUser,
  FaIdCard,
  FaFlask,
  FaUserMd,
  FaCalendarAlt,
  FaNotesMedical,
  FaFileAlt,
  FaPrint,
} from 'react-icons/fa';
import styles from './ViewOrderModal.module.css';

const ViewOrderModal = ({ order, onClose }) => {
  if (!order) return null;
  const handlePrint = () => {
    const printContent = document.querySelector(`.${styles.viewModalContainer}`);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lab Order: ${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              color: #000;
              padding: 20px;
            }
            h2 {
              color: #000;
              margin-bottom: 15px;
            }
            .section {
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .test {
              border-left: 2px solid #000;
              padding-left: 10px;
              margin: 10px 0;
            }
            .header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }
            .status {
              border: 1px solid #000;
              padding: 2px 6px;
              display: inline-block;
            }
            @page {
              size: auto;
              margin: 10mm;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Lab Order: ${order.id}</h2>
            <div>Printed: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="section">
            <h3>Patient Information</h3>
            <p><span class="label">Name:</span> ${order.patientName}</p>
            <p><span class="label">Patient ID:</span> ${order.patientId}</p>
          </div>
          
          <div class="section">
            <h3>Test Information</h3>
            ${order.tests.map(test => `
              <div class="test">
                <p><strong>${test}</strong></p>
                ${order.status === 'completed' ? `
                  <p><span class="label">Result:</span> Normal <span class="label">(Reference: 0-100)</span></p>
                ` : ''}
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h3>Order Information</h3>
            <p><span class="label">Ordering Physician:</span> ${order.orderingPhysician}</p>
            <p><span class="label">Date Ordered:</span> ${new Date(order.dateOrdered).toLocaleString()}</p>
            ${order.dateCompleted ? `
              <p><span class="label">Date Completed:</span> ${new Date(order.dateCompleted).toLocaleString()}</p>
            ` : ''}
            <p><span class="label">Urgency:</span> <span class="status">${order.urgency}</span></p>
            <p><span class="label">Status:</span> <span class="status">${order.status.replace('-', ' ')}</span></p>
          </div>
          
          <div class="section">
            <h3>Special Instructions</h3>
            <p>${order.specialInstructions || 'No special instructions provided'}</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 0.8em; text-align: center;">
            This is a computer-generated report. No signature is required.
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
            <FaFileAlt className={styles.headerIcon} />
            Lab Order Details: {order.id}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.viewModalContent}>
          {/* Patient Information Section */}
          <div className={styles.detailSection}>
            <h3>
              <FaUser className={styles.sectionIcon} />
              Patient Information
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Full Name:</span>
                <span>{order.patientName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaIdCard className={styles.inlineIcon} /> Patient ID:
                </span>
                <span>{order.patientId}</span>
              </div>
            </div>
          </div>

          {/* Test Information Section */}
          <div className={styles.detailSection}>
            <h3>
              <FaFlask className={styles.sectionIcon} />
              Test Information
            </h3>
            <div className={styles.testsContainer}>
              {order.tests.map((test, index) => (
                <div key={index} className={styles.testDetail}>
                  <div className={styles.testName}>{test}</div>
                  {order.status === 'completed' && (
                    <div className={styles.testResult}>
                      <span className={styles.resultLabel}>Result:</span>
                      <span className={styles.resultValue}>Normal</span>
                      <span className={styles.resultRange}>(Reference: 0-100)</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Order Metadata Section */}
          <div className={styles.detailSection}>
            <h3>
              <FaNotesMedical className={styles.sectionIcon} />
              Order Information
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaUserMd className={styles.inlineIcon} /> Ordering Physician:
                </span>
                <span>{order.orderingPhysician}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaCalendarAlt className={styles.inlineIcon} /> Date Ordered:
                </span>
                <span>{new Date(order.dateOrdered).toLocaleString()}</span>
              </div>
              {order.dateCompleted && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>
                    <FaCalendarAlt className={styles.inlineIcon} /> Date Completed:
                  </span>
                  <span>{new Date(order.dateCompleted).toLocaleString()}</span>
                </div>
              )}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Urgency:</span>
                <span className={styles[`urgency${order.urgency}`]}>
                  {order.urgency}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Current Status:</span>
                <span className={styles[`statusText${order.status.replace('-', '')}`]}>
                  {order.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Special Instructions Section */}
          <div className={styles.detailSection}>
            <h3>Special Instructions</h3>
            <div className={styles.instructions}>
              {order.specialInstructions || 'No special instructions provided'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
          <button className={styles.printButton} onClick={handlePrint}>
        <FaPrint /> Print Order Summary
        </button>
            <button className={styles.closeButton} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModal;