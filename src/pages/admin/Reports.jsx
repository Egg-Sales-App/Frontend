import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";

const Reports = () => {
  return (
    <AdminLayout title="Reports">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Sales Report</h3>
            <p className="text-blue-600 text-sm">Generate sales analytics</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Inventory Report</h3>
            <p className="text-green-600 text-sm">View stock levels</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Financial Report</h3>
            <p className="text-purple-600 text-sm">Profit & loss analysis</p>
          </div>
        </div>
        <p className="text-gray-600">
          Detailed reporting features coming soon...
        </p>
      </div>
    </AdminLayout>
  );
};

export default Reports;
