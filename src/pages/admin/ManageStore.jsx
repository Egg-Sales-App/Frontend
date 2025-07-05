import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import NewStoreForm from "../../components/ui/NewStoreForm";

// ✅ Import images from src/assets
import FeedStoreImage from "../../assets/feedstore.png";
import EquipmentStoreImage from "../../assets/equipmentstore.png";

const ManageStore = () => {
  const [showForm, setShowForm] = useState(false);

  const stores = [
    {
      title: "Feeds Shop",
      name: "Lisy Store",
      address: "1A/Accra, 3rd street\nCoimbatore - 6313403\n044-653578",
      image: FeedStoreImage,
    },
    {
      title: "Equipment Shop",
      name: "Lisy Store",
      address: "54Kasoa, 3rd street\nCoimbatore - 63133452\n044-653763",
      image: EquipmentStoreImage,
    },
  ];

  const handleAddStore = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmitForm = () => {
    setShowForm(false);
  };

  return (
    <AdminLayout title="Manage Store">
      <div className="relative p-6 bg-white rounded-lg shadow-md min-h-[705px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-gray-800">Manage Store</h1>
          <button
            onClick={handleAddStore}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Store
          </button>
        </div>

        {stores.map((store, index) => (
          <div
            key={index}
            className="flex items-start mb-6 border rounded-lg overflow-hidden"
          >
            {/* Image section */}
            <div className="w-[290px] h-[150px] bg-gray-100">
              <img
                src={store.image}
                alt={store.title}
                className="w-full h-full object-contain p-2 rounded-l-md"
              />
            </div>

            {/* Info section */}
            <div className="flex-1 p-4">
              <p className="text-gray-700 font-medium">{store.name}</p>
              <p className="text-sm text-gray-500 whitespace-pre-line">
                {store.address}
              </p>
            </div>

            {/* Edit Button */}
            <div className="p-4">
              <button className="text-blue-600 border border-blue-600 rounded px-4 py-1 hover:bg-blue-50 transition">
                Edit
              </button>
            </div>
          </div>
        ))}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <NewStoreForm onCancel={handleCloseForm} onSubmit={handleSubmitForm} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageStore;
