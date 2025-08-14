import { apiService } from "./api";

export const supplierService = {
  // Get all suppliers
  async getSuppliers(params = {}) {
    try {
      const response = await apiService.get("/api/suppliers/", {
        page: params.page || 1,
        page_size: params.limit || 20,
        search: params.search,
        ordering: params.ordering || "name",
      });

      console.log("📦 Suppliers API Response:", response);

      // Handle direct array response from backend
      if (Array.isArray(response)) {
        console.log("📋 Backend returned direct array of suppliers");
        return {
          suppliers: response,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: response.length,
            pages: 1,
          },
          total: response.length,
        };
      }

      // Handle paginated response (if backend uses pagination)
      if (response.results && Array.isArray(response.results)) {
        console.log("📋 Backend returned paginated suppliers response");
        return {
          suppliers: response.results,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: response.count || 0,
            pages: Math.ceil((response.count || 0) / (params.limit || 20)),
          },
          total: response.count || 0,
        };
      }

      // Fallback for unexpected response format
      console.warn("⚠️ Unexpected suppliers API response format:", response);
      return {
        suppliers: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
        total: 0,
      };
    } catch (error) {
      console.error("❌ Error fetching suppliers:", error);
      throw new Error("Failed to fetch suppliers");
    }
  },

  // Get single supplier
  async getSupplier(id) {
    try {
      const response = await apiService.get(`/suppliers/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch supplier");
    }
  },

  // Create new supplier
  async createSupplier(supplierData) {
    try {
      const response = await apiService.post("/suppliers/", {
        name: supplierData.name,
        contact_email: supplierData.email,
        contact_phone: supplierData.phone,
        address: supplierData.address,
      });

      return {
        success: true,
        supplier: response,
        message: "Supplier created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create supplier");
    }
  },

  // Update existing supplier
  async updateSupplier(id, supplierData) {
    try {
      const response = await apiService.put(`/suppliers/${id}/`, {
        name: supplierData.name,
        contact_email: supplierData.email,
        contact_phone: supplierData.phone,
        address: supplierData.address,
      });

      return {
        success: true,
        supplier: response,
        message: "Supplier updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update supplier");
    }
  },

  // Delete supplier
  async deleteSupplier(id) {
    try {
      await apiService.delete(`/suppliers/${id}/`);

      return {
        success: true,
        message: "Supplier deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete supplier");
    }
  },

  // Search suppliers
  async searchSuppliers(query) {
    try {
      const response = await apiService.get("/suppliers/", {
        search: query,
        page_size: 50,
      });
      return response.results || [];
    } catch (error) {
      throw new Error("Failed to search suppliers");
    }
  },
};
