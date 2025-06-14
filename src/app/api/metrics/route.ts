import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'ads_and_sales_comparison_filtered.xlsx');
    const file = fs.readFileSync(filePath);
    const workbook = XLSX.read(file);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

    // Group data by period
    const currentData = jsonData.slice(-1)[0];
    const previousData = jsonData.slice(-2)[0];
    const trendDataPoints = jsonData.slice(-12);

    // Process each metric
    const metrics = Object.keys(currentData).filter(key => key !== 'Date');
    const trends: { [key: string]: any } = {};

    metrics.forEach(metric => {
      const values = trendDataPoints.map(point => Number(point[metric]));
      trends[metric] = {
        values,
        labels: trendDataPoints.map(point => point.Date as string),
        max: Math.max(...values),
        min: Math.min(...values)
      };
    });

    const formatValue = (value: number): string => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
      if (value < 1) return value.toFixed(3);
      return value.toLocaleString();
    };

    const formatData = (data: any) => {
      const formatted: { [key: string]: string | number } = {};
      metrics.forEach(metric => {
        const value = Number(data[metric]);
        formatted[metric] = formatValue(value);
      });
      return formatted;
    };

    return NextResponse.json({
      Current: formatData(currentData),
      Previous: formatData(previousData),
      trends
    });
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to load metrics data' },
      { status: 500 }
    );
  }
}
