import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

interface ExcelRow {
  [key: string]: string | number;
}

export interface TrendData {
  values: number[];
  labels: string[];
  max: number;
  min: number;
}

export async function getExcelData(): Promise<ExcelRow[]> {
  const filePath = path.join(process.cwd(), 'public', 'ads_and_sales_comparison_filtered.xlsx');
  const file = await fs.readFile(filePath);
  const workbook = XLSX.read(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
}

export function getTrendData(data: ExcelRow[], metric: string): TrendData {
  const values = data.map(row => {
    const value = row[metric];
    if (typeof value === 'string') {
      return parseFloat(value.replace(/[^0-9.-]+/g, ''));
    }
    return value as number;
  });

  const labels = data.map(row => row['Date'] as string);

  return {
    values: values.slice(-12), // Last 12 data points
    labels: labels.slice(-12),
    max: Math.max(...values),
    min: Math.min(...values)
  };
}
