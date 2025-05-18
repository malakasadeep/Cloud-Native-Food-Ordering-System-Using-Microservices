import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Chart Data
const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales ($)",
      data: [12000, 19000, 15000, 22000, 18000, 25000],
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
    },
  ],
};

const categoryData = {
  labels: ["Electronics", "Clothing", "Books", "Home & Garden"],
  datasets: [
    {
      data: [300, 150, 100, 200],
      backgroundColor: [
        "rgba(59, 130, 246, 0.7)",
        "rgba(16, 185, 129, 0.7)",
        "rgba(245, 158, 11, 0.7)",
        "rgba(236, 72, 153, 0.7)",
      ],
      borderColor: [
        "rgba(59, 130, 246, 1)",
        "rgba(16, 185, 129, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(236, 72, 153, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const userGrowthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Users",
      data: [500, 700, 900, 1200, 1500, 2000],
      fill: false,
      borderColor: "rgba(16, 185, 129, 1)",
      tension: 0.4,
    },
  ],
};

// Light mode chart options
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#374151", // text-gray-700
      },
    },
    title: {
      display: true,
      color: "#374151",
    },
  },
  scales: {
    x: {
      ticks: { color: "#374151" },
      grid: { color: "rgba(0, 0, 0, 0.05)" },
    },
    y: {
      ticks: { color: "#374151" },
      grid: { color: "rgba(0, 0, 0, 0.05)" },
    },
  },
};

const Overview = ({ isSidebarCollapsed }) => {
  return (
    <main
      style={{
        marginLeft: isSidebarCollapsed ? "60px" : "220px",
        transition: "margin-left 0.3s",
      }}
      className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen rounded-2xl"
    >
      <div className="px-20 min-h-screen bg-white text-gray-800 p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600">
            Business Overview
          </h1>
          <p className="text-gray-500 mt-2">
            Key metrics and insights for May 2025
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-600">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">$125,000</p>
            <p className="text-sm text-green-500 mt-1">+12% from last month</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-600">
              Active Users
            </h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">2,000</p>
            <p className="text-sm text-green-500 mt-1">+15% from last month</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-600">Orders</h3>
            <p className="text-3xl font-bold text-blue-500 mt-2">750</p>
            <p className="text-sm text-red-500 mt-1">-5% from last month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Monthly Sales
            </h2>
            <div className="h-80">
              <Bar
                data={salesData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: "Sales by Month" },
                  },
                }}
              />
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Product Categories
            </h2>
            <div className="h-80">
              <Pie
                data={categoryData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: "Category Distribution" },
                  },
                }}
              />
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-gray-100 p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              User Growth
            </h2>
            <div className="h-80">
              <Line
                data={userGrowthData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: { display: true, text: "User Growth Over Time" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Overview;
