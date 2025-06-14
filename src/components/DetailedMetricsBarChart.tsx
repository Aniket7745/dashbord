import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
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
  const data = {
    labels: metrics.map(m => m.label),
    datasets: [
      {
        label: '% Growth',
        data: metrics.map(m => m.growth),
        backgroundColor: metrics.map(m => m.growth >= 0 ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)'),
        borderColor: metrics.map(m => m.growth >= 0 ? 'rgba(34,197,94,1)' : 'rgba(239,68,68,1)'),
        borderWidth: 1,
        barPercentage: 0.25,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Detailed Metrics Growth %',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
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
        },
      },
      x: {
        ticks: {
          font: {
            weight: 'bold' as const
          }
        }
      }
    },
  };

  return (
    <div className="p-4 h-full">
      <Bar data={data} options={options} style={{ height: '100%', width: '100%' }} />
      <div className="mt-4 grid grid-cols-4 gap-4">
        {metrics.map(metric => (
          <div key={metric.label} className="group text-center p-3 bg-white rounded-lg shadow hover:bg-white">
            <div className="font-bold text-gray-900">{metric.label}</div>
            <div className="text-sm mt-1">
              <div className="font-medium text-gray-600">Current: {formatValue(metric.value)}</div>
              <div className="font-medium text-gray-600">Previous: {formatValue(metric.previousValue)}</div>
              <div className={`font-bold text-2xl transition-colors duration-200
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
