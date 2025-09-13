import React, { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";

/**
 * AddProduct Component
 * ---------------------
 * Renders a form for adding new products, with:
 * - Image upload (drag & drop or file input)
 * - Product details (name, description, category, etc.)
 * - Validation and error handling
 * - Calls `onSave` with structured product data
 * - Calls `onClose` when discarded
 */
const AddProduct = ({ onClose, onSave, categories = [], suppliers = [] }) => {
  // ----- State Management -----
  const [selectedImage, setSelectedImage] = useState(null); // Preview image
  const [dragOver, setDragOver] = useState(false); // Track drag state for styling
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    buyingPrice: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    supplier: "",
  });
  const [errors, setErrors] = useState({}); // Field-level validation errors

  // ----- Image Handling -----
  const handleImageSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  // ----- Form Handling -----
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user edits a field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form fields before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Product description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.buyingPrice || formData.buyingPrice <= 0)
      newErrors.buyingPrice = "Valid buying price is required";
    if (!formData.quantity || formData.quantity <= 0)
      newErrors.quantity = "Valid quantity is required";
    if (!formData.unit.trim()) newErrors.unit = "Unit is required";
    if (!formData.supplier) newErrors.supplier = "Supplier is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Format data to match API schema
      const productData = {
        name: formData.name,
        description: formData.description,
        category: parseInt(formData.category),
        buyingPrice: formData.buyingPrice,
        quantity: formData.quantity,
        unit: formData.unit,
        expiryDate: formData.expiryDate,
        supplier_id: parseInt(formData.supplier),
        img: selectedImage, // local preview, not uploaded
      };

      console.log("📝 Submitting product:", productData);
      onSave(productData);
    }
  };

  // Reset form and close modal
  const handleDiscard = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      buyingPrice: "",
      quantity: "",
      unit: "",
      expiryDate: "",
      supplier: "",
    });
    setSelectedImage(null);
    setErrors({});
    onClose();
  };

  // Default fallback categories
  const defaultCategories = [
    "Feed & Nutrition",
    "Day Old Chick",
    "Equipment",
    "Eggs & Dairy",
    "Live Birds",
  ];

  // Use provided categories or fallback
  const categoryOptions =
    categories.length > 0
      ? categories.map((cat) => cat.name || cat)
      : defaultCategories;

  // ----- Render -----
  return (
    <div className="bg-white rounded-lg max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* ---------- Image Upload Section ---------- */}
        <div className="flex justify-center mb-5">
          <div className="flex items-center gap-6">
            <div
              className={`border-2 border-dashed rounded-lg h-24 w-24 flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-blue-500 bg-blue-50"
                  : selectedImage
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById("file-input").click()}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="text-center">
                  <div className="text-gray-400 text-2xl mb-1">📷</div>
                </div>
              )}
            </div>

            {/* Upload Instructions */}
            <div className="text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                Drag image here <br />
                <span className="text-gray-500">or</span> <br />
                <button
                  type="button"
                  onClick={() => document.getElementById("file-input").click()}
                  className="text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Browse image
                </button>
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* ---------- Product Form Fields ---------- */}
        <div className="space-y-5">
          {/* Product Name */}
          {/* ... (same pattern for other fields) */}
        </div>

        {/* ---------- Action Buttons ---------- */}
        <div className="flex justify-between items-center gap-4 pt-3 mt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400"
          >
            Discard
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
