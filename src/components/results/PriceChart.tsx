'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { HistoricPrice } from '@/types';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface PriceChartProps {
  ventaData: HistoricPrice[];
  arriendoData: HistoricPrice[];
}

const trimesterAbbr: Record<string, string> = {
  'Ene-Mar': 'T1',
  'Abr-Jun': 'T2',
  'Jul-Sep': 'T3',
  'Oct-Dic': 'T4',
  Q1: 'T1',
  Q2: 'T2',
  Q3: 'T3',
  Q4: 'T4',
};

function makeLabel(hp: HistoricPrice): string {
  const abbr = trimesterAbbr[hp.trimester] || hp.trimester;
  const yr = hp.year.length === 4 ? hp.year.slice(2) : hp.year;
  return `${abbr} '${yr}`;
}

export default function PriceChart({ ventaData, arriendoData }: PriceChartProps) {
  if (ventaData.length === 0 && arriendoData.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 rounded-2xl border border-gray-200 bg-gray-50 text-gray-400 text-sm">
        Sin datos históricos disponibles
      </div>
    );
  }

  // Build unified label set from the longer array (or merge both)
  const allKeys = new Map<string, string>();
  [...ventaData, ...arriendoData].forEach((hp) => {
    const key = `${hp.year}-${hp.trimester}`;
    if (!allKeys.has(key)) allKeys.set(key, makeLabel(hp));
  });
  const sortedKeys = [...allKeys.keys()].sort();
  const labels = sortedKeys.map((k) => allKeys.get(k)!);

  const ventaMap = new Map(ventaData.map((hp) => [`${hp.year}-${hp.trimester}`, hp.value]));
  const arriendoMap = new Map(arriendoData.map((hp) => [`${hp.year}-${hp.trimester}`, hp.value]));

  const data = {
    labels,
    datasets: [
      {
        label: 'Valor de venta',
        data: sortedKeys.map((k) => ventaMap.get(k) ?? null),
        borderColor: '#7C01FF',
        backgroundColor: 'rgba(124, 1, 255, 0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#7C01FF',
        yAxisID: 'yVenta',
      },
      {
        label: 'Arriendo estimado',
        data: sortedKeys.map((k) => arriendoMap.get(k) ?? null),
        borderColor: '#00C29C',
        backgroundColor: 'transparent',
        borderDash: [6, 4],
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#00C29C',
        yAxisID: 'yArriendo',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const label = ctx.dataset.label || '';
            const val = ctx.parsed.y;
            return val !== null ? `${label}: ${formatCurrency(val)}` : label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 }, maxRotation: 45 },
      },
      yVenta: {
        type: 'linear' as const,
        position: 'left' as const,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          font: { size: 10 },
          callback: (value: number | string) => formatCurrency(Number(value)),
        },
      },
      yArriendo: {
        type: 'linear' as const,
        position: 'right' as const,
        grid: { drawOnChartArea: false },
        ticks: {
          font: { size: 10 },
          callback: (value: number | string) => formatCurrency(Number(value)),
        },
      },
    },
  };

  return (
    <div className="h-60">
      <Line data={data} options={options} />
    </div>
  );
}
