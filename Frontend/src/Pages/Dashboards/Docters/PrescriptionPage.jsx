import React, { useState, useEffect } from 'react';
import { 
  FaPills, 
  FaPlus, 
  FaSearch,
  FaFilter,
  FaFileExport,
  FaPrint,
  FaRegBell,
  FaUserCircle
} from 'react-icons/fa';
import { DotsThreeVertical } from "@phosphor-icons/react";

import { MdSick } from 'react-icons/md';
import { RiMedicineBottleFill } from 'react-icons/ri';
import PrescriptionModal from './PrescriptionModal';
import styles from './PrescriptionPage.module.css';
import PrescriptionActionModal from './PrescriptionActionModal';
import ViewPrescriptionModal from './ViewPrescriptionModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
const PrescriptionPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const prescriptionsPerPage = 5;

  // Analytics data
  const [analytics, setAnalytics] = useState({
    total: 0,
    active: 0,
    expired: 0,
    mostPrescribed: 'None'
  });

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Enhanced mock data with 15 prescriptions
        const mockPrescriptions = [
            {
              id: 'RX-1001',
              patient: { 
                fullName: 'John Smith', 
                patientId: 'P1001' 
              },
              prescriptions: [{
                medication: 'Amoxicillin',
                dosage: '500mg',
                frequency: 'Twice daily',
                form: 'Tablet',
                duration: '14 days',
                quantity: '28 tablets',
                instructions: 'Take with food',
                startDate: '2023-06-01',
                endDate: '2023-06-15'
              }],
              status: 'active',
              prescribedBy: 'Dr. Sarah Johnson'
            },
            {
              id: 'RX-1002',
              patient: { 
                fullName: 'Emily Davis', 
                patientId: 'P1002' 
              },
              prescriptions: [{
                medication: 'Lisinopril',
                dosage: '10mg',
                frequency: 'Once daily',
                form: 'Tablet',
                duration: '90 days',
                quantity: '90 tablets',
                instructions: 'Take in the morning',
                startDate: '2023-05-15',
                endDate: '2023-08-15'
              }],
              status: 'active',
              prescribedBy: 'Dr. Michael Chen'
            },
            {
              id: 'RX-1003',
              patient: { 
                fullName: 'Robert Johnson', 
                patientId: 'P1003' 
              },
              prescriptions: [{
                medication: 'Metformin',
                dosage: '850mg',
                frequency: 'Twice daily',
                form: 'Tablet',
                duration: '90 days',
                quantity: '180 tablets',
                instructions: 'Take with meals',
                startDate: '2023-04-10',
                endDate: '2023-07-10'
              }],
              status: 'active',
              prescribedBy: 'Dr. Sarah Johnson'
            },
            {
              id: 'RX-1004',
              patient: { 
                fullName: 'Maria Garcia', 
                patientId: 'P1004' 
              },
              prescriptions: [{
                medication: 'Atorvastatin',
                dosage: '20mg',
                frequency: 'Once daily',
                form: 'Tablet',
                duration: '90 days',
                quantity: '90 tablets',
                instructions: 'Take at bedtime',
                startDate: '2023-01-05',
                endDate: '2023-04-05'
              }],
              status: 'expired',
              prescribedBy: 'Dr. Lisa Wong'
            },
            {
              id: 'RX-1005',
              patient: { 
                fullName: 'David Wilson', 
                patientId: 'P1005' 
              },
              prescriptions: [{
                medication: 'Amoxicillin',
                dosage: '250mg',
                frequency: 'Three times daily',
                form: 'Capsule',
                duration: '14 days',
                quantity: '42 capsules',
                instructions: 'Take with plenty of water',
                startDate: '2023-06-10',
                endDate: '2023-06-24'
              }],
              status: 'active',
              prescribedBy: 'Dr. Michael Chen'
            },
            {
              id: 'RX-1006',
              patient: { 
                fullName: 'Sarah Miller', 
                patientId: 'P1006' 
              },
              prescriptions: [{
                medication: 'Omeprazole',
                dosage: '20mg',
                frequency: 'Once daily',
                form: 'Capsule',
                duration: '90 days',
                quantity: '90 capsules',
                instructions: 'Take before breakfast',
                startDate: '2023-05-20',
                endDate: '2023-08-20'
              }],
              status: 'active',
              prescribedBy: 'Dr. Sarah Johnson'
            },
            {
              id: 'RX-1007',
              patient: { 
                fullName: 'James Brown', 
                patientId: 'P1007' 
              },
              prescriptions: [{
                medication: 'Albuterol',
                dosage: '90mcg',
                frequency: 'As needed',
                form: 'Inhaler',
                duration: '180 days',
                quantity: '1 inhaler',
                instructions: 'Use for asthma symptoms',
                startDate: '2023-03-15',
                endDate: '2023-09-15'
              }],
              status: 'active',
              prescribedBy: 'Dr. Lisa Wong'
            },
            {
              id: 'RX-1008',
              patient: { 
                fullName: 'Patricia Lee', 
                patientId: 'P1008' 
              },
              prescriptions: [{
                medication: 'Levothyroxine',
                dosage: '50mcg',
                frequency: 'Once daily',
                form: 'Tablet',
                duration: '365 days',
                quantity: '365 tablets',
                instructions: 'Take on empty stomach',
                startDate: '2023-02-01',
                endDate: '2024-02-01'
              }],
              status: 'active',
              prescribedBy: 'Dr. Michael Chen'
            },
            {
              id: 'RX-1009',
              patient: { 
                fullName: 'Thomas Taylor', 
                patientId: 'P1009' 
              },
              prescriptions: [{
                medication: 'Amoxicillin',
                dosage: '500mg',
                frequency: 'Twice daily',
                form: 'Tablet',
                duration: '14 days',
                quantity: '28 tablets',
                instructions: 'Take with food',
                startDate: '2023-01-10',
                endDate: '2023-01-24'
              }],
              status: 'expired',
              prescribedBy: 'Dr. Sarah Johnson'
            },
            {
              id: 'RX-1010',
              patient: { 
                fullName: 'Jennifer Martinez', 
                patientId: 'P1010' 
              },
              prescriptions: [{
                medication: 'Sertraline',
                dosage: '50mg',
                frequency: 'Once daily',
                form: 'Tablet',
                duration: '180 days',
                quantity: '180 tablets',
                instructions: 'Take in the morning',
                startDate: '2023-04-05',
                endDate: '2023-10-05'
              }],
              status: 'active',
              prescribedBy: 'Dr. Lisa Wong'
            },
            {
              id: 'RX-1011',
              patient: { 
                fullName: 'William Anderson', 
                patientId: 'P1011' 
              },
              prescriptions: [{
                medication: 'Ibuprofen',
                dosage: '400mg',
                frequency: 'Every 6 hours as needed',
                form: 'Tablet',
                duration: '30 days',
                quantity: '120 tablets',
                instructions: 'Take with food or milk',
                startDate: '2023-07-01',
                endDate: '2023-07-31'
              }],
              status: 'active',
              prescribedBy: 'Dr. Michael Chen'
            },
            {
              id: 'RX-1012',
              patient: { 
                fullName: 'Linda Wilson', 
                patientId: 'P1012' 
              },
              prescriptions: [{
                medication: 'Simvastatin',
                dosage: '40mg',
                frequency: 'Once daily',
                form: 'Tablet',
                duration: '90 days',
                quantity: '90 tablets',
                instructions: 'Take at bedtime',
                startDate: '2023-06-15',
                endDate: '2023-09-15'
              }],
              status: 'active',
              prescribedBy: 'Dr. Sarah Johnson'
            },
            {
              id: 'RX-1013',
              patient: { 
                fullName: 'Charles Moore', 
                patientId: 'P1013' 
              },
              prescriptions: [{
                medication: 'Metoprolol',
                dosage: '25mg',
                frequency: 'Twice daily',
                form: 'Tablet',
                duration: '60 days',
                quantity: '120 tablets',
                instructions: 'Take with water',
                startDate: '2023-05-01',
                endDate: '2023-07-01'
              }],
              status: 'active',
              prescribedBy: 'Dr. Lisa Wong'
            },
            {
              id: 'RX-1014',
              patient: { 
                fullName: 'Jessica Taylor', 
                patientId: 'P1014' 
              },
              prescriptions: [{
                medication: 'Citalopram',
                dosage: '20mg',
                frequency: 'Once daily',
                form: 'Tablet',
                duration: '90 days',
                quantity: '90 tablets',
                instructions: 'Take in the morning',
                startDate: '2023-04-20',
                endDate: '2023-07-20'
              }],
              status: 'active',
              prescribedBy: 'Dr. Michael Chen'
            },
            {
              id: 'RX-1015',
              patient: { 
                fullName: 'Daniel Harris', 
                patientId: 'P1015' 
              },
              prescriptions: [{
                medication: 'Warfarin',
                dosage: '5mg',
                frequency: 'Once daily',
                form: 'Tablet',
                duration: '30 days',
                quantity: '30 tablets',
                instructions: 'Take at same time each day',
                startDate: '2023-07-10',
                endDate: '2023-08-10'
              }],
              status: 'active',
              prescribedBy: 'Dr. Sarah Johnson'
            }
          ];

        setPrescriptions(mockPrescriptions);
        
        // Calculate analytics
        const activeCount = mockPrescriptions.filter(p => p.status === 'active').length;
        const expiredCount = mockPrescriptions.filter(p => p.status === 'expired').length;
        
        // Find most prescribed medication
        const medicationCount = {};
        mockPrescriptions.forEach(p => {
          medicationCount[p.medication] = (medicationCount[p.medication] || 0) + 1;
        });
        const mostPrescribed = Object.keys(medicationCount).reduce((a, b) => 
          medicationCount[a] > medicationCount[b] ? a : b
        );

        setAnalytics({
          total: mockPrescriptions.length,
          active: activeCount,
          expired: expiredCount,
          mostPrescribed: mostPrescribed
        });
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
// Add these inside your PrescriptionPage component, before the return statement

