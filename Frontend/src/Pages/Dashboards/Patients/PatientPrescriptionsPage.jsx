import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPieChart, FiPlus, FiSearch, FiFilter, FiDownload, FiPrinter, 
  FiUser, FiCalendar, FiClock, FiChevronLeft, FiChevronRight,
  FiAlertCircle, FiCheckCircle, FiRefreshCw, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './PatientPrescriptions.module.css';
import PrescriptionActionModal from './PrescriptionActionModal';
import ViewPrescriptionModal from './ViewPrescriptionModal';
import RefillModal from './RefillModal'; 

import 'jspdf-autotable';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);
const PatientPrescriptionsPage = () => {
  // State management
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 8;
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentActionPrescription, setCurrentActionPrescription] = useState(null);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [refillPrescriptions, setRefillPrescriptions] = useState([]);
  const calendarRef = useRef(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // Analytics
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    expired: 0,
    refillNeeded: 0,
    medicationDistribution: {}
  });

  // Fetch data
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = [
          {
            id: 'RX-2023-00145',
            patientId: 'PID-1001',
            patientName: 'John Smith',
            medications: [
              {
                name: 'Atorvastatin',
                dosage: '40mg',
                form: 'Tablet',
                frequency: 'Once daily',
                instructions: 'Take at bedtime',
                startDate: '2023-06-01',
                endDate: '2023-12-01',
                refills: 2,
                status: 'active'
              }
            ],
            prescribedBy: 'Dr. Sarah Johnson',
            date: '2023-05-28',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active'
          },
          {
            id: 'RX-2023-00146',
            patientId: 'PID-1001',
            patientName: 'John Smith',
            medications: [
              {
                name: 'Metformin',
                dosage: '500mg',
                form: 'Tablet',
                frequency: 'Twice daily',
                instructions: 'Take with meals',
                startDate: '2023-06-01',
                endDate: '2023-09-01',
                refills: 1,
                status: 'active'
              }
            ],
            prescribedBy: 'Dr. Sarah Johnson',
            date: '2023-05-28',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active'
          },
          {
            id: 'RX-2023-00089',
            patientId: 'PID-1001',
            patientName: 'John Smith',
            medications: [
              {
                name: 'Lisinopril',
                dosage: '10mg',
                form: 'Tablet',
                frequency: 'Once daily',
                instructions: 'Take in the morning',
                startDate: '2023-03-15',
                endDate: '2023-06-15',
                refills: 0,
                status: 'expired'
              }
            ],
            prescribedBy: 'Dr. Michael Chen',
            date: '2023-03-10',
            pharmacy: 'Walgreens #3241',
            status: 'expired'
          },
          {
            id: 'RX-2023-00178',
            patientId: 'PID-1001',
            patientName: 'John Smith',
            medications: [
              {
                name: 'Albuterol Inhaler',
                dosage: '90mcg',
                form: 'Inhaler',
                frequency: 'As needed',
                instructions: 'Use for asthma symptoms',
                startDate: '2023-07-01',
                endDate: '2024-01-01',
                refills: 5,
                status: 'active'
              }
            ],
            prescribedBy: 'Dr. Emily Wong',
            date: '2023-06-25',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active'
          },
          {
            id: 'RX-2023-00210',
            patientId: 'PID-1001',
            patientName: 'John Smith',
            medications: [
              {
                name: 'Amoxicillin',
                dosage: '500mg',
                form: 'Capsule',
                frequency: 'Three times daily',
                instructions: 'Take until finished',
                startDate: '2023-08-05',
                endDate: '2023-08-15',
                refills: 0,
                status: 'completed'
              }
            ],
            prescribedBy: 'Dr. Robert Davis',
            date: '2023-08-05',
            pharmacy: 'Walgreens #3241',
            status: 'completed'
          },
          {
            id: 'RX-2023-00192',
            patientId: 'PID-1001',
            patientName: 'John Smith',
            medications: [
              {
                name: 'Omeprazole',
                dosage: '20mg',
                form: 'Capsule',
                frequency: 'Once daily',
                instructions: 'Take before breakfast',
                startDate: '2023-07-10',
                endDate: '2023-10-10',
                refills: 1,
                status: 'active'
              }
            ],
            prescribedBy: 'Dr. Sarah Johnson',
            date: '2023-07-08',
            pharmacy: 'CVS Pharmacy #1452',
            status: 'active'
          }
        ];

        setPrescriptions(mockData);
        setFilteredPrescriptions(mockData);
        setChartData(processChartData(mockData));

        // Calculate analytics
        const active = mockData.filter(p => p.status === 'active').length;
        const expired = mockData.filter(p => p.status === 'expired').length;
        const refillNeeded = mockData.filter(p => 
          p.status === 'active' && p.medications.some(m => m.refills > 0)
        ).length;
        
        // Medication distribution
        const medDistribution = {};
        mockData.forEach(p => {
          p.medications.forEach(m => {
            medDistribution[m.name] = (medDistribution[m.name] || 0) + 1;
          });
        });

        setAnalytics({
          total: mockData.length,
          active,
          expired,
          refillNeeded,
          medicationDistribution: medDistribution
        });

      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = [...prescriptions];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(p => 
        p.patientName.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        p.medications.some(m => m.name.toLowerCase().includes(term))
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      results = results.filter(p => p.status === statusFilter);
    }
    
    // Date range filter
    if (startDate && endDate) {
      results = results.filter(p => {
        const prescDate = new Date(p.date);
        return prescDate >= startDate && prescDate <= endDate;
      });
    }
    
    setFilteredPrescriptions(results);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, startDate, endDate, prescriptions]);

  // Pagination
  const indexOfLast = currentPage * prescriptionsPerPage;
  const indexOfFirst = indexOfLast - prescriptionsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPrescriptions.length / prescriptionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Export functions


  const exportToCSV = () => {
    const headers = ['ID,Medication,Dosage,Status,Prescribed On,Doctor,Pharmacy'];
    const csvContent = [
      ...headers,
      ...filteredPrescriptions.map(p => 
        `"${p.id}","${p.medications.map(m => m.name).join(', ')}","${p.medications.map(m => m.dosage).join(', ')}",` +
        `"${p.status}","${new Date(p.date).toLocaleDateString()}","${p.prescribedBy}","${p.pharmacy}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `prescriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


const [chartData, setChartData] = useState({
  labels: [],
  datasets: []
});

const chartOptions = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.raw}`;
        }
      }
    },
    title: {
      display: true,
      text: 'Prescriptions Over Time'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Number of Prescriptions'
      },
      ticks: {
        stepSize: 1
      }
    },
    x: {
      title: {
        display: true,
        text: 'Month'
      }
    }
  }
};
const handleRefillRequest = (prescription) => {
  // Prepare the prescriptions array for the RefillModal
  const eligiblePrescriptions = prescription.medications
    .filter(m => m.refills > 0)
    .map(m => ({
      id: `${prescription.id}-${m.name}`,
      medication: m.name,
      dosage: m.dosage,
      doctor: prescription.prescribedBy,
      refills: m.refills,
      originalPrescription: prescription
    }));
  
  setRefillPrescriptions(eligiblePrescriptions);
  setShowRefillModal(true);
};
  // Add new prescription
  const handleAddPrescription = (newPrescription) => {
    const prescriptionToAdd = {
      id: `RX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: 'PID-1001',
      patientName: 'John Smith',
      medications: [newPrescription],
      prescribedBy: 'Dr. Sarah Johnson',
      date: new Date().toISOString().split('T')[0],
      pharmacy: 'CVS Pharmacy #1452',
      status: 'active'
    };
    
    setPrescriptions(prev => [prescriptionToAdd, ...prev]);
    setShowAddModal(false);
  };
    const handleActionClick = (prescription) => {
    setCurrentActionPrescription(prescription);
    setIsActionModalOpen(true);
  };
