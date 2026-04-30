import React, { useState, useEffect } from 'react';
// import { useDarkMode } from "../../Pages/Dashboards/Docters/DarkModeContext";
import { FaFileMedical, FaFilter, FaPrint, FaDownload, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import styles from './MedicalRecords.module.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock medical records data
  useEffect(() => {
    const mockRecords = [
      {
        id: 1,
        date: '2023-10-15',
        type: 'Consultation',
        doctor: 'Dr. Sarah Johnson',
        diagnosis: 'Hypertension (I10)',
        summary: 'Patient presented with elevated blood pressure (145/92). Recommended lifestyle modifications and prescribed Lisinopril 10mg daily. Follow-up in 4 weeks.',
        attachments: ['Lab_Results_20231015.pdf', 'Prescription_20231015.pdf'],
        isCritical: false
      },
      {
        id: 2,
        date: '2023-08-22',
        type: 'Emergency Visit',
        doctor: 'Dr. Michael Chen',
        diagnosis: 'Acute Bronchitis (J20.9)',
        summary: 'Patient presented with persistent cough, fever, and chest discomfort. Diagnosed with acute bronchitis. Prescribed Azithromycin and recommended rest.',
        attachments: ['XRay_Report_20230822.pdf'],
        isCritical: true
      },
      {
        id: 3,
        date: '2023-05-10',
        type: 'Annual Physical',
        doctor: 'Dr. Emily Wilson',
        diagnosis: 'Routine Checkup (Z00.00)',
        summary: 'Comprehensive annual physical examination. All vitals within normal range. Cholesterol slightly elevated - recommended dietary adjustments. Vaccinations up to date.',
        attachments: ['Bloodwork_20230510.pdf', 'Physical_Report_20230510.pdf'],
        isCritical: false
      },
      {
        id: 4,
        date: '2023-02-18',
        type: 'Specialist Consultation',
        doctor: 'Dr. Robert Kim (Cardiology)',
        diagnosis: 'Palpitations (R00.2)',
        summary: 'Patient reported occasional heart palpitations. EKG showed normal sinus rhythm. Recommended stress test if symptoms persist.',
        attachments: ['EKG_Report_20230218.pdf'],
        isCritical: false
      }
    ];

    // Simulate API loading
    setTimeout(() => {
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter records based on search and date filters
  useEffect(() => {
    let results = records;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(record => 
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const currentDate = new Date();
      let cutoffDate = new Date();
      
      if (dateFilter === 'year') {
        cutoffDate.setFullYear(currentDate.getFullYear() - 1);
      } else if (dateFilter === '6months') {
        cutoffDate.setMonth(currentDate.getMonth() - 6);
      } else if (dateFilter === 'month') {
        cutoffDate.setMonth(currentDate.getMonth() - 1);
      }
      
      results = results.filter(record => new Date(record.date) >= cutoffDate);
    }
    
    setFilteredRecords(results);
  }, [searchTerm, dateFilter, records]);

  const toggleRecordExpansion = (id) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={styles.medicalRecords}>
      <div className={styles.header}>
        <h1>
          <FaFileMedical className={styles.headerIcon} />
          Medical Records
        </h1>
        <p className={styles.subtitle}>Access your complete health history and visit summaries</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <MdDateRange className={styles.filterIcon} />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Time</option>
            <option value="year">Last Year</option>
            <option value="6months">Last 6 Months</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your medical records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No records found matching your criteria</p>
        </div>
      ) : (
        <div className={styles.recordsList}>
          {filteredRecords.map(record => (
            <div 
              key={record.id} 
              className={`${styles.recordCard} ${record.isCritical ? styles.critical : ''} ${expandedRecord === record.id ? styles.expanded : ''}`}
            >
              <div 
                className={styles.recordHeader}
                onClick={() => toggleRecordExpansion(record.id)}
              >
                <div className={styles.recordMainInfo}>
                  <h3>{record.type}</h3>
                  <p className={styles.recordDate}>{formatDate(record.date)}</p>
                  <p className={styles.recordDoctor}>{record.doctor}</p>
                </div>
                <div className={styles.recordDiagnosis}>
                  <span>Diagnosis:</span> {record.diagnosis}
                </div>
                <div className={styles.expandIcon}>
                  {expandedRecord === record.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedRecord === record.id && (
                <div className={styles.recordDetails}>
                  <div className={styles.recordSummary}>
                    <h4>Visit Summary</h4>
                    <p>{record.summary}</p>
                  </div>
                  
                  {record.attachments.length > 0 && (
                    <div className={styles.attachments}>
                      <h4>Attachments ({record.attachments.length})</h4>
                      <ul>
                        {record.attachments.map((file, index) => (
                          <li key={index}>
                            <span>{file}</span>
                            <div className={styles.fileActions}>
                              <button className={styles.downloadButton}>
                                <FaDownload /> Download
                              </button>
                              <button className={styles.actionButton}>
                                <FaPrint /> Print
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.footerNote}>
        <p>For any discrepancies in your records, please contact our medical records department.</p>
      </div>
    </div>
  );
};

export default MedicalRecords;