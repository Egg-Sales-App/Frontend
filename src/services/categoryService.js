import { config } from "../config/environment";

export const categoryService = {
  // Get all categories
  async getCategories() {
    try {
      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/categories/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const categories = await response.json();
      return { success: true, categories };
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  // Get single category by ID
  async getCategory(id) {
    try {
      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/categories/${id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Failed to fetch category");
    }
  },

  // Create new category
  async createCategory(categoryData) {
    try {
      const payload = {
        name: categoryData.name,
        description: categoryData.description || "",
      };

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/categories/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const category = await response.json();
      return { success: true, category };
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error(error.message || "Failed to create category");
    }
  },

  // Update existing category
  async updateCategory(id, categoryData) {
    try {
      const payload = {
        name: categoryData.name,
        description: categoryData.description || "",
      };

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/categories/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const category = await response.json();
      return { success: true, category };
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error(error.message || "Failed to update category");
    }
  },

  // Delete category
  async deleteCategory(id) {
    try {
      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/categories/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  },
};
