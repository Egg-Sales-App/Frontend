import React, { useState } from "react";

const SalesDashboard = () => {
  const orders = [
    // Weekly orders
    {
      id: 7535,
      product: "Day Old Chicks",
      value: "GHS 120",
      quantity: "43 Packets",
      date: "11/12/22",
      payment: "Momo",
      status: "Delayed",
      period: "weekly",
    },
    {
      id: 5724,
      product: "Broilers",
      value: "GHS 220",
      quantity: "22 Packets",
      date: "21/12/22",
      payment: "Card",
      status: "Out for delivery",
      period: "weekly",
    },
    {
      id: 2775,
      product: "Layers",
      value: "GHS 150",
      quantity: "36 Packets",
      date: "5/12/22",
      payment: "Cash",
      status: "Returned",
      period: "weekly",
    },
    {
      id: 2275,
      product: "Dewormers",
      value: "GHS 1202",
      quantity: "14 Packets",
      date: "8/12/22",
      payment: "Card",
      status: "Out for delivery",
      period: "weekly",
    },
    {
      id: 2427,
      product: "Eggs",
      value: "GHS 190",
      quantity: "5 Packets",
      date: "9/1/23",
      payment: "Cash",
      status: "Delayed",
      period: "weekly",
    },

    // Daily orders
    {
      id: 2578,
      product: "Hoe",
      value: "GHS 130",
      quantity: "10 Packets",
      date: "9/1/23",
      payment: "Card",
      status: "Out for delivery",
      period: "daily",
    },
    {
      id: 2757,
      product: "Garden Fork",
      value: "GHS 180",
      quantity: "23 Packets",
      date: "15/12/23",
      payment: "Cash",
      status: "Returned",
      period: "daily",
    },
    {
      id: 3757,
      product: "Antibiotic",
      value: "GHS 10",
      quantity: "43 Packets",
      date: "6/6/23",
      payment: "Card",
      status: "Confirmed",
      period: "daily",
    },
    {
      id: 2474,
      product: "Respiratory Herbs",
      value: "GHS 1205",
      quantity: "41 Packets",
      date: "11/11/22",
      payment: "Momo",
      status: "Delayed",
      period: "daily",
    },
    {
      id: 3010,
      product: "Chick Booster",
      value: "GHS 160",
      quantity: "30 Packets",
      date: "1/6/23",
      payment: "Momo",
      status: "Confirmed",
      period: "daily",
    },
  ];

  const [period, setPeriod] = useState("weekly");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredOrders = orders.filter((order) => order.period === period);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePeriodChange = (selectedPeriod) => {
    setPeriod(selectedPeriod);
    setCurrentPage(1); // Reset to page 1 when period changes
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sales</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handlePeriodChange("daily")}
            className={`px-4 py-2 rounded ${
              period === "daily"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handlePeriodChange("weekly")}
            className={`px-4 py-2 rounded ${
              period === "weekly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-7 font-semibold text-gray-500 border-b pb-2 mb-2">
        <span>Product</span>
        <span>Order Value</span>
        <span>Quantity</span>
        <span>Order ID</span>
        <span>Date</span>
        <span>Payment</span>
        <span>Status</span>
      </div>

      {/* Table Rows */}
      {paginatedOrders.map((order) => (
        <div
          key={order.id}
          className="grid grid-cols-7 text-gray-700 py-2 border-b"
        >
          <span>{order.product}</span>
          <span>{order.value}</span>
          <span>{order.quantity}</span>
          <span>{order.id}</span>
          <span>{order.date}</span>
          <span>{order.payment}</span>
          <span
            className={`font-medium ${
              order.status === "Out for delivery"
                ? "text-green-600"
                : order.status === "Delayed"
                ? "text-orange-500"
                : order.status === "Confirmed"
                ? "text-blue-600"
                : order.status === "Returned"
                ? "text-gray-600"
                : ""
            }`}
          >
            {order.status}
          </span>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SalesDashboard;
