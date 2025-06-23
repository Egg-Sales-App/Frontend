import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";

const ManageStore = () => {
  return (
    <AdminLayout title="Manage Store">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Store Settings</h3>
            <p className="text-gray-600 text-sm">
              Configure store information and preferences
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Business Hours</h3>
            <p className="text-gray-600 text-sm">
              Set operating hours and holidays
            </p>
          </div>
        </div>
        <p className="text-gray-600">
          Store management features coming soon...
        </p>
      </div>
    </AdminLayout>
  );
};

export default ManageStore;
