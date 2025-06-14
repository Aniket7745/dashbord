import { useState } from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

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

  const calculatePercentageChange = (current: string | number, previous: string | number) => {
    const curr = typeof current === 'string' ? parseFloat(current.replace(/[^0-9.-]+/g, '')) : current;
    const prev = typeof previous === 'string' ? parseFloat(previous.replace(/[^0-9.-]+/g, '')) : previous;
    return ((curr - prev) / prev) * 100;
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
              className={`p-4 rounded-lg transition-all duration-200 ${
                hoveredRow === key ? 'bg-gray-50' : 'bg-white'
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
