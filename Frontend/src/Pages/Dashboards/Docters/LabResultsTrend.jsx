import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LabResultsTrend = () => {
  // Sample data - in a real app, this would come from props or API
  const data = {
    labels: ['Glucose', 'Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
    datasets: [
      {
        label: 'Current',
        data: [95, 180, 45, 110, 150],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'Previous',
        data: [102, 195, 40, 125, 170],
        backgroundColor: 'rgba(156, 163, 175, 0.7)',
      },
      {
        label: 'Normal Range',
        data: [70, 200, 40, 130, 150],
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        type: 'line',
        pointRadius: 0,
        fill: false
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Lab Results Comparison',
        font: {
          size: 14
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'mg/dL'
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '300px', marginBottom: '20px' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default LabResultsTrend;