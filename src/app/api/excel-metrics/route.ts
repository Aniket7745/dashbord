import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

type MetricRow = { Impressions: string | number; Clicks: string | number; CTPR: string | number; [key: string]: string | number };

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'ads_and_sales_comparison_filtered.xlsx');
  const file = fs.readFileSync(filePath);
  const workbook = XLSX.read(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelRows = XLSX.utils.sheet_to_json<MetricRow>(worksheet);

  if (excelRows.length > 1) {
    const prev = excelRows[excelRows.length - 2];
    const curr = excelRows[excelRows.length - 1];
    const metrics = [
      {
        label: 'Impressions',
        growth: ((Number(curr.Impressions) - Number(prev.Impressions)) / Number(prev.Impressions)) * 100,
      },
      {
        label: 'Clicks',
        growth: ((Number(curr.Clicks) - Number(prev.Clicks)) / Number(prev.Clicks)) * 100,
      },
      {
        label: 'CTPR',
        growth: ((Number(curr.CTPR) - Number(prev.CTPR)) / Number(prev.CTPR)) * 100,
      },
    ];
    return NextResponse.json(metrics);
  }
  return NextResponse.json([]);
}
