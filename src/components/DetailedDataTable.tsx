import { useState } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

interface DetailedDataTableProps {
  data: Array<{ [key: string]: string | number }>;
}

const formatValue = (value: string | number) => {
  if (typeof value === 'string') {
    return value;
  }
  if (value > 1000000) return `${(value / 1000000).toFixed(2)}M`;
  if (value > 1000) return `${(value / 1000).toFixed(2)}K`;
  if (value < 1) return value.toFixed(3);
  return value.toLocaleString();
};

export const DetailedDataTable = ({ data }: DetailedDataTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const currentData = data[0] || {};
  const previousData = data[1] || {};

  const metrics = [
    { key: 'Impressions', color: 'blue' },
    { key: 'Clicks', color: 'purple' },
    { key: 'CTPR', color: 'green' },
    { key: 'Ad Cost', color: 'red' },
    { key: 'CPC', color: 'orange' },
    { key: 'Sales', color: 'teal' }
  ];

  const metricColors: { [key: string]: { border: string, background: string } } = {
    'Impressions': { border: 'rgb(59, 130, 246)', background: 'rgba(59, 130, 246, 0.2)' },
    'Clicks': { border: 'rgb(147, 51, 234)', background: 'rgba(147, 51, 234, 0.2)' },
    'CTPR': { border: 'rgb(34, 197, 94)', background: 'rgba(34, 197, 94, 0.2)' },
    'Ad Cost': { border: 'rgb(239, 68, 68)', background: 'rgba(239, 68, 68, 0.2)' },
    'CPC': { border: 'rgb(249, 115, 22)', background: 'rgba(249, 115, 22, 0.2)' },
    'Sales': { border: 'rgb(20, 184, 166)', background: 'rgba(20, 184, 166, 0.2)' },
    'Ad Quantity': { border: 'rgb(236, 72, 153)', background: 'rgba(236, 72, 153, 0.2)' },
    'Ad GRP': { border: 'rgb(107, 114, 128)', background: 'rgba(107, 114, 128, 0.2)' },
    'Conversion%': { border: 'rgb(99, 102, 241)', background: 'rgba(99, 102, 241, 0.2)' },
    'Ad Sales': { border: 'rgb(20, 184, 166)', background: 'rgba(20, 184, 166, 0.2)' },
    'Ad Sales %': { border: 'rgb(20, 184, 166)', background: 'rgba(20, 184, 166, 0.2)' },
    'ACOS': { border: 'rgb(107, 114, 128)', background: 'rgba(107, 114, 128, 0.2)' },
  };

  const calculatePercentageChange = (current: string | number, previous: string | number) => {
    const curr = typeof current === 'string' ? parseFloat(current.replace(/[^0-9.-]+/g, '')) : current;
    const prev = typeof previous === 'string' ? parseFloat(previous.replace(/[^0-9.-]+/g, '')) : previous;
    return ((curr - prev) / prev) * 100;
  };

  // Helper function to generate dummy trend data for mini-charts
  const generateMiniTrendData = (currentValue: string | number, previousValue: string | number, metricKey: string) => {
    const parseNum = (val: string | number) => typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val;
    const curr = parseNum(currentValue);
    const prev = parseNum(previousValue);

    const values = [prev, (curr + prev) / 2, curr]; // Simple 3-point trend

    return {
      labels: ['Prev', '', 'Curr'],
      datasets: [
        {
          data: values,
          borderColor: metricColors[metricKey]?.border || 'rgba(79, 70, 229, 0.8)',
          backgroundColor: metricColors[metricKey]?.background || 'rgba(79, 70, 229, 0.2)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 1.5,
        },
      ],
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Detailed Metrics</h2>
        <p className="text-sm text-gray-500">Performance comparison with previous period</p>
      </div>

      <div className="space-y-4">
        {metrics.map(({ key, color }) => {
          const currentValue = currentData[key];
          const previousValue = previousData[key];
          const percentChange = calculatePercentageChange(currentValue, previousValue);
          const isPositiveChange = percentChange >= 0;

          return (
            <div
              key={key}
              className={`p-4 rounded-lg transition-all duration-200 transform
                ${hoveredRow === key ? 'bg-gray-50 scale-[1.02] shadow-md' : 'bg-white'}
              }`}
              onMouseEnter={() => setHoveredRow(key)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-${color}-600 font-semibold`}>{key}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    isPositiveChange 
                      ? 'text-green-700 bg-green-50' 
                      : 'text-red-700 bg-red-50'
                  }`}>
                    {isPositiveChange ? (
                      <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(percentChange).toFixed(1)}%
                  </span>
                </div>
              </div>

              {hoveredRow === key && (
                <div className="h-12 w-full mb-2">
                  <Line
                    data={generateMiniTrendData(currentValue, previousValue, key)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          enabled: false, // Tooltip on mini-chart not needed, main info is displayed in card
                        },
                      },
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                      animation: {
                        duration: 800,
                        easing: 'easeOutQuart',
                      },
                    }}
                  />
                </div>
              )}

              <div className="relative h-16 bg-gray-100 rounded-lg overflow-hidden">
                {/* Previous Period Bar */}
                <div className="absolute inset-y-0 left-0 w-full flex items-center px-3">
                  <div className={`h-4 bg-${color}-200 rounded-full transition-all duration-300 opacity-60`}
                       style={{ width: '100%' }}>
                    <div className="flex items-center justify-between h-full px-3">
                      <span className="text-xs font-medium text-gray-600">Previous</span>
                      <span className="text-xs font-semibold text-gray-800">{formatValue(previousValue)}</span>
                    </div>
                  </div>
                </div>

                {/* Current Period Bar */}
                <div className="absolute inset-y-0 left-0 w-full flex items-center px-3 pt-6">
                  <div className={`h-4 bg-${color}-500 rounded-full transition-all duration-300`}
                       style={{ 
                         width: `${(parseFloat(String(currentValue)) / (parseFloat(String(previousValue)))) * 100}%`
                       }}>
                    <div className="flex items-center justify-between h-full px-3">
                      <span className="text-xs font-medium text-white">Current</span>
                      <span className="text-xs font-semibold text-white">{formatValue(currentValue)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Daily Avg</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {formatValue(parseFloat(String(currentValue)) / 30)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Peak</div>
                  <div className="text-sm font-semibold text-gray-700">
                    {formatValue(parseFloat(String(currentValue)) * 1.2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Growth</div>
                  <div className={`text-sm font-semibold ${
                    isPositiveChange ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositiveChange ? '+' : ''}{percentChange.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
