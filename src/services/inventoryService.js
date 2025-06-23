import { apiService } from "./api";

export const inventoryService = {
  async getProducts(params = {}) {
    try {
      return await apiService.get("/products", params);
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  async getProduct(id) {
    try {
      return await apiService.get(`/products/${id}`);
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  async createProduct(productData) {
    try {
      return await apiService.post("/products", productData);
    } catch (error) {
      throw new Error(error.message || "Failed to create product");
    }
  },

  async updateProduct(id, productData) {
    try {
      return await apiService.put(`/products/${id}`, productData);
    } catch (error) {
      throw new Error(error.message || "Failed to update product");
    }
  },

  async deleteProduct(id) {
    try {
      return await apiService.delete(`/products/${id}`);
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  },

  async getLowStockItems(threshold = 10) {
    try {
      return await apiService.get("/products/low-stock", { threshold });
    } catch (error) {
      throw new Error("Failed to fetch low stock items");
    }
  },

  async getTopSellingProducts(limit = 10) {
    try {
      return await apiService.get("/products/top-selling", { limit });
    } catch (error) {
      throw new Error("Failed to fetch top selling products");
    }
  },

  async updateStock(id, quantity, operation = "set") {
    try {
      return await apiService.patch(`/products/${id}/stock`, {
        quantity,
        operation, // 'set', 'add', 'subtract'
      });
    } catch (error) {
      throw new Error("Failed to update stock");
    }
  },

  async uploadProductImage(id, imageFile) {
    try {
      return await apiService.uploadFile(`/products/${id}/image`, imageFile);
    } catch (error) {
      throw new Error("Failed to upload product image");
    }
  },
};
