import React, { useState, useEffect } from "react";

const NewStoreForm = ({ store, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [loading, setLoading] = useState(false);

  // Pre-populate form when editing
  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name || "",
      });
    }
  }, [store]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter a store name.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {store ? "Edit Store" : "New Store"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Store Name */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Store Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter store/department name"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            e.g., "Feed Store", "Equipment Store", "Sales Department"
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : store ? "Update Store" : "Add Store"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewStoreForm;
