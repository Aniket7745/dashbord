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
import ReactDOM from 'react-dom';

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

const metricDescriptions: { [key: string]: string } = {
  'Impressions': 'The total number of times your ad was shown. High impressions indicate good reach, but not necessarily engagement.',
  'Clicks': 'The number of times users clicked your ad. More clicks usually mean higher engagement.',
  'CTPR': 'Click-Through Performance Rate: the ratio of clicks to impressions, showing how effective your ad is at generating interest.',
  'Ad Cost': 'The total amount spent on advertising. Monitor this to control your marketing budget.',
  'CPC': 'Cost Per Click: the average amount you pay for each click on your ad.',
  'ACOS': 'Advertising Cost of Sales: the percentage of sales spent on advertising. Lower is usually better.',
  'Sales': 'Total sales revenue generated in the selected period.',
  'Ad Sales': 'Sales attributed directly to your ads.',
  'Ad Sales %': 'The percentage of total sales that came from ads.',
  'Ad Quantity': 'The number of items sold through ads.',
  'Ad GRP': 'Ad Gross Rating Points: a measure of ad exposure and frequency.',
  'Conversion%': 'The percentage of clicks that resulted in a sale.',
};

export const MetricCard = ({ title, value, trendData, previousValue }: MetricCardProps & { previousValue?: string | number }) => {
  const [hovered, setHovered] = useState(false);
  const [panelPos, setPanelPos] = useState<{ left: number; top: number } | null>(null);
  const Icon = getIconForMetric(title);
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
           'rgb(107, 114, 128)'
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

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:scale-105"
      style={hovered ? { boxShadow: `0 0 24px 4px ${colors.chart.replace('rgb', 'rgba').replace(')', ',0.18)')}` } : {}}
      onMouseEnter={e => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setPanelPos({
          left: rect.left + rect.width / 2,
          top: rect.top - 12 // 12px offset for -top-6
        });
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && panelPos && isClient && ReactDOM.createPortal(
        <div
          className="fixed z-[9999] w-[420px] bg-white rounded-2xl shadow-2xl p-5 border border-gray-200 animate-fade-in-up"
          style={{
            left: panelPos.left - 210, // center horizontally
            top: Math.max(panelPos.top, 16), // don't go above 16px from top
          }}
          onMouseLeave={() => setHovered(false)}
        >
          <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{title.toUpperCase().replace(/_/g, ' ')}</h3>
          <div className="flex flex-row items-center gap-4 mb-3">
            <div>
              <div className="text-gray-500 text-sm">Current</div>
              <div className="text-2xl font-bold mb-2" style={{ color: colors.chart }}>{formatValue(value)}</div>
              <div className="text-gray-500 text-sm">Previous</div>
              <div className="text-xl font-semibold text-gray-700">{formatValue(previousValue ?? 0)}</div>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-0">{metricDescriptions[title.replace(/_/g, ' ')] || 'No description available.'}</p>
            </div>
          </div>
        </div>,
        document.body
      )}
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
        </div>
      </div>
    </div>
  );
};
