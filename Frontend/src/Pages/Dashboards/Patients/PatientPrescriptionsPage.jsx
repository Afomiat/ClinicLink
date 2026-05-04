import React, { useState, useEffect, useRef } from 'react';
import { 
  FiSearch, FiFilter, FiDownload, FiPrinter, 
  FiCalendar, FiCheckCircle, FiRefreshCw, FiX, FiPlus
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
      ? prescription.medications
          .filter(m => m.refills > 0)
          .map(m => ({
            id: `${prescription.id}-${m.name}`,
            medication: m.name,
            dosage: m.dosage,
            doctor: prescription.prescribedBy,
            refills: m.refills,
            originalPrescription: prescription
          }))
      : [];
    
    setRefillPrescriptions(eligiblePrescriptions);
    setShowRefillModal(true);
  };

  const getNextDose = () => {
    const active = prescriptions.filter(p => p.status === 'active');
    if (active.length === 0) return null;
    
    // For demo purposes, pick the first active medication's next dose
    const med = active[0].medications[0];
    return {
      time: '08:00 AM',
      name: med.name,
      dosage: med.dosage
    };
  };

  const nextDose = getNextDose();

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
    <div className="max-w-[1400px] mx-auto p-gutter space-y-md min-h-screen bg-surface relative">
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-md mb-2">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface leading-tight">Prescription Management</h2>
          <p className="text-body-md text-on-surface-variant">Manage your current medications and refill requests.</p>
        </div>
        <div className="flex items-center gap-xs flex-wrap">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline text-label-md text-on-surface-variant hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline text-label-md text-on-surface-variant hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">print</span>
            Print List
          </button>
        </div>
      </div>


      {/* Dashboard Row 1: Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter items-stretch">
        {/* Adherence Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] p-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center justify-between mb-md">
            <div>
              <h3 className="font-h3 text-h3">Adherence Trends</h3>
              <p className="text-body-sm text-on-surface-variant">30-day medication compliance</p>
            </div>
            <div className="flex items-center gap-2 bg-secondary-container/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="text-label-sm text-on-secondary-container">94% Adherence</span>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-3 px-4 h-48 py-2">
            {/* Mock Bar Chart representing adherence */}
            {[85, 95, 90, 75, 100, 92, 88, 96, 85, 91].map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-t-lg transition-all duration-300 group relative ${i === 4 ? 'bg-secondary/70 hover:bg-secondary' : 'bg-slate-100 hover:bg-secondary/30'}`}
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 px-2">
            <span className="text-label-sm text-slate-400">Week 1</span>
            <span className="text-label-sm text-slate-400">Week 2</span>
            <span className="text-label-sm text-slate-400">Week 3</span>
            <span className="text-label-sm text-slate-400">Week 4</span>
          </div>
        </div>

        {/* Next Dose Card */}
        <div className="bg-primary-container text-white rounded-xl p-md shadow-xl flex flex-col justify-between overflow-hidden relative min-h-[280px]">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[160px] leading-none">notifications_active</span>
          </div>
          {nextDose ? (
            <>
              <div className="relative z-10">
                <span className="bg-white/10 text-white text-label-sm px-3 py-1 rounded-full border border-white/20 uppercase tracking-wider">Upcoming Dose</span>
                <h3 className="font-display text-[40px] font-bold mt-sm leading-none">{nextDose.time}</h3>
                <p className="text-body-lg text-white/80 mt-1">{nextDose.name} {nextDose.dosage}</p>
              </div>
              <div className="space-y-md relative z-10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
                  <span className="text-body-sm font-medium">Reminders active</span>
                </div>
                <button className="w-full bg-white text-primary-container font-label-md py-3.5 rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all shadow-lg">Mark as Taken</button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 relative z-10">
               <span className="material-symbols-outlined text-5xl mb-3 text-white/20">medication_off</span>
               <p className="text-body-md text-white/60 font-medium">No active doses scheduled</p>
            </div>
          )}
        </div>
      </div>

      {/* Medication Table */}
      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-slate-100 overflow-hidden">
        <div className="p-sm border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-h3 text-h3">Current Medications</h3>
          <div className="flex items-center gap-xs w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input 
                type="text" 
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-label-sm border-slate-200 rounded-lg focus:ring-secondary/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-sm py-4 text-label-sm text-on-surface-variant w-1/3">Medication Name</th>
                <th className="px-sm py-4 text-label-sm text-on-surface-variant">Dosage</th>
                <th className="px-sm py-4 text-label-sm text-on-surface-variant">Frequency</th>
                <th className="px-sm py-4 text-label-sm text-on-surface-variant">Status</th>
                <th className="px-sm py-4 text-label-sm text-on-surface-variant">Refills</th>
                <th className="px-sm py-4 text-label-sm text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td colSpan="6" className="px-sm py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-secondary"></div>
                    <p className="mt-2 text-slate-500">Loading medications...</p>
                  </td>
                </tr>
              ) : currentPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-sm py-12 text-center text-slate-500">
                    No medications found matching your criteria
                  </td>
                </tr>
              ) : (
                currentPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-sm py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${prescription.status === 'active' ? 'bg-secondary-container/10' : 'bg-slate-100'}`}>
                          <span className={`material-symbols-outlined text-[20px] ${prescription.status === 'active' ? 'text-secondary' : 'text-slate-500'}`}>
                            {prescription.status === 'active' ? 'medication' : 'pill'}
                          </span>
                        </div>
                        <div>
                          <p className="text-body-md font-bold">{prescription.medications[0].name}</p>
                          <p className="text-label-sm text-slate-400">Dr. {prescription.prescribedBy}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-sm py-4 text-body-md">{prescription.medications[0].dosage}</td>
                    <td className="px-sm py-4 text-body-md">{prescription.medications[0].frequency}</td>
                    <td className="px-sm py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-label-sm ${
                        prescription.status === 'active' ? 'bg-secondary-container/10 text-secondary' :
                        prescription.status === 'expired' ? 'bg-error-container/10 text-error' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-sm py-4">
                      {prescription.status === 'completed' ? (
                        <span className="text-label-sm font-medium text-slate-400">N/A</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${prescription.medications[0].refills === 0 ? 'bg-error w-0' : 'bg-secondary'}`}
                              style={{ width: `${Math.min(100, (prescription.medications[0].refills / 5) * 100)}%` }}
                            ></div>
                          </div>
                          <span className={`text-label-sm font-bold ${prescription.medications[0].refills === 0 ? 'text-error' : 'text-slate-700'}`}>
                            {prescription.medications[0].refills} left
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-sm py-4 text-right">
                      {prescription.status === 'active' && prescription.medications[0].refills > 0 ? (
                        <button 
                          onClick={() => handleRefillRequest(prescription)}
                          className="bg-on-surface text-white text-label-sm px-4 py-2 rounded-full hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Request Refill
                        </button>
                      ) : prescription.status === 'expired' || prescription.medications[0].refills === 0 ? (
                        <button className="text-secondary font-label-md px-4 py-2 hover:underline opacity-0 group-hover:opacity-100">
                          Contact Doctor
                        </button>
                      ) : (
                        <span className="text-label-sm text-slate-400 italic">Course finished</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-sm bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-label-sm font-bold text-slate-500 disabled:opacity-30 hover:text-secondary transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-8 h-8 rounded-lg text-label-sm font-bold transition-all ${
                    currentPage === i + 1 ? 'bg-secondary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-label-sm font-bold text-slate-500 disabled:opacity-30 hover:text-secondary transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Pharmacy Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] border border-slate-100 p-sm flex items-start gap-md">
          <div className="w-16 h-16 bg-slate-50 rounded-xl shadow-sm flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[32px]">local_pharmacy</span>
          </div>
          <div className="flex-1">
            <h4 className="font-h3 text-h3 text-slate-900 mb-base">Preferred Pharmacy</h4>
            <p className="text-body-md font-bold">Main St. Wellness Center</p>
            <p className="text-body-sm text-slate-500">1234 Healthcare Plaza, Suite 400</p>
            <div className="mt-sm flex items-center gap-sm">
              <span className="text-label-sm bg-slate-100 px-3 py-1 rounded-full">(555) 012-3456</span>
              <button className="text-secondary text-label-sm hover:underline">Change Pharmacy</button>
            </div>
          </div>
        </div>
        <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-xl p-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
              <p className="text-label-md font-bold text-on-secondary-container">Medication Tip</p>
            </div>
            <p className="text-body-md text-on-secondary-container">Taking medications at the same time every day helps maintain stable levels in your bloodstream. Set reminders on your phone or use our "Upcoming Dose" alert.</p>
          </div>
          <button className="text-secondary font-label-md mt-md flex items-center gap-1 hover:gap-2 transition-all self-start">
            View clinical drug info
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* FAB for Quick Refill Action */}
      <button 
        onClick={() => setShowRefillModal(true)}
        className="fixed bottom-gutter right-gutter w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-[100] group"
      >
        <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>


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