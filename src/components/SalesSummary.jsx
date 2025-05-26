import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", ordered: 400, delivered: 240 },
  { month: "Feb", ordered: 700, delivered: 500 },
  { month: "Mar", ordered: 600, delivered: 350 },
  { month: "Apr", ordered: 800, delivered: 630 },
  { month: "May", ordered: 950, delivered: 870 },
  { month: "Jun", ordered: 980, delivered: 900 },
  { month: "Jul", ordered: 870, delivered: 820 },
  { month: "Aug", ordered: 760, delivered: 700 },
];

const SalesSummary = () => {
  return (
    <section className="w-full h-[360px] bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Summary</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 1000]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ordered" stroke="#8884d8" />
          <Line type="monotone" dataKey="delivered" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};

export default SalesSummary;
