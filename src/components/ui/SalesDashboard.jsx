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
    <div className="p-6 bg-white rounded-lg shadow-md w-full h-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-blue-500 font-semibold">Sales</h2>
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

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {order.payment}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "Out for delivery"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Delayed"
                        ? "bg-orange-100 text-orange-800"
                        : order.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Returned"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {paginatedOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm">
            Try switching to a different time period
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
          {filteredOrders.length} results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-600 px-4">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
