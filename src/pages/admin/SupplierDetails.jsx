import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supplierService } from "../../services/supplierService";
import { useToast } from "../../components/ui/ToastContext";

const SupplierDetails = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { error: showError } = useToast();

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setIsLoading(true);
        console.log("📦 Fetching supplier details for ID:", supplierId);
        const response = await supplierService.getSupplier(supplierId);
        console.log("✅ Supplier details fetched:", response);
        setSupplier(response);
      } catch (error) {
        console.error("❌ Error fetching supplier details:", error);
        showError("Failed to load supplier details");
      } finally {
        setIsLoading(false);
      }
    };

    if (supplierId) {
      fetchSupplier();
    }
  }, [supplierId, showError]);

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading supplier details...</div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <button
          className="mb-4 text-blue-600 hover:underline"
          onClick={() => navigate(-1)}
        >
          ← Back to Suppliers
        </button>
        <div className="text-center py-8 text-gray-500">
          <p>Supplier not found.</p>
        </div>
      </div>
    );
  }

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

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          {supplier.name}
        </h2>

        {/* Supplier Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <span className="ml-2 text-gray-600">
              {supplier.contact_email || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="ml-2 text-gray-600">
              {supplier.contact_phone || "N/A"}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="font-medium text-gray-700">Address:</span>
            <span className="ml-2 text-gray-600">
              {supplier.address || "N/A"}
            </span>
          </div>
        </div>
      </div>

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