const handleViewDetails = (prescription) => {
  // Transform the data to match what ViewPrescriptionModal expects
  const viewPrescription = {
    ...prescription,
    medication: prescription.medications[0].name,
    dosage: prescription.medications[0].dosage,
    instructions: prescription.medications[0].instructions,
    refills: prescription.medications[0].refills,
    status: prescription.status,
    doctor: prescription.prescribedBy,
    date: prescription.date
  };
  setSelectedPrescription(viewPrescription);
  setIsActionModalOpen(false);
  setShowViewModal(true);
};

const processChartData = (prescriptions) => {
  // Group prescriptions by month
  const monthlyData = {};
  
  prescriptions.forEach(prescription => {
    const date = new Date(prescription.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {};
    }
    
    prescription.medications.forEach(med => {
      if (!monthlyData[monthYear][med.name]) {
        monthlyData[monthYear][med.name] = 0;
      }
      monthlyData[monthYear][med.name] += 1;
    });
  });
  
  // Get all unique medication names
  const allMeds = new Set();
  prescriptions.forEach(p => p.medications.forEach(m => allMeds.add(m.name)));
  const medications = Array.from(allMeds);
  
  // Get sorted months
  const months = Object.keys(monthlyData).sort();
  
  // Create datasets for each medication
  const datasets = medications.map(med => {
    const color = getRandomColor(); // Helper function to generate colors
    return {
      label: med,
      data: months.map(month => monthlyData[month][med] || 0),
      borderColor: color,
      backgroundColor: color.replace(')', ', 0.2)').replace('rgb', 'rgba'),
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointStyle: getPointStyle(medications.indexOf(med) % 7) // Cycle through point styles
    };
  });
  
  return {
    labels: months.map(month => formatMonth(month)), // Format month for display
    datasets
  };
};

