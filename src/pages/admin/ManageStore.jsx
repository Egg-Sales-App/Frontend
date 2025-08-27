import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import NewStoreForm from "../../components/ui/NewStoreForm";
import { departmentService } from "../../services/departmentService";
import { useToast } from "../../components/ui/ToastContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

// ✅ Import images from src/assets
import FeedStoreImage from "../../assets/feedstore.png";
import EquipmentStoreImage from "../../assets/equipmentstore.png";

const ManageStore = () => {
  const [showForm, setShowForm] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStore, setEditingStore] = useState(null);
  const { success: showSuccess, error: showError } = useToast();

  // Store images mapping
  const storeImages = {
    "Feeds Shop": FeedStoreImage,
    "Equipment Shop": EquipmentStoreImage,
    "Feed Store": FeedStoreImage,
    "Equipment Store": EquipmentStoreImage,
  };

  // Fetch departments (stores) on component mount
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const data = await departmentService.getDepartments();
        setStores(data);
        showSuccess("Stores loaded successfully");
      } catch (err) {
        console.error("Error fetching stores:", err);
        showError("Failed to load stores");
        setStores([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [showSuccess, showError]);

  const handleAddStore = () => {
    setEditingStore(null);
    setShowForm(true);
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
    setShowForm(true);
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        setLoading(true);
        await departmentService.deleteDepartment(storeId);
        setStores(stores.filter((store) => store.id !== storeId));
        showSuccess("Store deleted successfully");
      } catch (err) {
        console.error("Error deleting store:", err);
        showError("Failed to delete store");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStore(null);
  };

  const handleSubmitForm = async (storeData) => {
    try {
      setLoading(true);

      if (editingStore) {
        // Update existing store
        const updatedStore = await departmentService.updateDepartment(
          editingStore.id,
          storeData
        );
        setStores(
          stores.map((store) =>
            store.id === editingStore.id ? updatedStore : store
          )
        );
        showSuccess("Store updated successfully");
      } else {
        // Create new store
        const newStore = await departmentService.createDepartment(storeData);
        setStores([...stores, newStore]);
        showSuccess("Store created successfully");
      }

      setShowForm(false);
      setEditingStore(null);
    } catch (err) {
      console.error("Error saving store:", err);
      showError(`Failed to ${editingStore ? "update" : "create"} store`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative p-6 bg-white rounded-lg shadow-md min-h-[705px]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-800">Manage Store</h1>
            <p className="text-gray-600">
              Manage your store departments ({stores.length})
            </p>
          </div>
          <button
            onClick={handleAddStore}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Add Store
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
            <span className="ml-4 text-gray-500">Loading stores...</span>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No stores found.</p>
            <button
              onClick={handleAddStore}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Create your first store
            </button>
          </div>
        ) : (
          <>
            {stores.map((store) => (
              <div
                key={store.id}
                className="flex items-start mb-6 border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Image section */}
                <div className="w-[290px] h-[150px] bg-gray-100">
                  <img
                    src={storeImages[store.name] || FeedStoreImage}
                    alt={store.name}
                    className="w-full h-full object-contain p-2 rounded-l-md"
                  />
                </div>

                {/* Info section */}
                <div className="flex-1 p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Department ID: {store.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(
                      store.created_at || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="p-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleEditStore(store)}
                    className="text-blue-600 border border-blue-600 rounded px-4 py-1 hover:bg-blue-50 transition flex items-center gap-2"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="text-red-600 border border-red-600 rounded px-4 py-1 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <NewStoreForm
                store={editingStore}
                onCancel={handleCloseForm}
                onSubmit={handleSubmitForm}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageStore;
