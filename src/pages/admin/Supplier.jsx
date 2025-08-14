import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supplierService } from "../../services/supplierService";
import { useToast } from "../../components/ui/ToastContext";

// Form Component
const NewSupplier = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      showError("Supplier name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("📝 Creating supplier:", formData);

      await onSave(formData);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      success("Supplier created successfully!");
    } catch (error) {
      console.error("❌ Error creating supplier:", error);
      showError("Failed to create supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[500px] bg-white rounded-lg p-6 shadow-md relative">
      <h2 className="text-[20px] font-medium text-gray-800 mb-6">
        New Supplier
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="space-y-6">
          <FormField
            label="Supplier Name"
            placeholder="Enter name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />
          <FormField
            label="Email"
            placeholder="Enter email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
          />
          <FormField
            label="Contact Number"
            placeholder="Enter contact"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
          />
          <FormField
            label="Address"
            placeholder="Enter address"
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Discard
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
};

const FormField = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
}) => (
  <div className="flex justify-between items-center">
    <label className="text-gray-700 font-medium w-[120px]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="w-[273px] h-[44px] bg-white rounded-lg shadow px-4 flex items-center">
      <input
        className="w-full outline-none text-gray-700 placeholder-gray-400"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  </div>
);

// Edit Supplier Component
const EditSupplier = ({ supplier, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    name: supplier.name || "",
    email: supplier.contact_email || supplier.email || "",
    phone: supplier.contact_phone || supplier.phone || "",
    address: supplier.address || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      showError("Supplier name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("📝 Updating supplier:", formData);

      await onSave(supplier.id, formData);

      success("Supplier updated successfully!");
    } catch (error) {
      console.error("❌ Error updating supplier:", error);
      showError("Failed to update supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[500px] bg-white rounded-lg p-6 shadow-md relative">
      <h2 className="text-[20px] font-medium text-gray-800 mb-6">
        Edit Supplier
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="space-y-6">
          <FormField
            label="Supplier Name"
            placeholder="Enter name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />
          <FormField
            label="Email"
            placeholder="Enter email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
          />
          <FormField
            label="Contact Number"
            placeholder="Enter contact"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
          />
          <FormField
            label="Address"
            placeholder="Enter address"
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded hover:bg-gray-200"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Supplier"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Supplier Page
const Supplier = () => {
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error: showError } = useToast();

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        console.log("📦 Fetching suppliers from backend...");
        const response = await supplierService.getSuppliers();
        console.log("✅ Suppliers fetched:", response);
        // Extract the suppliers array from the response
        setSuppliers(response.suppliers || []);
      } catch (error) {
        console.error("❌ Error fetching suppliers:", error);
        showError("Failed to load suppliers");
        setSuppliers([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [showError]);

  // Handle supplier creation
  const handleSupplierCreated = async (newSupplierData) => {
    try {
      const response = await supplierService.createSupplier(newSupplierData);
      setSuppliers((prev) => [...prev, response]);
      setIsAddingSupplier(false);
      success("Supplier created successfully!");
    } catch (error) {
      console.error("❌ Error creating supplier:", error);
      showError(error.message || "Failed to create supplier");
      throw error; // Re-throw to let the form handle the error
    }
  };

  // Handle supplier update
  const handleSupplierUpdated = async (id, updatedData) => {
    try {
      const response = await supplierService.updateSupplier(id, updatedData);
      setSuppliers((prev) =>
        prev.map((supplier) => (supplier.id === id ? response : supplier))
      );
      success("Supplier updated successfully!");
    } catch (error) {
      console.error("❌ Error updating supplier:", error);
      showError(error.message || "Failed to update supplier");
      throw error;
    }
  };

  // Handle supplier deletion
  const handleSupplierDeleted = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      await supplierService.deleteSupplier(id);
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
      success("Supplier deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting supplier:", error);
      showError(error.message || "Failed to delete supplier");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading suppliers...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="p-6 bg-white rounded-lg shadow-md">
        {!isAddingSupplier && !editingSupplier ? (
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
              <span>Address</span>
              <span>Email</span>
              <span>Contact Number</span>
              <span>Actions</span>
            </div>

            {suppliers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No suppliers found.</p>
                <p>Click "Add Supplier" to get started.</p>
              </div>
            ) : (
              <div className="divide-y border rounded-lg">
                {suppliers.map((supplier) => (
                  <div
                    key={supplier.id || supplier.name}
                    className="flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <Link
                      to={`/admin/suppliers/${supplier.id}`}
                      className="font-medium text-blue-600 hover:underline flex-1"
                    >
                      {supplier.name}
                    </Link>
                    <span className="text-gray-600 flex-1 text-center">
                      {supplier.address || "N/A"}
                    </span>
                    <span className="text-gray-600 flex-1 text-center">
                      {supplier.contact_email || supplier.email || "N/A"}
                    </span>
                    <span className="text-gray-600 flex-1 text-center">
                      {supplier.contact_phone ||
                        supplier.phone ||
                        supplier.contact ||
                        "N/A"}
                    </span>
                    <div className="flex gap-2 flex-1 justify-end">
                      <button
                        onClick={() => setEditingSupplier(supplier)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleSupplierDeleted(supplier.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
              <button className="px-4 py-2 border rounded hover:bg-gray-100">
                Prev
              </button>
              <span>Page 1 of 1</span>
              <button className="px-4 py-2 border rounded hover:bg-gray-100">
                Next
              </button>
            </div>
          </>
        ) : isAddingSupplier ? (
          <NewSupplier
            onCancel={() => setIsAddingSupplier(false)}
            onSave={handleSupplierCreated}
          />
        ) : editingSupplier ? (
          <EditSupplier
            supplier={editingSupplier}
            onCancel={() => setEditingSupplier(null)}
            onSave={handleSupplierUpdated}
          />
        ) : null}
      </section>
    </>
  );
};

export default Supplier;
