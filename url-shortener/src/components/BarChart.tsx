"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import useFetch from "@/hooks/useFetch";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the shape of the URL data (consistent with ResultTable.tsx)
interface UrlData {
  _id: string;
  url: string;
  shortUrl: string;
  remarks?: string;
  clicks: number;
  expiry: string | null;
}

// Define the shape of the fetch response
interface FetchResponse {
  data: UrlData[];
}

export default function BarChart() {
  const { data } = useFetch<FetchResponse>("api/url", { withCredentials: true }, true);

  const chartData = {
    labels: data?.data?.map((link: UrlData) => link.remarks || link._id) || [],
    datasets: [
      {
        label: "Clicks",
        data: data?.data?.map((link: UrlData) => link.clicks) || [],
        backgroundColor: "#1b48da",
      },
    ],
  };

  return <Bar data={chartData} />;
}