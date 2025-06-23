import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";

const Supplier = () => {
  return (
    <AdminLayout title="Suppliers">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Supplier Management</h2>
          <button className="btn btn-primary">Add Supplier</button>
        </div>
        <p className="text-gray-600">
          Supplier management features coming soon...
        </p>
      </div>
    </AdminLayout>
  );
};

export default Supplier;
