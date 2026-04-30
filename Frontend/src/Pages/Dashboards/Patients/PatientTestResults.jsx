import React, { useState, useEffect } from 'react';
import { 
  FaVial, 
  FaSearch, 
  FaCalendarAlt,
  FaPrint,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaFileDownload,
  FaChartLine,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'react-feather';
import styles from './PatientTestResults.module.css';
import TestResultActionModal from './TestResultActionModal'
import ViewTestResultModal from './ViewTestResultModal';

const PatientTestResults = () => {
  const [testResults, setTestResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]); // Add this state
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedResult, setSelectedResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ordersPerPage] = useState(5);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentActionResult, setCurrentActionResult] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  useEffect(() => {
    // Simulate API call
    const sampleData = [
      {
        id: 'TR-1001',
        testName: 'Complete Blood Count',
        status: 'completed',
        date: '2023-06-15',
        labName: 'Main Hospital Lab',
        results: 'All values within normal range',
        doctor: 'Dr. Emily Carter',
        attachments: ['blood_test.pdf'],
        isAbnormal: false
      },
      {
        id: 'TR-1002',
        testName: 'Lipid Panel',
        status: 'completed',
        date: '2023-06-14',
        labName: 'City Lab Center',
        results: 'Cholesterol slightly elevated',
        doctor: 'Dr. Michael Brown',
        attachments: ['lipid_report.pdf'],
        isAbnormal: true
      },
      {
        id: 'TR-1003',
        testName: 'Thyroid Function Test',
        status: 'pending',
        date: '2023-06-16',
        labName: 'Main Hospital Lab',
        results: 'Results pending analysis',
        doctor: 'Dr. Lisa Wong',
        attachments: [],
        isAbnormal: false
      },
      {
        id: 'TR-1004',
        testName: 'Urinalysis',
        status: 'completed',
        date: '2023-06-10',
        labName: 'Westside Diagnostics',
        results: 'Normal results',
        doctor: 'Dr. Robert Chen',
        attachments: ['urinalysis.pdf'],
        isAbnormal: false
      },
      {
        id: 'TR-1005',
        testName: 'Liver Function Test',
        status: 'completed',
        date: '2023-06-08',
        labName: 'Main Hospital Lab',
        results: 'Elevated liver enzymes detected',
        doctor: 'Dr. Sarah Johnson',
        attachments: ['liver_test.pdf', 'doctor_notes.pdf'],
        isAbnormal: true
      }
    ];
    setTestResults(sampleData);
    setFilteredResults(sampleData);

  }, []);

  useEffect(() => {
    // Apply filters whenever filter, searchTerm, or selectedDateRange changes
    const filtered = testResults.filter(result => {
      // Filter by status (case-insensitive)
      if (filter !== 'all' && result.status.toLowerCase() !== filter.toLowerCase()) {
        return false;
      }
      
      // Filter by date range
      const resultDate = new Date(result.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date
      
      if (selectedDateRange === 'today') {
        const resultDay = new Date(resultDate);
        resultDay.setHours(0, 0, 0, 0);
        if (resultDay.getTime() !== today.getTime()) return false;
      } else if (selectedDateRange === 'week') {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday of this week
        if (resultDate < startOfWeek) return false;
      } else if (selectedDateRange === 'month') {
        if (resultDate.getMonth() !== today.getMonth() || 
            resultDate.getFullYear() !== today.getFullYear()) {
          return false;
        }
      }
      
      // Filter by search term (case-insensitive)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          result.testName.toLowerCase().includes(searchLower) ||
          result.labName.toLowerCase().includes(searchLower) ||
          result.doctor.toLowerCase().includes(searchLower) ||
          result.id.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [filter, searchTerm, selectedDateRange, testResults]);

  // Calculate pagination
  const indexOfLastResult = currentPage * ordersPerPage;
  const indexOfFirstResult = indexOfLastResult - ordersPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(filteredResults.length / ordersPerPage);


  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, selectedDateRange]);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const getStatusIcon = (status, isAbnormal) => {
    switch (status) {
      case 'completed':
        return isAbnormal ? (
          <AlertCircle size={18} className={styles.statusAbnormal} />
        ) : (
          <CheckCircle size={18} className={styles.statusCompleted} />
        );
      case 'pending':
        return <Clock size={18} className={styles.statusPending} />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
    const handleViewResult = (result) => {
    setSelectedResult(result);
    setIsViewModalOpen(true);
     setIsActionModalOpen(false); 
  };

  const handlePrintResult = (result) => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Result: ${result.testName}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.5; padding: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .result-title { font-size: 1.5em; margin-bottom: 10px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
            .value { margin-left: 10px; }
            .abnormal { color: #dc3545; font-weight: bold; }
            .normal { color: #28a745; }
            @page { size: auto; margin: 10mm; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Test Result Report</h1>
            <div>Printed: ${new Date().toLocaleString()}</div>
          </div>
          
          <div class="section">
            <h2 class="result-title">${result.testName}</h2>
            <p><span class="label">Status:</span> <span class="value">${result.status}</span></p>
            <p><span class="label">Date:</span> <span class="value">${formatDate(result.date)}</span></p>
          </div>
          
          <div class="section">
            <h3>Results</h3>
            <p class="${result.isAbnormal ? 'abnormal' : 'normal'}">
              ${result.results}
            </p>
          </div>
          
          <div class="section">
            <h3>Details</h3>
            <p><span class="label">Lab:</span> <span class="value">${result.labName}</span></p>
            <p><span class="label">Ordering Physician:</span> <span class="value">${result.doctor}</span></p>
          </div>
          
          <div style="margin-top: 30px; font-size: 0.8em; text-align: center;">
            This document contains confidential health information. Please handle with care.
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
    <div className={styles.dashboard}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>
            <FaVial className={styles.headerIcon} />
            My Test Results
          </h1>
          <p className={styles.subtitle}>
            View and manage your laboratory test results
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.primary}`}>
          <div className={styles.statContent}>
            <h3>Total Tests</h3>
            <div className={styles.statValue}>{testResults.length}</div>
          </div>
          <FaVial className={styles.statIcon} />
        </div>
        
        <div className={`${styles.statCard} ${styles.secondary}`}>
          <div className={styles.statContent}>
            <h3>Completed</h3>
            <div className={styles.statValue}>
              {testResults.filter(r => r.status === 'completed').length}
            </div>
          </div>
          <CheckCircle className={styles.statIcon} />
        </div>
        
        <div className={`${styles.statCard} ${styles.tertiary}`}>
          <div className={styles.statContent}>
            <h3>Pending</h3>
            <div className={styles.statValue}>
              {testResults.filter(r => r.status === 'pending').length}
            </div>
          </div>
          <Clock className={styles.statIcon} />
        </div>
        
        <div className={`${styles.statCard} ${styles.quaternary}`}>
          <div className={styles.statContent}>
            <h3>Abnormal</h3>
            <div className={styles.statValue}>
              {testResults.filter(r => r.isAbnormal).length}
            </div>
          </div>
          <AlertCircle className={styles.statIcon} />
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tests by name, doctor, or lab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          className={styles.filterToggle}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <FaFilter className={styles.filterIcon} />
          Filters
          {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isFilterOpen && (
          <div className={styles.filterPanel}>
            <div className={styles.filterGroup}>
              <label>Status</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Date Range</label>
              <select 
                value={selectedDateRange} 
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            <button 
              className={styles.clearFilters}
              onClick={() => {
                setFilter('all');
                setSelectedDateRange('all');
              }}
            >
              <FaTimes /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className={styles.resultsContainer}>
        <div className={styles.resultsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.headerCell}>Test Name</div>
            <div className={styles.headerCell}>Status</div>
            <div className={styles.headerCell}>Date</div>
            <div className={styles.headerCell}>Lab</div>
            <div className={styles.headerCell}>Actions</div>
          </div>

          {currentResults.length > 0 ? (
            currentResults.map(result => (
              <div key={result.id} className={styles.tableRow}>
                <div className={styles.dataCell}>
                  <div className={styles.testName}>{result.testName}</div>
                  <div className={styles.doctorName}>{result.doctor}</div>
                </div>
                <div className={styles.dataCell}>
                  <div className={styles.statusContainer}>
                    {getStatusIcon(result.status, result.isAbnormal)}
                    <span className={styles.statusText}>
                      {result.status}
                      {result.isAbnormal && ' (Abnormal)'}
                    </span>
                  </div>
                </div>
                <div className={styles.dataCell}>
                  {formatDate(result.date)}
                </div>
                <div className={styles.dataCell}>
                  {result.labName}
                </div>
                <div className={styles.actionCell}>
                  <button 
                    className={styles.actionDots}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentActionResult(result);
                      setIsActionModalOpen(true);
                    }}
                  >
                    •••
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsContent}>
                <FaVial className={styles.noResultsIcon} />
                <h3>No test results found</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredResults.length > ordersPerPage && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              <FaArrowLeft /> Previous
            </button>
            
            <div className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </div>
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </div>

      {isActionModalOpen && (
        <TestResultActionModal
          result={currentActionResult}
          onClose={() => setIsActionModalOpen(false)}
          onView={handleViewResult}
          onPrint={handlePrintResult}
        />
      )}
      {/* View Result Modal */}
      {isViewModalOpen && (
        <ViewTestResultModal
          result={selectedResult}
          onClose={() => setIsViewModalOpen(false)}
          onPrint={handlePrintResult}
        />
      )}
          </div>
  );
};

export default PatientTestResults;