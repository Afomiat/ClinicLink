import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import styles from './PaymentIntegration.module.css';

const PaymentIntegration = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const mockData = [
          {
            id: 1,
            date: '2023-06-15',
            amount: 125.50,
            service: 'Annual Checkup',
            status: 'completed',
            doctor: 'Dr. Sarah Johnson',
            paymentMethod: 'Telebirr',
            transactionId: 'TX-' + Math.floor(100000 + Math.random() * 900000),
            patientName: 'Alemayehu Kebede',
            patientId: 'PT-78945'
          },
          {
            id: 2,
            date: '2023-04-22',
            amount: 75.00,
            service: 'Dental Cleaning',
            status: 'completed',
            doctor: 'Dr. Michael Chen',
            paymentMethod: 'CBE Birr',
            transactionId: 'TX-' + Math.floor(100000 + Math.random() * 900000),
            patientName: 'Tigist Worku',
            patientId: 'PT-12345'
          }
        ];
        setPaymentHistory(mockData);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      }
    };

    fetchPaymentHistory();
  }, []);

  const generateReceipt = (payment) => {
    const doc = new jsPDF();
    
    // Add logo (you can replace with your actual logo)
    // doc.addImage(logo, 'PNG', 10, 10, 30, 30);
    
    // Clinic Information
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('HEALTHCARE MEDICAL CENTER', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Bole Subcity, Addis Ababa, Ethiopia', 105, 26, { align: 'center' });
    doc.text('Phone: +251 123 456 789 | Email: info@healthcare.et', 105, 32, { align: 'center' });
    
    // Receipt title
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 150);
    doc.text('PAYMENT RECEIPT', 105, 42, { align: 'center' });
    
    // Horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 46, 190, 46);
    
    // Receipt details
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    // Left column
    doc.text(`Receipt No: RC-${payment.transactionId}`, 20, 56);
    doc.text(`Date: ${payment.date}`, 20, 62);
    doc.text(`Patient ID: ${payment.patientId}`, 20, 68);
    doc.text(`Patient: ${payment.patientName}`, 20, 74);
    
    // Right column
    doc.text(`Doctor: ${payment.doctor}`, 120, 56);
    doc.text(`Service: ${payment.service}`, 120, 62);
    doc.text(`Payment Method: ${payment.paymentMethod}`, 120, 68);
    doc.text(`Status: ${payment.status.toUpperCase()}`, 120, 74);
    
    // Amount section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('------------------------------------------------------------', 20, 84);
    doc.text(`Total Amount: ETB ${payment.amount.toFixed(2)}`, 20, 92);
    doc.text('------------------------------------------------------------', 20, 96);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for choosing Healthcare Medical Center', 105, 120, { align: 'center' });
    doc.text('This is an official receipt for your records', 105, 126, { align: 'center' });
    doc.text('For any inquiries, please contact our billing department', 105, 132, { align: 'center' });
    
    // Save the PDF
    doc.save(`Receipt_${payment.date}_${payment.transactionId}.pdf`);
  };

  return (
    <div className={styles.paymentIntegration}>
      <div className={styles.paymentHeader}>
        <h2>Payment History</h2>
      </div>

      <div className={styles.paymentContent}>
        <div className={styles.paymentHistory}>
          {paymentHistory.length > 0 ? (
            <div className={styles.historyTable}>
              <div className={styles.tableHeader}>
                <div className={styles.headerCell}>Date</div>
                <div className={styles.headerCell}>Service</div>
                <div className={styles.headerCell}>Amount (ETB)</div>
                <div className={styles.headerCell}>Status</div>
                <div className={styles.headerCell}>Receipt</div>
              </div>
              {paymentHistory.map((payment) => (
                <div className={styles.tableRow} key={payment.id}>
                  <div className={styles.tableCell}>{payment.date}</div>
                  <div className={styles.tableCell}>{payment.service}</div>
                  <div className={styles.tableCell}>{payment.amount.toFixed(2)}</div>
                  <div className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${styles[payment.status]}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    <button 
                      onClick={() => generateReceipt(payment)}
                      className={styles.downloadButton}
                    >
                      <FiDownload /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noPayments}>
              <p>No payment history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentIntegration;