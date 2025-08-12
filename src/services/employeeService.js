import { apiService } from "./api";

export const employeeService = {
  // Get all users (employees)
  async getEmployees(params = {}) {
    try {
      const response = await apiService.get("/users/", {
        page: params.page || 1,
        page_size: params.limit || 50,
        search: params.search,
        is_active: params.status === "active" ? true : undefined,
      });

      return {
        employees: response.results || [],
        pagination: {
          page: params.page || 1,
          limit: params.limit || 50,
          total: response.count || 0,
          pages: Math.ceil((response.count || 0) / (params.limit || 50)),
        },
        total: response.count || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch employees");
    }
  },

  // Get single user/employee
  async getEmployee(id) {
    try {
      const response = await apiService.get(`/users/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  },

  // Create new user/employee (admin only)
  // Create new user/employee (admin only)
  async createEmployee(employeeData) {
    try {
      const response = await apiService.post("/users/", {
        username: employeeData.username || employeeData.email,
        email: employeeData.email,
        first_name:
          employeeData.firstName || employeeData.name?.split(" ")[0] || "",
        last_name:
          employeeData.lastName ||
          employeeData.name?.split(" ").slice(1).join(" ") ||
          "",
        password: employeeData.password || "DefaultPassword123!",
        is_supplier: employeeData.role === "supplier" || false,
        is_active: employeeData.status !== "inactive",
      });

      return {
        success: true,
        employee: response,
        message: "Employee created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create employee");
    }
  },
};
