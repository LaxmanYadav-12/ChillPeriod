'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@/contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AttendanceTrendChart({ attendanceLog, overallPercentage }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Calculate last 7 days trend
  // We need to reconstruct the percentage for each of the last 7 days
  const labels = [];
  const dataPoints = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. "Mon"
    labels.push(dateStr);
    
    // For now, simpler logic:
    // If we have data for this specific day, use it? 
    // Or better: Reconstruct cumulative stats? 
    // Reconstructing exact cumulative stats is complex without full history.
    // simpler approach: 
    // 1. Get total attended/total classes UP TO each day.
    // But we only have the current total.
    // So we work backwards!
    
    // Actually, for "Trend", users usually want to see their *daily performance* or *cumulative*.
    // Let's show Cumulative Trend.
    // But working backwards from current is tricky if we don't have ALL logs.
    // If we assume `attendanceLog` has all recent history...
  }

  // Improved Logic:
  // We will assume the current `overallPercentage` is for Today.
  // We will look at `attendanceLog` to see what changed yesterday, day before, etc.
  // Then reverse-engineer the percentage.
  
  const history = [];
  // Key: "YYYY-MM-DD"
  // Value: { attended: 0, total: 0 } (delta)
  
  // Create a map of changes per day
  const changesMap = {};
  if (attendanceLog) {
      Object.entries(attendanceLog).forEach(([date, dayLog]) => {
         const attended = dayLog.attended || 0;
         const bunked = dayLog.bunked || 0;
         changesMap[date] = { attended, total: attended + bunked };
      });
  }
  
  // Current state (from props, or passed down)
  // We need total classes and attended classes passed as props ideally. 
  // But we can accept them or just use the passed log if it was full history (it's not always).
  
  // FALLBACK: Just show the daily "Efficiency" for the last 7 days?
  // e.g. "On Monday I had 100% attendance", "On Tuesday 50%".
  // This is easier and often more useful than a slow-moving cumulative line.
  // Let's do "Daily Efficiency".
  
  const dailyData = [];
  const dailyLabels = [];
  
  for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;
      
      const dayStats = changesMap[dateKey] || { attended: 0, total: 0 };
      
      let pct = 100; // Default to 100 if no classes? Or 0? 
      // Usually "No classes" = "Neutral". Let's say null or skip?
      // Charts handle nulls.
      
      if (dayStats.total > 0) {
          pct = Math.round((dayStats.attended / dayStats.total) * 100);
          dailyData.push(pct);
      } else {
          dailyData.push(null); // No classes that day
      }
      
      dailyLabels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
  }

  const data = {
    labels: dailyLabels,
    datasets: [{
      label: 'Daily Attendance %',
      data: dailyData,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      spanGaps: true // Connect points over nulls
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
      <Line data={data} options={options} />
    </div>
  );
}
