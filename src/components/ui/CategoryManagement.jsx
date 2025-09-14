import React, { useState, useEffect } from "react";
import { categoryService } from "../../services/categoryService";
import { useToast } from "../ui/ToastContext";
import FormInput from "../ui/FormInput";
import LoadingSpinner from "../ui/LoadingSpinner";

/**
 * CategoryManagement Component
 * -----------------------------
 * Provides CRUD operations for product categories:
 * - Fetches category list from backend
 * - Allows adding, editing, and deleting categories
 * - Displays categories in a table with actions
 * - Notifies parent component of updates (via onCategoryUpdate)
 */
const CategoryManagement = ({ onCategoryUpdate }) => {
  const [categories, setCategories] = useState([]); // list of categories
  const [loading, setLoading] = useState(false); // loading state for API actions
  const [showAddForm, setShowAddForm] = useState(false); // toggle add/edit form
  const [editingCategory, setEditingCategory] = useState(null); // category being edited
  const [formData, setFormData] = useState({ name: "", description: "" }); // form state

  const { success, error: showError } = useToast();

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch categories from the backend
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await categoryService.getCategories();
      setCategories(result.categories);
    } catch (error) {
      showError("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission (create or update category)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      showError("Category name is required");
      return;
    }

    try {
      setLoading(true);

      if (editingCategory) {
        // Update existing category
        await categoryService.updateCategory(editingCategory.id, formData);
        success("Category updated successfully");
      } else {
        // Create new category
        await categoryService.createCategory(formData);
        success("Category created successfully");
      }

      resetForm();
      fetchCategories();

      // Inform parent about the update
      if (onCategoryUpdate) {
        onCategoryUpdate();
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit action (populate form with existing data)
   */
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowAddForm(true);
  };

  /**
   * Handle delete action (with confirmation)
   */
  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await categoryService.deleteCategory(categoryId);
      success("Category deleted successfully");
      fetchCategories();

      // Inform parent about the update
      if (onCategoryUpdate) {
        onCategoryUpdate();
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset form state and close form
   */
  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingCategory(null);
    setShowAddForm(false);
  };

  /**
   * Handle input changes in the form
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show loader if fetching initial data
  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="category-management text-black">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Category Management
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          Add Category
        </button>
      </div>

      {/* Add/Edit Category Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6 border">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Category Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter category name"
              className="text-gray-800"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                           text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-gray-50 rounded-lg shadow-md border">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-800">
            Categories ({categories.length})
          </h3>

          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No categories found. Create your first category above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-800">
                      Name
                    </th>
                    <th className="text-left p-3 font-medium text-gray-800">
                      Description
                    </th>
                    <th className="text-left p-3 font-medium text-gray-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-gray-100 hover:bg-gray-100"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {category.name}
                      </td>
                      <td className="p-3 text-gray-600">
                        {category.description || "No description"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(category.id, category.name)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
