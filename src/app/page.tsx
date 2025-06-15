'use client';

import { useState, useEffect } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { DetailedDataTable } from '@/components/DetailedDataTable';
import { SalesDistributionPie } from '@/components/SalesDistributionPie';
import { DetailedMetricsBarChart } from '@/components/DetailedMetricsBarChart';

interface PeriodData {
  [key: string]: string;
}

// Sample data structure
const sampleData: Record<'Current' | 'Previous', PeriodData> = {
  Current: {
    Impressions: '2.96M',
    Clicks: '19.43K',
    CTPR: '1.313',
    'Ad Cost': '400,938.13',
    CPC: '20.38',
    Sales: '532,135',
    'Ad Sales': '700,426.76',
    'Ad Quantity': '1,507',
    'Ad GRP': '929,593',
    'Conversion%': '7.66',
    ACOS: '114,487',
    'Ad Sales %': '68.838'
  },
  Previous: {
    Impressions: '2.45M',
    Clicks: '15.21K',
    CTPR: '1.105',
    'Ad Cost': '350,124.45',
    CPC: '18.92',
    Sales: '498,234',
    'Ad Sales': '650,321.54',
    'Ad Quantity': '1,324',
    'Ad GRP': '875,432',
    'Conversion%': '6.89',
    ACOS: '98,765',
    'Ad Sales %': '62.543'
  }
};

// Generate trend data for a metric
const generateTrendData = (metricName: string) => {
  // Convert string values like '2.96M' or '19.43K' to numbers
  const rawValue = sampleData.Current[metricName];
  let baseValue = parseFloat(rawValue.replace(/[^0-9.-]+/g, ''));
  
  // Adjust value based on unit
  if (rawValue.includes('M')) baseValue *= 1000000;
  if (rawValue.includes('K')) baseValue *= 1000;

  const values = Array(12).fill(0).map(() => {
    const variance = baseValue * 0.2; // 20% variance
    return baseValue + (Math.random() - 0.5) * variance;
  });

  return {
    values,
    labels: Array(12).fill('').map((_, i) => `Day ${i + 1}`),
    max: Math.max(...values),
    min: Math.min(...values)
  };
};

