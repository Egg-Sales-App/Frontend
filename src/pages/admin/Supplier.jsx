
import React from 'react';

import AdminLayout from "../../components/layout/AdminLayout";


const suppliers = [
  { name: 'Richard Martin', contact: '7687764556' },
  { name: 'Tom Homan', contact: '9867545368' },
  { name: 'Veandir', contact: '9867545566' },
  { name: 'Charin', contact: '9367546531' },
  { name: 'Hoffman', contact: '9667545982' },
  { name: 'Joe Nike', contact: '9867545457' },
];

export default function Supplier() {
  return (
    <AdminLayout title="Suppliers">
    <section className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium text-gray-800">Suppliers</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Add Supplier
          </button>
          <button className="bg-white border px-4 py-2 rounded shadow-sm text-gray-700 hover:bg-gray-100">
            Download All
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2 text-sm text-gray-500 px-2">
        <span>Supplier Name</span>
        <span>Contact Number</span>
      </div>

      <div className="divide-y border rounded-lg">
        {suppliers.map((supplier, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition"
          >
            <span className="font-medium text-gray-700">{supplier.name}</span>
            <span className="text-gray-600">{supplier.contact}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <button className="px-4 py-2 border rounded hover:bg-gray-100">Prev</button>
        <span>Page 1 of 1</span>
        <button className="px-4 py-2 border rounded hover:bg-gray-100">Next</button>
      </div>
    </section>
    </AdminLayout>
  );
}
