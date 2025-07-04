import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ChartEvent, ActiveElement, TooltipItem } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesDistributionPieProps {
  adSales: number;
  totalSales: number;
}

export const SalesDistributionPie = ({ adSales, totalSales }: SalesDistributionPieProps) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  const organicSales = totalSales - adSales;
  const adSalesPercentage = ((adSales / totalSales) * 100).toFixed(1);
  const organicSalesPercentage = ((organicSales / totalSales) * 100).toFixed(1);

  // Calculate month-over-month change (mock data for demonstration)
  const monthOverMonthChange = {
    ad: 12.5,
    organic: -3.2
  };

  const data = {
    labels: ['Ad Sales', 'Organic Sales'],
    datasets: [
      {
        data: [adSales, organicSales],
        backgroundColor: [
          hoveredSegment === 0 ? 'rgb(79, 70, 229)' : 'rgba(79, 70, 229, 0.8)',
          hoveredSegment === 1 ? 'rgb(16, 185, 129)' : 'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'white',
          'white',
        ],
        borderWidth: 2,
        hoverOffset: 12,
        hoverBorderWidth: 4,
        offset: [hoveredSegment === 0 ? 8 : 0, hoveredSegment === 1 ? 8 : 0],
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const value = context.parsed;
            const percentage = context.dataIndex === 0 ? adSalesPercentage : organicSalesPercentage;
            const change = context.dataIndex === 0 ? monthOverMonthChange.ad : monthOverMonthChange.organic;
            return [
              `${context.label}: $${value.toLocaleString()}`,
              `Share: ${percentage}%`,
              `MoM Change: ${change > 0 ? '+' : ''}${change}%`
            ];
          },
          value: function(context: TooltipItem<'doughnut'>) {
            return context.parsed;
          }
        }
      }
    },
    cutout: '75%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 800,
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length) {
        setHoveredSegment(elements[0].index);
      } else {
        setHoveredSegment(null);
      }
    },
  };

  const renderMetricCard = (
    title: string,
    value: number,
    percentage: string,
    change: number,
    index: number,
    colorClass: string
  ) => (
    <div 
      className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
        hoveredSegment === index 
          ? `border-${colorClass}-200 bg-${colorClass}-50/50 shadow-md transform scale-[1.02]` 
          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
      }`}
      onMouseEnter={() => setHoveredSegment(index)}
      onMouseLeave={() => setHoveredSegment(null)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium text-gray-500 ${hoveredSegment === index ? 'font-semibold text-gray-700' : ''}`}>{title}</span>
          <span className={`text-sm font-medium ${
            hoveredSegment === index 
              ? `text-${colorClass}-700 text-xl font-extrabold` 
              : change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className={`text-xl font-bold ${
            hoveredSegment === index 
              ? `text-${colorClass}-700 text-2xl font-extrabold` 
              : value < 0 ? 'text-red-600' : `text-${colorClass}-600`
          }`}>
            ${value.toLocaleString()}
          </span>
          <span className={`text-sm ${
            hoveredSegment === index 
              ? `text-${colorClass}-600 text-base font-semibold` 
              : value < 0 ? 'text-red-600' : `text-${colorClass}-500`
          }`}>
            ({percentage}%)
          </span>
        </div>
      </div>
      <div className={`h-1 w-full bg-${colorClass}-100`}>
        <div 
          className={`h-full bg-${colorClass}-500 transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="relative h-[280px] mb-6">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`transition-all duration-300 text-center ${
            hoveredSegment !== null 
              ? 'transform scale-90 opacity-50' 
              : 'transform scale-100 opacity-100'
          }`}>
            <div className="text-4xl font-extrabold text-gray-900">
              ${totalSales.toLocaleString()}
            </div>
            <div className="text-base font-medium text-gray-600 mt-1">
              Total Sales
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {renderMetricCard(
          'Ad Sales',
          adSales,
          adSalesPercentage,
          monthOverMonthChange.ad,
          0,
          'indigo'
        )}
        {renderMetricCard(
          'Organic Sales',
          organicSales,
          organicSalesPercentage,
          monthOverMonthChange.organic,
          1,
          'emerald'
        )}
      </div>
    </div>
  );
};
