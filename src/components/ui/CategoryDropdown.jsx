import React, { useState, useEffect } from "react";
import { categoryService } from "../../services/categoryService";
import { useToast } from "./ToastContext";

/**
 * CategoryDropdown Component
 * --------------------------
 * A reusable dropdown for selecting product categories.
 * - Fetches category data from the backend (via categoryService).
 * - Shows a loading state while fetching.
 * - Handles empty state (no categories available).
 * - Notifies parent component when categories are loaded.
 */
const CategoryDropdown = ({
  value,
  onChange,
  name = "category",
  label = "Category",
  required = false,
  disabled = false,
  placeholder = "Select a category",
  className = "",
  onCategoriesLoad,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error: showError } = useToast();

  // Fetch categories on initial mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from service
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await categoryService.getCategories();
      setCategories(result.categories);

      // Optionally notify parent that categories are loaded
      if (onCategoriesLoad) {
        onCategoriesLoad(result.categories);
      }
    } catch (error) {
      showError("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Allow parent to trigger a refresh
  const refreshCategories = () => {
    fetchCategories();
  };

  // Handle user selection
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    onChange({
      target: {
        name,
        value: selectedValue,
      },
    });
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label (optional) */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Dropdown */}
      <select
        name={name}
        value={value || ""}
        onChange={handleChange}
        required={required}
        disabled={disabled || loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                   focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                   disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">
          {loading ? "Loading categories..." : placeholder}
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Empty state */}
      {categories.length === 0 && !loading && (
        <p className="text-sm text-gray-500 mt-1">
          No categories available. Please add categories first.
        </p>
      )}
    </div>
  );
};

/**
 * useCategoryDropdown Hook
 * -------------------------
 * A helper hook for loading and working with categories programmatically.
 * Provides:
 * - categories (state)
 * - loading status
 * - functions to load categories
 * - helpers to get category by id or name
 */
export const useCategoryDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const result = await categoryService.getCategories();
      setCategories(result.categories);
      return result.categories;
    } catch (error) {
      console.error("Error loading categories:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helpers for quick lookups
  const getCategoryById = (id) => {
    return categories.find((cat) => cat.id === parseInt(id));
  };

  const getCategoryByName = (name) => {
    return categories.find((cat) => cat.name === name);
  };

  return {
    categories,
    loading,
    loadCategories,
    getCategoryById,
    getCategoryByName,
  };
};

export default CategoryDropdown;
