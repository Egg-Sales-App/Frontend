import { apiService } from "./api";

export const inventoryService = {
  // Get all products with pagination and filters
  async getProducts(params = {}) {
    try {
      const response = await apiService.get("/products", {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        category: params.category,
        status: params.status,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
      });

      return {
        products: response.data || response.products || [],
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          total: response.total || 0,
          pages: Math.ceil((response.total || 0) / 10),
        },
        total: response.total || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  // Get single product by ID
  async getProduct(id) {
    try {
      const response = await apiService.get(`/products/${id}`);
      return response.data || response.product || response;
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const response = await apiService.post("/products", {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: parseFloat(productData.price),
        costPrice: parseFloat(productData.costPrice),
        quantity: parseInt(productData.quantity),
        minStockLevel: parseInt(productData.minStockLevel || 10),
        unit: productData.unit || "piece",
        barcode: productData.barcode,
        sku: productData.sku,
        supplier: productData.supplier,
        expiryDate: productData.expiryDate,
        status: productData.status || "active",
      });

      return {
        success: true,
        product: response.data || response.product || response,
        message: response.message || "Product created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create product");
    }
  },

  // Update existing product
  async updateProduct(id, productData) {
    try {
      const response = await apiService.put(`/products/${id}`, productData);

      return {
        success: true,
        product: response.data || response.product || response,
        message: response.message || "Product updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update product");
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await apiService.delete(`/products/${id}`);

      return {
        success: true,
        message: response.message || "Product deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  },

  // Get low stock items
  async getLowStockItems(threshold = 10) {
    try {
      const response = await apiService.get("/products/low-stock", {
        threshold,
        status: "active",
      });

      return response.data || response.products || [];
    } catch (error) {
      console.error("Failed to fetch low stock items:", error);
      // Return empty array instead of throwing to prevent dashboard breaking
      return [];
    }
  },

  // Get top selling products
  async getTopSellingProducts(limit = 10, period = "30d") {
    try {
      const response = await apiService.get("/products/top-selling", {
        limit,
        period, // '7d', '30d', '90d', '1y'
      });

      return response.data || response.products || [];
    } catch (error) {
      throw new Error("Failed to fetch top selling products");
    }
  },

  // Update stock quantity
  async updateStock(id, quantity, operation = "set", reason = "") {
    try {
      const response = await apiService.patch(`/products/${id}/stock`, {
        quantity: parseInt(quantity),
        operation, // 'set', 'add', 'subtract'
        reason,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        product: response.data || response.product || response,
        message: response.message || "Stock updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update stock");
    }
  },

  // Upload product image
  async uploadProductImage(id, imageFile) {
    try {
      const response = await apiService.uploadFile(
        `/products/${id}/image`,
        imageFile
      );

      return {
        success: true,
        imageUrl: response.imageUrl || response.url,
        message: response.message || "Image uploaded successfully",
      };
    } catch (error) {
      throw new Error("Failed to upload product image");
    }
  },

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const response = await apiService.get("/products/search", {
        q: query,
        ...filters,
      });

      return response.data || response.products || [];
    } catch (error) {
      throw new Error("Failed to search products");
    }
  },

  // Get product categories
  async getCategories() {
    try {
      const response = await apiService.get("/products/categories");
      return response.data || response.categories || [];
    } catch (error) {
      throw new Error("Failed to fetch categories");
    }
  },

  // Get stock history for a product
  async getStockHistory(id, params = {}) {
    try {
      const response = await apiService.get(`/products/${id}/stock-history`, {
        page: params.page || 1,
        limit: params.limit || 20,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
      });

      return {
        history: response.data || response.history || [],
        pagination: response.pagination || {},
      };
    } catch (error) {
      throw new Error("Failed to fetch stock history");
    }
  },
};
