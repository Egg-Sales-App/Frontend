import React from "react";

const NewStoreForm = ({ onCancel, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">New Store</h2>

        {/* Store Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Store Name
          </label>
          <input
            type="text"
            placeholder="Enter supplier name"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Product */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Product</label>
          <input
            type="text"
            placeholder="Enter product"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <input
            type="text"
            placeholder="Enter Address"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
          <input
            type="text"
            placeholder="Enter supplier contact number"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6 text-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
          <p className="text-gray-500">Drag image here <span className="text-sm text-gray-400">or</span></p>
          <button className="text-blue-500 hover:underline mt-1">Browse image</button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            Discard
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewStoreForm;