import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const SupplierDetails = () => {
  const { supplierId } = useParams(); // use this to fetch real data later
  const navigate = useNavigate();

  const mockOrders = [
    { id: 1, item: "Hybrid Feed Premium", qty: 10, date: "2024-07-12" },
    { id: 2, item: "Water Dispenser", qty: 5, date: "2024-06-29" },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back to Suppliers
      </button>

      <h2 className="text-2xl font-semibold mb-4 capitalize text-blue-600">
        Supplier: {supplierId.replace(/-/g, " ")}
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-600">
          Purchase History
        </h3>
        <div className="border rounded divide-y text-blue-600">
          {mockOrders.map((order) => (
            <div key={order.id} className="p-4 flex justify-between">
              <span>{order.item}</span>
              <span>{order.qty} units</span>
              <span className="text-sm text-gray-500">{order.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-blue-600">New Order</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Product name"
            className="w-full p-2 border rounded text-blue-600"
          />
          <input
            type="number"
            placeholder="Quantity"
            className="w-full p-2 border rounded text-blue-600"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierDetails;
