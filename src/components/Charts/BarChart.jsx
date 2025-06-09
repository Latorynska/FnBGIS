import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ branches }) => {
  const colors = [
    'rgba(16, 185, 129, 0.7)', // green
    'rgba(59, 130, 246, 0.7)', // blue
    'rgba(245, 158, 11, 0.7)', // yellow
    'rgba(239, 68, 68, 0.7)'   // red
  ];
  const borderColors = [
    'rgba(16, 185, 129, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)'
  ];

  const chartData = useMemo(() => {
    return {
      labels: branches.map(b => b.name),
      datasets: [
        {
          label: 'Revenue',
          data: branches.map(b => b.revenue),
          backgroundColor: branches.map((_, i) => colors[i % colors.length]),
          borderColor: branches.map((_, i) => borderColors[i % borderColors.length]),
          borderWidth: 1,
          borderRadius: 6,
        }
      ]
    };
  }, [branches]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `Revenue: $${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value) => `$${value.toLocaleString()}`
        }
      }
    }
  };

  return (
  <div className="relative w-full h-full">
    <Bar data={chartData} options={options} />
  </div>
);

};

export default BarChart;
