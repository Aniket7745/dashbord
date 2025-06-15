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
  ChartOptions
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MetricGrowth {
  label: string;
  growth: number;
  value?: string | number;
  previousValue?: string | number;
}

interface DetailedMetricsBarChartProps {
  metrics: MetricGrowth[];
}

const formatValue = (value: string | number | undefined) => {
  if (value === undefined) return '';
  if (typeof value === 'number') {
    if (value > 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(2)}K`;
    if (value < 1) return value.toFixed(3);
    return value.toLocaleString();
  }
  return value;
};

export const DetailedMetricsBarChart: React.FC<DetailedMetricsBarChartProps> = ({ metrics }) => {
  const barColors = [
    'rgba(59, 130, 246, 0.7)', // blue
    'rgba(147, 51, 234, 0.7)', // purple
    'rgba(34, 197, 94, 0.7)',  // green
    'rgba(239, 68, 68, 0.7)',  // red
    'rgba(249, 115, 22, 0.7)',  // orange
    'rgba(20, 184, 166, 0.7)',  // teal
    'rgba(236, 72, 153, 0.7)',  // pink
    'rgba(99, 102, 241, 0.7)',  // indigo
    'rgba(107, 114, 128, 0.7)', // gray
  ];

  const borderColors = [
    'rgb(59, 130, 246)',
    'rgb(147, 51, 234)',
    'rgb(34, 197, 94)',
    'rgb(239, 68, 68)',
    'rgb(249, 115, 22)',
    'rgb(20, 184, 166)',
    'rgb(236, 72, 153)',
    'rgb(99, 102, 241)',
    'rgb(107, 114, 128)',
  ];

  const data = {
    labels: metrics.map(m => m.label),
    datasets: [
      {
        label: '% Growth',
        data: metrics.map(m => m.growth),
        backgroundColor: metrics.map((_, i) => barColors[i % barColors.length]),
        borderColor: metrics.map((_, i) => borderColors[i % borderColors.length]),
        borderWidth: 1,
        barPercentage: 0.25,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Detailed Metrics Growth %',
        font: {
          size: 16,
          weight: 'bold' as const
        },
        color: '#1f2937',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'white',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 6,
        caretSize: 8,
        callbacks: {
          label: (ctx: { dataIndex: number; parsed: { y: number } }) => {
            const metric = metrics[ctx.dataIndex];
            const lines = [
              `Growth: ${ctx.parsed.y > 0 ? '+' : ''}${ctx.parsed.y.toFixed(1)}%`
            ];
            
            if (metric.value !== undefined) {
              lines.push(`Current: ${formatValue(metric.value)}`);
            }
            if (metric.previousValue !== undefined) {
              lines.push(`Previous: ${formatValue(metric.previousValue)}`);
            }
            
            return lines;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(this: unknown, tickValue: string | number) {
            const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
            return `${value > 0 ? '+' : ''}${value}%`;
          },
          color: '#6b7280',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      x: {
        ticks: {
          font: {
            weight: 'bold' as const
          },
          color: '#6b7280',
        },
        grid: {
          display: false,
        },
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="p-4 h-full">
      <Bar data={data} options={options} style={{ height: '100%', width: '100%' }} />
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {metrics.map(metric => (
          <div 
            key={metric.label} 
            className="group text-center p-2 bg-white rounded-lg shadow hover:bg-white w-full sm:w-[calc(50%-4px)] md:w-[calc(33.33%-6px)] lg:w-[calc(25%-6px)]"
          >
            <div className="font-bold text-gray-900 text-sm">{metric.label}</div>
            <div className="text-xs mt-1">
              <div className="font-medium text-gray-600">Current: {formatValue(metric.value)}</div>
              <div className="font-medium text-gray-600">Previous: {formatValue(metric.previousValue)}</div>
              <div className={`font-bold text-lg transition-colors duration-200
                ${metric.growth >= 0 ? 'group-hover:text-green-600' : 'group-hover:text-red-600'} text-gray-900`}>
                {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
