import { 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  PresentationChartLineIcon,
  UsersIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { TrendData } from '@/utils/excelUtils';
import React, { useState, useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

interface MetricCardProps {
  title: string;
  value: string | number;
  trendData?: TrendData;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const getIconForMetric = (metricName: string) => {
  const name = metricName.toLowerCase();
  if (name.includes('sales')) return CurrencyDollarIcon;
  if (name.includes('cost')) return ChartBarIcon;
  if (name.includes('clicks')) return UsersIcon;
  if (name.includes('conversion')) return ChartPieIcon;
  if (name.includes('quantity')) return ShoppingCartIcon;
  return PresentationChartLineIcon;
};

const formatValue = (value: string | number) => {
  if (typeof value === 'number') {
    if (value > 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(2)}K`;
    if (value < 1) return value.toFixed(3);
    return value.toLocaleString();
  }
  return value;
};

export const MetricCard = ({ title, value, trendData, previousValue }: MetricCardProps & { previousValue?: string | number }) => {
  const Icon = getIconForMetric(title);
  const [isHovered, setIsHovered] = useState(false);

  const colors = {
    bg: title.toLowerCase().includes('impressions') ? 'bg-blue-100' :
        title.toLowerCase().includes('clicks') ? 'bg-purple-100' :
        title.toLowerCase().includes('ctpr') ? 'bg-green-100' :
        title.toLowerCase().includes('cost') ? 'bg-red-100' :
        title.toLowerCase().includes('cpc') ? 'bg-orange-100' :
        title.toLowerCase().includes('sales') ? 'bg-teal-100' :
        title.toLowerCase().includes('quantity') ? 'bg-pink-100' :
        title.toLowerCase().includes('conversion') ? 'bg-indigo-100' :
        'bg-gray-100',
    text: title.toLowerCase().includes('impressions') ? 'text-blue-600 font-bold' :
          title.toLowerCase().includes('clicks') ? 'text-purple-600 font-bold' :
          title.toLowerCase().includes('ctpr') ? 'text-green-600 font-bold' :
          title.toLowerCase().includes('cost') ? 'text-red-600 font-bold' :
          title.toLowerCase().includes('cpc') ? 'text-orange-600 font-bold' :
          title.toLowerCase().includes('sales') ? 'text-teal-600 font-bold' :
          title.toLowerCase().includes('quantity') ? 'text-pink-600 font-bold' :
          title.toLowerCase().includes('conversion') ? 'text-indigo-600 font-bold' :
          'text-gray-600 font-bold',
    chart: title.toLowerCase().includes('impressions') ? 'rgb(59, 130, 246)' :
           title.toLowerCase().includes('clicks') ? 'rgb(147, 51, 234)' :
           title.toLowerCase().includes('ctpr') ? 'rgb(34, 197, 94)' :
           title.toLowerCase().includes('cost') ? 'rgb(239, 68, 68)' :
           title.toLowerCase().includes('cpc') ? 'rgb(249, 115, 22)' :
           title.toLowerCase().includes('sales') ? 'rgb(20, 184, 166)' :
           title.toLowerCase().includes('quantity') ? 'rgb(236, 72, 153)' :
           title.toLowerCase().includes('conversion') ? 'rgb(99, 102, 241)' :
           'rgb(107, 114, 128)',
    glow: title.toLowerCase().includes('impressions') ? 'hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]' :
          title.toLowerCase().includes('clicks') ? 'hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]' :
          title.toLowerCase().includes('ctpr') ? 'hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]' :
          title.toLowerCase().includes('cost') ? 'hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
          title.toLowerCase().includes('cpc') ? 'hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
          title.toLowerCase().includes('sales') ? 'hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]' :
          title.toLowerCase().includes('quantity') ? 'hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]' :
          title.toLowerCase().includes('conversion') ? 'hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]' :
          'hover:shadow-[0_0_15px_rgba(107,114,128,0.5)]'
  };

  const defaultTrendData = {
    values: Array(12).fill(0).map(() => Math.random() * 100),
    labels: Array(12).fill(''),
    max: 100,
    min: 0
  };

  const chartData = trendData || defaultTrendData;

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const parseValue = (val: string | number) => {
    if (typeof val === 'string') {
      const numStr = val.replace(/[^0-9.-]+/g, '');
      return parseFloat(numStr);
    }
    return val;
  };

  const currentNumericValue = parseValue(value);
  const previousNumericValue = parseValue(previousValue || 0);

  const percentageChange = previousNumericValue !== 0 
    ? ((currentNumericValue - previousNumericValue) / previousNumericValue) * 100 
    : 0;

  const isPositiveChange = percentageChange >= 0;

  return (
    <div 
      className={`relative bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${colors.glow}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <Icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <h3 className="text-base font-semibold text-gray-700">
                {title.toUpperCase().replace(/_/g, ' ')}
              </h3>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              {formatValue(value)}
            </div>
          </div>
          <div className="h-16 mt-4">
            {isClient && (
              <Line
                data={{
                  labels: chartData.labels,
                  datasets: [{
                    data: chartData.values,
                    fill: true,
                    borderColor: colors.chart,
                    backgroundColor: (context) => {
                      const ctx = context.chart.ctx;
                      const gradient = ctx.createLinearGradient(0, 0, 0, 160);
                      const rgba = colors.chart.replace('rgb', 'rgba').replace(')', ',0.8)');
                      gradient.addColorStop(0, rgba);
                      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
                      return gradient;
                    },
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: (ctx) => {
                      const data = chartData.values;
                      const index = ctx.dataIndex;
                      if (index === data.length - 1 || // Latest value
                          index === data.indexOf(Math.max(...data)) || // Max value
                          index === data.indexOf(Math.min(...data))) { // Min value
                        return 4;
                      }
                      return 0;
                    },
                    pointBackgroundColor: 'white',
                    pointBorderColor: colors.chart,
                    pointBorderWidth: 2,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      display: false,
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      display: false,
                      grid: {
                        display: false,
                      },
                      min: chartData.min * 0.9,
                      max: chartData.max * 1.1,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-start h-full">
          <h3 className="text-base font-semibold text-gray-700 mb-2">
            {title.toUpperCase().replace(/_/g, ' ')}
          </h3>
          <div className="text-sm text-gray-500 mb-1">
            Current: <span className="font-bold text-gray-900">{formatValue(value)}</span>
          </div>
          <div className="text-sm text-gray-500 mb-3">
            Previous: <span className="font-bold text-gray-900">{formatValue(previousValue || 'N/A')}</span>
          </div>
          <div className={`text-xl font-bold ${
            isPositiveChange ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositiveChange ? '+' : ''}{percentageChange.toFixed(1)}%
            <span className="text-base font-normal text-gray-500 ml-1">vs previous</span>
          </div>
        </div>
      )}
    </div>
  );
};
