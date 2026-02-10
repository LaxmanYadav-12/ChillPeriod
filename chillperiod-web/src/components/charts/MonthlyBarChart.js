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

export default function MonthlyBarChart({ attendanceLog }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Calculate monthly stats
  // 1. Identify last 6 months
  const months = [];
  const today = new Date();
  
  for (let i = 5; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      months.push({
          name: d.toLocaleString('default', { month: 'short' }),
          year: d.getFullYear(),
          monthIdx: d.getMonth(), // 0-11
          total: 0,
          attended: 0
      });
  }

  // 2. Aggregate from log
  if (attendanceLog) {
      Object.entries(attendanceLog).forEach(([dateStr, dayLog]) => {
          // dateStr is "YYYY-MM-DD"
          const [y, m, d] = dateStr.split('-').map(Number);
          // m is 1-12 in string, but we stored it how? 
          // attendance/page.js says dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}...`
          // So m is 1-based.
          
          const monthIdx = m - 1; // 0-11
          
          const targetMonth = months.find(mo => mo.monthIdx === monthIdx && mo.year === y);
          if (targetMonth) {
              const att = dayLog.attended || 0;
              const bunk = dayLog.bunked || 0;
              targetMonth.attended += att;
              targetMonth.total += (att + bunk);
          }
      });
  }

  const data = {
    labels: months.map(m => m.name),
    datasets: [{
      label: 'Monthly Attendance %',
      data: months.map(m => m.total > 0 ? Math.round((m.attended / m.total) * 100) : 0),
      backgroundColor: months.map(m => {
          const pct = m.total > 0 ? (m.attended / m.total) * 100 : 0;
          if (pct >= 80) return '#10b981'; // Green
          if (pct >= 75) return '#f59e0b'; // Amber
          return '#ef4444'; // Red
      }),
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
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
