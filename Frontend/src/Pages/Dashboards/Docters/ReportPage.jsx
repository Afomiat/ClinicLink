import React, { useState, useEffect } from 'react';
import { Doughnut, PolarArea, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  ArcElement, 
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
  Title, 
  Legend 
} from 'chart.js';
import styles from './ReportPage.module.css';
import { FaStethoscope, FaClock } from 'react-icons/fa';
import api from './Doc_Api/Dashboard_api'; // Import your API service

// Register Chart.js components
ChartJS.register(
  RadialLinearScale, 
  ArcElement, 
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const SummaryCircles = ({ summaryStats }) => {
  const circleData = {
    labels: [''],
    datasets: [
      {
        data: [100],
        backgroundColor: ['#f0f0f0'],
        borderWidth: 0
      },
      {
        data: [100],
        backgroundColor: ['#f0f0f0'],
        borderWidth: 0
      },
      {
        data: [100],
        backgroundColor: ['#f0f0f0'],
        borderWidth: 0
      }
    ]
  };

  const circleOptions = {
    cutout: '70%',
    rotation: -90,
    circumference: 190,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };

  return (
    <div className={styles.summaryCirclesContainer}>
      {/* Total Patients Circle */}
      <div className={styles.summaryCircle}>
        <div className={`${styles.circleChart} ${styles.totPatient}`}>
          <Doughnut 
            data={{
              ...circleData,
              datasets: [{
                ...circleData.datasets[0],
                data: [summaryStats.totalPatients, 100 - summaryStats.totalPatients],
                backgroundColor: ['#4bc0c0', '#f0f0f0']
              }]
            }} 
            options={circleOptions} 
          />
          <div className={styles.circleValue}>{summaryStats.totalPatients}</div>
        </div>
        <div className={styles.circleLabel}>Total Patients</div>
      </div>

      {/* Total Prescriptions Circle */}
      <div className={styles.summaryCircle}>
        <div className={`${styles.circleChart} ${styles.totPrescriptions}`}>
          <Doughnut 
            data={{
              ...circleData,
              datasets: [{
                ...circleData.datasets[1],
                data: [summaryStats.totalPrescriptions, 100 - summaryStats.totalPrescriptions],
                backgroundColor: ['#ff9f40', '#f0f0f0']
              }]
            }} 
            options={circleOptions} 
          />
          <div className={styles.circleValue}>{summaryStats.totalPrescriptions}</div>
        </div>
        <div className={styles.circleLabel}>Prescriptions</div>
      </div>
            
      {/* Total Lab Tests Circle */}
      <div className={styles.summaryCircle}>
        <div className={`${styles.circleChart} ${styles.totLab}`}>
          <Doughnut 
            data={{
              ...circleData,
              datasets: [{
                ...circleData.datasets[2],
                data: [summaryStats.totalLabTests, 100 - summaryStats.totalLabTests],
                backgroundColor: ['#9966ff', '#f0f0f0']
              }]
            }} 
            options={circleOptions} 
          />
          <div className={styles.circleValue}>{summaryStats.totalLabTests}</div>
        </div>
        <div className={styles.circleLabel}>Lab Tests</div>
      </div>
    </div>
  );
};

const ReportPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    summaryStats: {
      totalPatients: 0,
      totalPrescriptions: 0,
      totalLabTests: 0
    },
    todaysSummary: {
      completedAppointments: 0,
      pendingAppointments: 0,
      noShows: 0,
      newPatients: 0
    },
    patients: [],
    diagnosisStats: [],
    labTests: []
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Fetch all data in parallel
        const [
          summaryRes,
          appointmentsRes,
          patientsRes,
          diagnosisRes,
          labTestsRes
        ] = await Promise.all([
          api.getSummaryStats(),
          api.getTodaysAppointments(),
          api.getPatients(),
          api.getDiagnosisStats(),
          api.getLabTests()
        ]);

        setReportData({
          summaryStats: summaryRes.data,
          todaysSummary: appointmentsRes.data,
          patients: patientsRes.data,
          diagnosisStats: diagnosisRes.data,
          labTests: labTestsRes.data
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching report data:", err);
      }
    };

    fetchReportData();
  }, []);

  if (loading) return <div className={styles.container}>Loading reports...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;

  const getPatientsByCategory = () => {
    switch (selectedCategory) {
      case 'complete':
        return reportData.patients.filter(patient => patient.status === 'complete');
      case 'pending':
        return reportData.patients.filter(patient => patient.status === 'pending');
      case 'all':
      default:
        return reportData.patients;
    }
  };

  const patientsToShow = getPatientsByCategory();

  // Prepare chart data
  const polarData = {
    labels: ['Completed', 'Pending', 'No-Shows', 'New'],
    datasets: [{
      label: "Today's Appointments",
      data: [
        reportData.todaysSummary.completedAppointments,
        reportData.todaysSummary.pendingAppointments,
        reportData.todaysSummary.noShows,
        reportData.todaysSummary.newPatients,
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)',   // Completed
        'rgba(255, 206, 86, 0.7)',   // Pending
        'rgba(255, 99, 132, 0.7)',   // No-Shows
        'rgba(54, 162, 235, 0.7)',   // New Patients
      ],
      borderWidth: 1,
    }]
  };

  const diagnosisData = {
    labels: reportData.diagnosisStats.map(item => item.diagnosis),
    datasets: [
      {
        label: 'Female',
        data: reportData.diagnosisStats.map(item => item.female),
        backgroundColor: 'rgba(255, 182, 193, 0.7)',
        borderColor: 'rgba(255, 182, 193, 1)',
        borderWidth: 1,
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
      {
        label: 'Male',
        data: reportData.diagnosisStats.map(item => item.male),
        backgroundColor: 'rgba(173, 216, 230, 0.7)',
        borderColor: 'rgba(173, 216, 230, 1)',
        borderWidth: 1,
        borderRadius: 1,
        borderSkipped: false,
      }
    ]
  };

  const polarOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Diagnoses Handled',
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Diagnosis Type'
        },
        grid: {
          display: false
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Cases'
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    maintainAspectRatio: false,
    barPercentage: 0.6,
    categoryPercentage: 0.8
  };

  return (
    <div className={styles.container}>
      <SummaryCircles summaryStats={reportData.summaryStats} />

      {/* Polar Area Chart Section */}
      <div className={`${styles.chartSection} ${styles.polarChart}`}>
        <h2 className={styles.sectionTitle}>Appointments This Week</h2>

        <div className={styles.customLegend}>
          {polarData.labels.map((label, index) => (
            <div key={index} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: polarData.datasets[0].backgroundColor[index] }}
              />
              <span className={styles.legendText}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.chartWrapper}>
          <PolarArea data={polarData} options={polarOptions} />
        </div>
      </div>

      {/* Diagnosis Bar Chart Section */}
      <div className={styles.diagnosisChart}>
        <div className={`${styles.chartWrapper} ${styles.diagnosisWrapper}`} >
          <Bar className={styles.diagnosisCh} data={diagnosisData} options={barOptions} />
        </div>
      </div>

      {/* Patient Reports Section */}
      <div className={styles.patientReports}>
        <h2 className={styles.sectionTitle}>Patient Appointments</h2>
        
        {patientsToShow.length === 0 ? (
          <p>No patients found for the selected category.</p>
        ) : (
          <div className={styles.reportList}>
            <div className={styles.filterButtons}>
              <div className={styles.slider} style={{ 
                transform: `translateX(${
                  selectedCategory === 'all' ? 0 : 
                  selectedCategory === 'complete' ? 100 : 200
                }%)` 
              }} />
              <button 
                onClick={() => setSelectedCategory('all')} 
                className={styles.filterButton}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedCategory('complete')} 
                className={styles.filterButton}
              >
                Complete
              </button>
              <button 
                onClick={() => setSelectedCategory('pending')} 
                className={styles.filterButton}
              >
                Pending
              </button>
            </div>

            <div className={styles.listContainer}>
              {patientsToShow.map((patient, index) => (
                <div key={index} className={styles.reportCard}>
                  <div className={`${styles.reportItem} ${styles.NameTime}`}>
                    <h3>{patient.name}</h3>
                    <FaClock className={styles.clockIcon} /> 
                    <span>{patient.time}</span> 
                  </div>          
                  <div className={styles.reportItem}>
                    <FaStethoscope className={styles.diagnosis} /> 
                    <span>{patient.diagnosis}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.labTestsContainer}>
        <div className={styles.colorCircle}>
          <h3 className={`${styles.labTestsTitle} ${styles.sectionTitle}`}>Lab Test Completion</h3>
          <span>
            <div className={styles.color}></div>
            <p>Completed</p>
          </span>
        </div>
      
        <div className={styles.progressBarsContainer}>
          {reportData.labTests.map((test, index) => (
            <div key={index} className={styles.progressBarItem}>
              <div className={styles.testInfo}>
                <span className={styles.testName}>{test.name}</span>
                <span className={styles.testPercentage}>{test.progress}%</span>
              </div>
              
              <div className={styles.progressBarBackground}>
                <div 
                  className={styles.progressBarFill}
                  style={{ width: `${test.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportPage;