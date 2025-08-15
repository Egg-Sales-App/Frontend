import { config } from "../config/environment";

export const inventoryService = {
  // Get all products with pagination and filters
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        page_size: params.limit || 10,
        ...(params.search && { search: params.search }),
        ...(params.category && { category: params.category }),
        ordering: params.sortBy
          ? params.sortOrder === "desc"
            ? `-${params.sortBy}`
            : params.sortBy
          : "-date_added",
      });

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/products/?${queryParams}`,
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

      const data = await response.json();

      console.log("📦 Raw API response:", data);

      // Handle direct array response from backend
      if (Array.isArray(data)) {
        console.log("📋 Backend returned direct array of products");
        return {
          products: data,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: data.length,
            pages: 1, // Since we get all products in one array
          },
          total: data.length,
          next: null,
          previous: null,
        };
      }

      // Handle paginated response (if backend changes to pagination later)
      if (data.results && Array.isArray(data.results)) {
        console.log("📋 Backend returned paginated response");
        return {
          products: data.results,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: data.count || 0,
            pages: Math.ceil((data.count || 0) / (params.limit || 10)),
          },
          total: data.count || 0,
          next: data.next,
          previous: data.previous,
        };
      }

      // Fallback for unexpected response format
      console.warn("⚠️ Unexpected response format:", data);
      return {
        products: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
        total: 0,
        next: null,
        previous: null,
      };
    } catch (error) {
      throw new Error("Failed to fetch products");
    }
  },

  // Get single product by ID
  async getProduct(id) {
    try {
      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/products/${id}/`,
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
      throw new Error("Failed to fetch product");
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const payload = {
        sku: productData.sku,
        name: productData.name,
        description: productData.description,
        category: productData.category,
        unit: productData.unit || "unit",
        price: parseFloat(productData.price),
        quantity_in_stock: parseInt(productData.quantity_in_stock || 0),
        expiry_date: productData.expiry_date || null,
        supplier: productData.supplier || null,
      };

      const response = await fetch(`${config.DJANGO_BASE_URL}/api/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      return {
        success: true,
        product: data,
        message: "Product created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create product");
    }
  },

  // Update existing product
  async updateProduct(id, productData) {
    try {
      console.log("🔧 inventoryService.updateProduct called with:", {
        id,
        productData,
      });

      const payload = {
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: productData.price ? productData.price.toString() : "0", // Safely convert to string
        quantity_in_stock: parseInt(productData.quantity_in_stock) || 0,
        sku: productData.sku,
        unit: productData.unit || "unit",
        expiry_date: productData.expiry_date || null,
        supplier: productData.supplier || null, // Supplier object
        supplier_id: productData.supplier_id || 0, // Supplier ID
      };

      console.log(
        "📤 Sending PUT request to /api/products/" + id + "/ with payload:",
        payload
      );

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/products/${id}/`,
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

      const data = await response.json();

      console.log("📥 API Response from update:", data);

      return {
        success: true,
        product: data,
        message: "Product updated successfully",
      };
    } catch (error) {
      console.error("❌ inventoryService.updateProduct error:", error);
      throw new Error(error.message || "Failed to update product");
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/products/${id}/`,
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
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        page_size: params.limit || 10,
        ...(params.productId && { product: params.productId }),
        ordering: "-date",
      });

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/inventory/?${queryParams}`,
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

      const data = await response.json();

      return {
        records: data.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 10,
          total: data.count || 0,
          pages: Math.ceil((data.count || 0) / (params.limit || 10)),
        },
        total: data.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch inventory history");
    }
  },

  // Create inventory record (stock adjustment)
  async createInventoryRecord(recordData) {
    try {
      const payload = {
        product: recordData.productId,
        change: parseInt(recordData.change),
        reason: recordData.reason,
      };

      const response = await fetch(`${config.DJANGO_BASE_URL}/api/inventory/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(config.TOKEN_KEY)}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      return {
        success: true,
        record: data,
        message: "Inventory record created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create inventory record");
    }
  },

  // Get low stock items (products with low quantity)
  async getLowStockItems(threshold = 10) {
    try {
      const queryParams = new URLSearchParams({
        quantity_in_stock__lt: threshold,
        ordering: "quantity_in_stock",
      });

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/products/?${queryParams}`,
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

      const data = await response.json();
      return data.results || [];
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
      const queryParams = new URLSearchParams({
        search: query,
        ...(filters.category && { category: filters.category }),
        ordering: filters.ordering || "-date_added",
      });

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/products/?${queryParams}`,
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

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      throw new Error("Failed to search products");
    }
  },

  // Get top selling products for dashboard
  async getTopSellingProducts(limit = 5) {
    try {
      const queryParams = new URLSearchParams({
        ordering: "-sales_count",
        limit: limit,
      });

      const response = await fetch(
        `${config.DJANGO_BASE_URL}/api/products/?${queryParams}`,
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

      const data = await response.json();
      return data.results || [];
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