const exportToCSV = (data) => {
    const headers = [
      'ID', 'Patient Name', 'Patient ID', 'Medication', 
      'Dosage', 'Frequency', 'Status', 'Start Date', 'End Date', 'Prescribed By'
    ];
    
    const csvContent = [
      headers.join(","),
      ...data.map(p => [
        p.id,
        `"${p.patient.fullName}"`,
        p.patient.patientId,
        p.prescriptions[0].medication,
        p.prescriptions[0].dosage,
        p.prescriptions[0].frequency,
        p.status,
        p.prescriptions[0].startDate,
        p.prescriptions[0].endDate,
        p.prescribedBy
      ].join(","))
    ].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prescriptions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  
  const exportToJSON = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prescriptions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };
  
  const exportToPDF = async (data) => {
    try {
      // Dynamically import jsPDF and autoTable together
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text("Prescription Report", 10, 10);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);
      
      // Prepare table data
      const tableData = data.map(p => [
        p.id,
        p.patient.fullName,
        p.prescriptions[0].medication,
        p.prescriptions[0].dosage,
        p.status
      ]);
      
      // Use the imported autoTable function directly
      autoTable(doc, {
        head: [['ID', 'Patient', 'Medication', 'Dosage', 'Status']],
        body: tableData,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });
      
      doc.save(`prescriptions_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      throw error;
    }
  };
  
  const handleExport = async (format) => {
    try {
      // Prepare data for export
      const dataToExport = filteredPrescriptions.map(p => ({
        ...p,
        patientName: p.patient.fullName,
        patientId: p.patient.patientId,
        medication: p.prescriptions[0].medication,
        dosage: p.prescriptions[0].dosage,
        frequency: p.prescriptions[0].frequency,
        startDate: p.prescriptions[0].startDate,
        endDate: p.prescriptions[0].endDate
      }));
  
      switch(format) {
        case 'csv':
          exportToCSV(filteredPrescriptions);
          break;
        case 'pdf':
          await exportToPDF(filteredPrescriptions);
          break;
        case 'json':
          exportToJSON(dataToExport);
          break;
        default:
          console.warn('Unknown export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleAddPrescription = (newPrescription) => {
    const prescriptionToAdd = {
      id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: {
        fullName: newPrescription.patient.name,
        patientId: newPrescription.patient.id
      },
      prescriptions: newPrescription.prescriptions.map(p => ({
        medication: p.medication,
        dosage: p.dosage,
        frequency: p.frequency,
        form: p.form || 'Tablet',
        duration: p.duration || '30 days',
        quantity: p.quantity || '30 tablets',
        instructions: p.instructions || 'Take as directed',
        startDate: p.startDate,
        endDate: p.endDate
      })),
      status: 'active',
      prescribedBy: 'Dr. Sarah Johnson'
    };

    setPrescriptions(prev => [prescriptionToAdd, ...prev]);
    setAnalytics(prev => ({
      ...prev,
      total: prev.total + 1,
      active: prev.active + 1,
      mostPrescribed: prescriptionToAdd.prescriptions[0].medication
    }));
  };
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescriptions.some(p => 
        p.medication.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'all' || 
      prescription.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastPrescription = currentPage * prescriptionsPerPage;
  const indexOfFirstPrescription = indexOfLastPrescription - prescriptionsPerPage;
  const currentPrescriptions = filteredPrescriptions.slice(
    indexOfFirstPrescription,
    indexOfLastPrescription
  );
  const totalPages = Math.ceil(filteredPrescriptions.length / prescriptionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <RiMedicineBottleFill className={styles.headerIcon} />
          <h1>Prescription Management</h1>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> New Prescription
        </button>
      </div>

      {/* Analytics Cards */}
      <div className={styles.analyticsContainer}>
        <div className={`${styles.analyticsCard} ${styles.cardPrimary}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>
              <RiMedicineBottleFill />
            </div>
            <div>
              <h3>Total Prescriptions</h3>
              <p>{analytics.total}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.analyticsCard} ${styles.cardSuccess}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>
              <FaPills />
            </div>
            <div>
              <h3>Active</h3>
              <p>{analytics.active}</p>
            </div>
          </div>
        </div>

        <div className={`${styles.analyticsCard} ${styles.cardWarning}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardIcon}>
              <MdSick />
            </div>
            <div>
              <h3>Expired</h3>
              <p>{analytics.expired}</p>
            </div>
          </div>
        </div>

   
      </div>

      {/* Controls Section */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>
            <FaFilter /> Filter:
          </div>
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setCurrentPage(1); // Reset to first page when filtering
            }}
            className={styles.filterSelect}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className={styles.exportButtons}>
        <div className={styles.exportDropdown}>
            <button className={styles.exportButton}>
            <FaFileExport /> Export
            </button>
            <div className={styles.exportDropdownContent}>
            <button onClick={() => handleExport('csv')}>CSV</button>
            <button onClick={() => handleExport('pdf')}>PDF</button>
            <button onClick={() => handleExport('json')}>JSON</button>
            </div>
        </div>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className={styles.tableContainer}>
      <table className={styles.prescriptionsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
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
          {isLoading ? (
            <tr>
              <td colSpan="10" className={styles.loadingCell}>
                Loading prescriptions...
              </td>
            </tr>
          ) : currentPrescriptions.length === 0 ? (
            <tr>
              <td colSpan="10" className={styles.emptyCell}>
                No prescriptions found
              </td>
            </tr>
          ) : (
            currentPrescriptions.map(prescription => (
              <tr key={prescription.id}>
                <td>{prescription.id}</td>
                <td>
                  <div className={styles.patientCell}>
                    <FaUserCircle className={styles.patientIcon} />
                    <div>
                      <div>{prescription.patient.fullName}</div>
                      <div className={styles.patientId}>{prescription.patient.patientId}</div>
                    </div>
                  </div>
                </td>
                <td>{prescription.prescriptions[0].medication}</td>
                <td>{prescription.prescriptions[0].dosage}</td>
                <td>{prescription.prescriptions[0].frequency}</td>
                <td>
                  <span className={`${styles.statusBadge} ${
                    prescription.status === 'active' ? styles.statusActive :
                    prescription.status === 'expired' ? styles.statusExpired :
                    styles.statusPending
                  }`}>
                    {prescription.status}
                  </span>
                </td>
                <td>{prescription.prescriptions[0].startDate}</td>
                <td>{prescription.prescriptions[0].endDate}</td>
                <td>
                  <button 
                    className={styles.actionMenuButton} 
                    onClick={() => {
                      setSelectedPrescription(prescription);
                      setShowActionModal(true);
                    }}
                    aria-label="Prescription actions"
                  >
                    <DotsThreeVertical size={20} className={styles.actionDots} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.paginationButton} 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              className={`${styles.paginationButton} ${
                currentPage === number ? styles.activePage : ''
              }`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}
          
          <button 
            className={styles.paginationButton}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Prescription Modal */}
      {showModal && (
        <PrescriptionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleAddPrescription}
        />
      )}
      
      {showActionModal && selectedPrescription && (
  <PrescriptionActionModal
    prescription={selectedPrescription}
    onClose={() => setShowActionModal(false)}
    onEdit={(updatedPrescription) => {
      setPrescriptions(prev => 
        prev.map(p => 
          p.id === updatedPrescription.id ? updatedPrescription : p
        )
      );
    }}
    onRefill={(refilledPrescription) => {
      setPrescriptions(prev => 
        prev.map(p => 
          p.id === refilledPrescription.id ? refilledPrescription : p
        )
      );
    }}
    onDelete={(prescriptionId) => {
      setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
    }}
    onView={(prescription) => {
      setSelectedPrescription(prescription);
      setShowViewModal(true);
    }}
  />
)}

{showViewModal && selectedPrescription && (
  <ViewPrescriptionModal
    prescription={selectedPrescription}
    onClose={() => setShowViewModal(false)}
  />
)}

    </div>
  );
};

export default PrescriptionPage;