// Helper function to generate random colors
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

// Helper function to get different point styles
const getPointStyle = (index) => {
  const styles = ['circle', 'triangle', 'rect', 'rectRounded', 'star', 'cross', 'crossRot'];
  return styles[index % styles.length];
};

// Helper function to format month for display
const formatMonth = (monthYear) => {
  const [year, month] = monthYear.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};
  return (
    <div className={styles.prescriptionDashboard}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <FiPieChart className={styles.headerIcon} />
          <h1>My Prescriptions</h1>
          <p className={styles.subtitle}>Manage and track your medications</p>
        </div>
        
      </header>

      {/* Analytics Cards */}
      <div className={styles.analyticsGrid}>
        <motion.div 
          whileHover={{ y: -5 }}
          className={`${styles.analyticsCard} ${styles.totalCard}`}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>
              <FiPieChart />
            </div>
            <div>
              <h3>Total Prescriptions</h3>
              <p>{analytics.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className={`${styles.analyticsCard} ${styles.activeCard}`}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>
              <FiCheckCircle />
            </div>
            <div>
              <h3>Active</h3>
              <p>{analytics.active}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className={`${styles.analyticsCard} ${styles.expiredCard}`}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>
              <FiAlertCircle />
            </div>
            <div>
              <h3>Expired</h3>
              <p>{analytics.expired}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className={`${styles.analyticsCard} ${styles.refillCard}`}
        >
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>
              <FiRefreshCw />
            </div>
            <div>
              <h3>Refills Available</h3>
              <p>{analytics.refillNeeded}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Medication Distribution Chart */}
        <div className={styles.chartContainer}>
        <h2>Prescription Trends Over Time</h2>
        <div className={styles.chartWrapper}>
            <Line 
            data={chartData} 
            options={chartOptions}
            />
        </div>
        </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className={styles.clearSearch}
              onClick={() => setSearchTerm('')}
            >
              <FiX />
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <FiFilter /> Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className={styles.dateRangePicker}>
          <div className={styles.filterLabel}>
            <FiCalendar /> Date Range:
          </div>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable={true}
            placeholderText="Select date range"
            className={styles.datePickerInput}
          />
        </div>

        <div className={styles.exportButtons}>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.exportButton}
            onClick={exportToCSV}
          >
            <FiDownload /> CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={styles.printButton}
            onClick={() => window.print()}
          >
            <FiPrinter /> Print
          </motion.button>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.prescriptionsTable}>
          <thead>
            <tr>
              <th>Prescription ID</th>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className={styles.loadingCell}>
                  <div className={styles.spinner}></div>
                  Loading your prescriptions...
                </td>
              </tr>
            ) : currentPrescriptions.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.emptyCell}>
                  <FiAlertCircle className={styles.emptyIcon} />
                  No prescriptions found matching your criteria
                </td>
              </tr>
            ) : (
              currentPrescriptions.map((prescription) => (
                <motion.tr 
                  key={prescription.id}
                  whileHover={{ backgroundColor: 'rgba(240, 240, 240, 0.5)' }}
                  className={styles.prescriptionRow}
                >
                  <td>
                    <div className={styles.prescriptionId}>
                      {prescription.id}
                      <div className={styles.prescriber}>
                        <FiUser size={12} /> {prescription.prescribedBy}
                      </div>
                    </div>
                  </td>
                  <td>
                    {prescription.medications.map((med, index) => (
                      <div key={index} className={styles.medication}>
                        <FiPieChart size={14} /> {med.name} ({med.form})
                      </div>
                    ))}
                  </td>
                  <td>
                    {prescription.medications.map((med, index) => (
                      <div key={index}>{med.dosage}</div>
                    ))}
                  </td>
                  <td>
                    {prescription.medications.map((med, index) => (
                      <div key={index}>{med.frequency}</div>
                    ))}
                  </td>
                  <td>
                    <div className={styles.statusCell}>
                      <span className={`${styles.statusBadge} ${
                        prescription.status === 'active' ? styles.activeStatus :
                        prescription.status === 'expired' ? styles.expiredStatus :
                        styles.completedStatus
                      }`}>
                        {prescription.status}
                      </span>
                      {prescription.medications.some(m => m.refills > 0) && (
                        <span className={styles.refillBadge}>
                          {prescription.medications.reduce((sum, m) => sum + m.refills, 0)} refills
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {prescription.medications.map((med, index) => (
                      <div key={index}>
                        <FiCalendar size={12} /> {med.startDate}
                      </div>
                    ))}
                  </td>
                  <td>
                    {prescription.medications.map((med, index) => (
                      <div key={index}>
                        <FiCalendar size={12} /> {med.endDate}
                      </div>
                    ))}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                        <button 
                            className="actionDots"
                            onClick={() => handleActionClick(prescription)}
                        >
                            •••
                        </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            <FiChevronLeft /> Previous
          </button>
          
          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`${styles.pageButton} ${
                    currentPage === pageNum ? styles.activePage : ''
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <PrescriptionModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddPrescription}
          />
        )}
        
        {showViewModal && selectedPrescription && (
          <ViewPrescriptionModal
            prescription={selectedPrescription}
            onClose={() => setShowViewModal(false)}
            onRefill={() => {
              // Handle refill logic
              setShowViewModal(false);
            }}
          />
        )}
              {isActionModalOpen && (
                <PrescriptionActionModal
                    prescription={currentActionPrescription}
                    onClose={() => setIsActionModalOpen(false)}
                    onView={handleViewDetails}
                    onRefill={handleRefillRequest}
                />
      )}
      {showRefillModal && (
        <RefillModal
            isOpen={showRefillModal}
            onClose={() => setShowRefillModal(false)}
            prescriptions={refillPrescriptions}
        />
)}
      </AnimatePresence>
    </div>
  );
};

export default PatientPrescriptionsPage;