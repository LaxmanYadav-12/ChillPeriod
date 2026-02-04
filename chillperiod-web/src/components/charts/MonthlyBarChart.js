'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@/contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyBarChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Sample data for past 6 months
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Monthly Attendance %',
      data: [78, 82, 85, 88, 90, 92],
      backgroundColor: [
        '#ef4444',
        '#f59e0b',
        '#f59e0b',
        '#10b981',
        '#10b981',
        '#10b981',
      ],
      borderColor: 'var(--bg-primary)',
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#1a1a24' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#1f2937',
        bodyColor: isDark ? '#e5e7eb' : '#4b5563',
        borderColor: isDark ? '#2a2a3a' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: '600'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            return `${context.parsed.y}% attendance`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 70,
        max: 100,
        ticks: {
          color: isDark ? '#ffffff' : '#000000',
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: isDark ? '#2a2a3a' : '#e5e7eb',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: isDark ? '#ffffff' : '#000000'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
