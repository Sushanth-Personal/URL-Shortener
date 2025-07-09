// src/components/BarChart.tsx
'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import  useFetch  from '@/hooks/useFetch';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart() {
  const { data } = useFetch('api/url');
  const chartData = {
    labels: data?.data?.map((link: any) => link.remarks || link._id) || [],
    datasets: [
      {
        label: 'Clicks',
        data: data?.data?.map((link: any) => link.clicks) || [],
        backgroundColor: '#1b48da',
      },
    ],
  };
  return <Bar data={chartData} />;
}