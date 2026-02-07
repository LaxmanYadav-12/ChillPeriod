'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useTheme } from '@/contexts/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SubjectPieChart({ courses }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Calculate subject-wise attendance
  const subjectData = courses.map(course => ({
    name: course.name,
    percentage: course.totalClasses > 0 ? Math.round((course.attendedClasses / course.totalClasses) * 100) : 100
  }));

  const data = {
    labels: subjectData.map(s => s.name),
    datasets: [{
      data: subjectData.map(s => s.percentage),
      backgroundColor: [
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
        '#ec4899', // Pink
        '#10b981', // Green
        '#f59e0b', // Amber
        '#ef4444', // Red
      ],
      borderColor: 'var(--bg-primary)',
      borderWidth: 3,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#ffffff' : '#000000',
          padding: 15,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1a1a24' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#1f2937',
        bodyColor: isDark ? '#e5e7eb' : '#4b5563',
        borderColor: isDark ? '#2a2a3a' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 13,
          weight: '600'
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
}
