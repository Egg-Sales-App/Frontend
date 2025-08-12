import { apiService } from "./api";

export const customerService = {
  // Get all customers
  async getCustomers(params = {}) {
    try {
      const response = await apiService.get("/customers/", {
        page: params.page || 1,
        page_size: params.limit || 20,
        search: params.search,
        ordering: params.ordering || "-date_joined",
      });

      return {
        customers: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 20)),
        },
        total: response.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch customers");
    }
  },

  // Get single customer
  async getCustomer(id) {
    try {
      const response = await apiService.get(`/customers/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch customer");
    }
  },

  // Create new customer
  async createCustomer(customerData) {
    try {
      // First create the user
      const userResponse = await apiService.post("/users/", {
        username: customerData.username || customerData.email,
        email: customerData.email,
        first_name:
          customerData.firstName || customerData.name?.split(" ")[0] || "",
        last_name:
          customerData.lastName ||
          customerData.name?.split(" ").slice(1).join(" ") ||
          "",
        password: customerData.password || "DefaultPassword123!",
      });

      // Then create the customer profile
      const customerResponse = await apiService.post("/customers/", {
        user: userResponse.id,
        phone_number: customerData.phone,
        address: customerData.address,
      });

      return {
        success: true,
        customer: customerResponse,
        user: userResponse,
        message: "Customer created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create customer");
    }
  },

  // Update existing customer
  async updateCustomer(id, customerData) {
    try {
      const response = await apiService.patch(`/customers/${id}/`, {
        phone_number: customerData.phone,
        address: customerData.address,
      });

      return {
        success: true,
        customer: response,
        message: "Customer updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update customer");
    }
  },

  // Delete customer
  async deleteCustomer(id) {
    try {
      await apiService.delete(`/customers/${id}/`);

      return {
        success: true,
        message: "Customer deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete customer");
    }
  },

  // Search customers
  async searchCustomers(query) {
    try {
      const response = await apiService.get("/customers/", {
        search: query,
        page_size: 50,
      });
      return response.results || [];
    } catch (error) {
      throw new Error("Failed to search customers");
    }
  },

  // Get customer orders
  async getCustomerOrders(customerId, params = {}) {
    try {
      const response = await apiService.get("/orders/", {
        customer: customerId,
        page: params.page || 1,
        page_size: params.limit || 20,
        ordering: "-order_date",
      });

      return {
        orders: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 20,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 20)),
        },
        total: response.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch customer orders");
    }
  },
};
