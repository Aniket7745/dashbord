import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

interface MiniChartProps {
  data: number[];
  color: string;
}

export const MiniChart = ({ data, color }: MiniChartProps) => {
  const chartData = {
    labels: new Array(data.length).fill(''),
    datasets: [
      {
        data,
        fill: true,
        borderColor: color,
        backgroundColor: `${color}20`,
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="h-12 w-full mt-2">
      <Line data={chartData} options={options} />
    </div>
  );
};