export default function Home() {
  const [currentPeriod, setCurrentPeriod] = useState<'Current' | 'Previous'>('Current');
  const data = sampleData[currentPeriod];

  useEffect(() => {
    fetch('/api/excel-metrics')
      .then(res => res.json())
      .catch(() => {});
  }, []);

  // Parse sales values
  const parseValue = (value: string) => {
    const numStr = value.replace(/[^0-9.-]+/g, '');
    return parseFloat(numStr);
  };

  const adSales = parseValue(data['Ad Sales']);
  const totalSales = parseValue(data['Sales']);

  // Extract growth values and actual values for the DetailedDataTable
  const detailedMetrics = [
    {
      label: 'Impressions',
      growth: 20.8,
      value: sampleData.Current.Impressions,
      previousValue: sampleData.Previous.Impressions
    },
    {
      label: 'Clicks',
      growth: 27.7,
      value: sampleData.Current.Clicks,
      previousValue: sampleData.Previous.Clicks
    },
    {
      label: 'CTPR',
      growth: 18.8,
      value: sampleData.Current.CTPR,
      previousValue: sampleData.Previous.CTPR
    },
    {
      label: 'Ad Cost',
      growth: 14.5,
      value: sampleData.Current['Ad Cost'],
      previousValue: sampleData.Previous['Ad Cost']
    },
  ];

  // Organize metrics into groups
  const performanceMetrics = ['Impressions', 'Clicks', 'CTPR'];
  const costMetrics = ['Ad Cost', 'CPC', 'ACOS'];
  const salesMetrics = ['Sales', 'Ad Sales', 'Ad Sales %'];
  const conversionMetrics = ['Ad Quantity', 'Ad GRP', 'Conversion%'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-8xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="relative rounded-2xl shadow-lg mb-8 overflow-hidden" style={{ background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ff 100%)' }}>
          {/* Decorative SVG */}
          <svg className="absolute top-0 right-0 h-full w-1/3 opacity-20 pointer-events-none" viewBox="0 0 400 150" fill="none">
            <ellipse cx="200" cy="75" rx="200" ry="75" fill="#6366f1" />
          </svg>
          <div className="relative z-1 flex items-center justify-between px-10 py-8 backdrop-blur-md bg-white/60">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Analytics</span>
                <span>→</span>
                <span className="font-medium text-gray-900">Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Sales Analytics Overview</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white/80 rounded-lg shadow text-right">
                <div className="text-xs text-gray-500">Total Sales</div>
                <div className="text-lg font-semibold text-gray-900">{data['Sales']}</div>
              </div>
              <button
                className={`px-4 py-2 bg-white/80 rounded-lg shadow flex items-center gap-2 transition-colors duration-200 border border-transparent hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                onClick={() => setCurrentPeriod(currentPeriod === 'Current' ? 'Previous' : 'Current')}
                aria-label="Toggle Time Period"
              >
                <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 7V3M16 7V3M4 11h16M4 19h16M4 15h16" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Time Period</span>
                <span className={`font-semibold ${currentPeriod === 'Current' ? 'text-indigo-700' : 'text-gray-400'}`}>{currentPeriod}</span>
              </button>
             
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Metrics Section */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Performance Metrics */}
            <div className="space-y-4">
              <div className="px-2">
                <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
                <p className="text-sm text-gray-500">Key indicators of advertising reach and engagement</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performanceMetrics.map(metric => (
                  <MetricCard 
                    key={metric}
                    title={metric}
                    value={data[metric]}
                    previousValue={sampleData.Previous[metric]}
                    trendData={generateTrendData(metric)}
                  />
                ))}
              </div>
            </div>

            {/* Cost Metrics */}
            <div className="space-y-4">
              <div className="px-2">
                <h2 className="text-lg font-semibold text-gray-900">Cost Analysis</h2>
                <p className="text-sm text-gray-500">Financial metrics and cost efficiency indicators</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {costMetrics.map(metric => (
                  <MetricCard 
                    key={metric}
                    title={metric}
                    value={data[metric]}
                    previousValue={sampleData.Previous[metric]}
                    trendData={generateTrendData(metric)}
                  />
                ))}
              </div>
            </div>

            {/* Sales Metrics */}
            <div className="space-y-4">
              <div className="px-2">
                <h2 className="text-lg font-semibold text-gray-900">Sales Performance</h2>
                <p className="text-sm text-gray-500">Revenue and sales-related metrics</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salesMetrics.map(metric => (
                  <MetricCard 
                    key={metric}
                    title={metric}
                    value={data[metric]}
                    previousValue={sampleData.Previous[metric]}
                    trendData={generateTrendData(metric)}
                  />
                ))}
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="space-y-4">
              <div className="px-2">
                <h2 className="text-lg font-semibold text-gray-900">Conversion Analytics</h2>
                <p className="text-sm text-gray-500">User behavior and conversion statistics</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conversionMetrics.map(metric => (
                  <MetricCard 
                    key={metric}
                    title={metric}
                    value={data[metric]}
                    previousValue={sampleData.Previous[metric]}
                    trendData={generateTrendData(metric)}
                  />
                ))}
              </div>
            </div>

            {/* Detailed Metrics Bar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <DetailedMetricsBarChart metrics={detailedMetrics} />
            </div>
          </div>

          {/* Right Side - Sales Distribution and Table */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Sales Distribution</h2>
                <p className="text-sm text-gray-500">Ad vs Non-Ad Sales Breakdown</p>
              </div>
              <SalesDistributionPie adSales={adSales} totalSales={totalSales} />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <DetailedDataTable data={[sampleData.Current, sampleData.Previous]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
