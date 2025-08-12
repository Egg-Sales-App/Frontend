import React, { useState } from 'react';
import { Link } from "react-router-dom";

// Form Component
const NewSupplier = ({ onCancel }) => {
  return (
    <div className="w-[500px] bg-white rounded-lg p-6 shadow-md relative">
      <h2 className="text-[20px] font-medium text-gray-800 mb-6">New Supplier</h2>

      {/* Form Fields */}
      <div className="space-y-6">
        <FormField label="Supplier Name" placeholder="Enter name" />
        <FormField label="Product" placeholder="Enter product" />
        <FormField label="Email" placeholder="Enter email" />
        <FormField label="Buying Price" placeholder="Enter price" />
        <FormField label="Contact Number" placeholder="Enter contact" />
        <FormField label="Shop" placeholder="Enter shop name" />

        {/* Type */}
        <div>
          <label className="text-gray-700 font-medium">Type</label>
          <div className="flex gap-4 mt-2">
            <div className="w-[114px] h-[44px] rounded-lg shadow px-3 flex items-center bg-white">
              <span className="text-gray-500">In stock</span>
            </div>
            <div className="w-[149px] h-[44px] rounded-lg shadow px-3 flex items-center bg-white">
              <span className="text-gray-500">Out of Stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
          onClick={onCancel}
        >
          Discard
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Supplier
        </button>
      </div>
    </div>
  );
};

const FormField = ({ label, placeholder }) => (
  <div className="flex justify-between items-center">
    <label className="text-gray-700 font-medium w-[120px]">{label}</label>
    <div className="w-[273px] h-[44px] bg-white rounded-lg shadow px-4 flex items-center">
      <input
        className="w-full outline-none text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
      />
    </div>
  </div>
);

// Supplier Page
const suppliers = [
  { name: 'Richard Martin', contact: '7687764556' },
  { name: 'Tom Homan', contact: '9867545368' },
  { name: 'Veandir', contact: '9867545566' },
  { name: 'Charin', contact: '9367546531' },
  { name: 'Hoffman', contact: '9667545982' },
  { name: 'Joe Nike', contact: '9867545457' },
];

const  Supplier = () => {
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);

  return (
    <>
      <section className="p-6 bg-white rounded-lg shadow-md">
        {!isAddingSupplier ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800">Suppliers</h2>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => setIsAddingSupplier(true)}
                >
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
<Link
  to={`/admin/suppliers/${supplier.name.toLowerCase().replace(/\s+/g, '-')}`} // or use supplier.id when backend available
  className="font-medium text-blue-600 hover:underline"
>
  {supplier.name}
</Link>                  <span className="text-gray-600">{supplier.contact}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
              <button className="px-4 py-2 border rounded hover:bg-gray-100">Prev</button>
              <span>Page 1 of 1</span>
              <button className="px-4 py-2 border rounded hover:bg-gray-100">Next</button>
            </div>
          </>
        ) : (
          <NewSupplier onCancel={() => setIsAddingSupplier(false)} />
        )}
      </section>
    </>
  );
}


export default Supplier;