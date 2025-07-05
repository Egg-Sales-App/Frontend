import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const ProfitRevenueCard = () => {
  const [timeframe, setTimeframe] = useState("weekly");

  const chartDataByTimeframe = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Revenue",
          data: [3000, 4000, 3500, 5000, 4200, 4600, 4800],
          borderColor: "#448DF2",
          backgroundColor: "rgba(68, 141, 242, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Profit",
          data: [1500, 2000, 1800, 2300, 2100, 2400, 2500],
          borderColor: "rgba(219,162,98,1)",
          backgroundColor: "rgba(219,162,98,0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Revenue",
          data: [15000, 20000, 18000, 22000],
          borderColor: "#448DF2",
          backgroundColor: "rgba(68, 141, 242, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Profit",
          data: [7000, 9000, 8000, 10000],
          borderColor: "rgba(219,162,98,1)",
          backgroundColor: "rgba(219,162,98,0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    monthly: {
      labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
      datasets: [
        {
          label: "Revenue",
          data: [20000, 40000, 60000, 50000, 70000, 65000, 80000],
          borderColor: "#448DF2",
          backgroundColor: "rgba(68, 141, 242, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Profit",
          data: [10000, 20000, 30000, 25000, 40000, 42000, 47000],
          borderColor: "rgba(219,162,98,1)",
          backgroundColor: "rgba(219,162,98,0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          color: "#858D9D",
        },
      },
      x: {
        ticks: {
          color: "#858D9D",
        },
      },
    },
  };

  return (
    <div className="w-full h-[384px] bg-white rounded-lg shadow-md relative p-4">
      {/* Title */}
      <span className="text-[20px] text-[#383E49] font-medium">
        Profit & Revenue
      </span>

      {/* Timeframe selection */}
      <div className="absolute top-4 right-4">
        <div className="flex space-x-4 text-sm text-gray-600">
          {["daily", "weekly", "monthly"].map((label) => (
            <label key={label} className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="timeframe"
                value={label}
                checked={timeframe === label}
                onChange={(e) => setTimeframe(e.target.value)}
                className="accent-blue-500"
              />
              <span className="capitalize">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Line Chart */}
      <div className="w-full h-[260px] mt-8">
        <Line data={chartDataByTimeframe[timeframe]} options={chartOptions} />
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-[50%] transform -translate-x-1/2 flex space-x-6 items-center">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-[#448DF2] rounded-full"></div>
          <span className="text-xs text-[#5D6679]">Revenue</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4" style={{ backgroundColor: "rgba(219,162,98,0.28)", borderRadius: "9999px" }}></div>
          <span className="text-xs text-[#5D6679]">Profit</span>
        </div>
      </div>
    </div>
  );
};

export default ProfitRevenueCard;
