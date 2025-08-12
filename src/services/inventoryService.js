import { apiService } from "./api";

export const inventoryService = {
  // Get all products with pagination and filters
  async getProducts(params = {}) {
    try {
      const response = await apiService.get("/products/", {
        page: params.page || 1,
        page_size: params.limit || 10,
        search: params.search,
        category: params.category,
        ordering: params.sortBy
          ? params.sortOrder === "desc"
            ? `-${params.sortBy}`
            : params.sortBy
          : "-date_added",
      });

      return {
        products: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 10)),
        },
        total: response.count || 0,
        next: response.next,
        previous: response.previous,
      };
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  // Get single product by ID
  async getProduct(id) {
    try {
      const response = await apiService.get(`/products/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch product");
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const response = await apiService.post("/products/", {
        sku: productData.sku,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        unit: productData.unit || "unit",
        price: parseFloat(productData.price),
        quantity_in_stock: parseInt(productData.quantity_in_stock || 0),
        expiry_date: productData.expiry_date || null,
        supplier: productData.supplier || null,
      });

      return {
        success: true,
        product: response,
        message: "Product created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create product");
    }
  },

  // Update existing product
  async updateProduct(id, productData) {
    try {
      const response = await apiService.put(`/products/${id}/`, {
        sku: productData.sku,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        unit: productData.unit,
        price: parseFloat(productData.price),
        quantity_in_stock: parseInt(productData.quantity_in_stock),
        expiry_date: productData.expiry_date || null,
        supplier: productData.supplier || null,
      });

      return {
        success: true,
        product: response,
        message: "Product updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update product");
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      await apiService.delete(`/products/${id}/`);

      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete product");
    }
  },

  // Get inventory records
  async getInventoryHistory(params = {}) {
    try {
      const response = await apiService.get("/inventory/", {
        page: params.page || 1,
        page_size: params.limit || 10,
        product: params.productId,
        ordering: "-date",
      });

      return {
        records: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 10)),
        },
        total: response.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch inventory history");
    }
  },

  // Create inventory record (stock adjustment)
  async createInventoryRecord(recordData) {
    try {
      const response = await apiService.post("/inventory/", {
        product: recordData.productId,
        change: parseInt(recordData.change),
        reason: recordData.reason,
      });

      return {
        success: true,
        record: response,
        message: "Inventory record created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create inventory record");
    }
  },

  // Get low stock items (products with low quantity)
  async getLowStockItems(threshold = 10) {
    try {
      const response = await apiService.get("/products/", {
        quantity_in_stock__lt: threshold,
        ordering: "quantity_in_stock",
      });

      return response.results || [];
    } catch (error) {
      console.error("Failed to fetch low stock items:", error);
      return [];
    }
  },

  // Get product categories (hardcoded from Django model choices)
  getCategories() {
    return [
      { value: "Feed", label: "Feed" },
      { value: "Equipment", label: "Equipment" },
      { value: "Chick", label: "Day-old Chick" },
      { value: "Drugs", label: "Drugs" },
    ];
  },

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const response = await apiService.get("/products/", {
        search: query,
        category: filters.category,
        ordering: filters.ordering || "-date_added",
      });

      return response.results || [];
    } catch (error) {
      throw new Error("Failed to search products");
    }
  },

  // Get top selling products for dashboard
  async getTopSellingProducts(limit = 5) {
    try {
      const response = await apiService.get("/products/", {
        ordering: "-sales_count",
        limit: limit,
      });

      return response.results || [];
    } catch (error) {
      console.error("Failed to fetch top selling products:", error.message);
      // Return empty array instead of throwing to prevent dashboard crashes
      return [];
    }
  },

  // Get dashboard inventory stats
  async getInventoryStats() {
    try {
      const [products, lowStock] = await Promise.all([
        this.getProducts({ limit: 1 }), // Get total count
        this.getLowStockItems(),
      ]);

      return {
        totalProducts: products.total || 0,
        lowStockCount: lowStock.length || 0,
        totalCategories: this.getCategories().length,
      };
    } catch (error) {
      console.error("Failed to fetch inventory stats:", error.message);
      return {
        totalProducts: 0,
        lowStockCount: 0,
        totalCategories: 4,
      };
    }
  },
};
