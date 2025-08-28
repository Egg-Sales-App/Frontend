import { apiService } from "./api";

export const employeeService = {
  // Get all employees
  async getEmployees(params = {}) {
    try {
      const response = await apiService.get("/employees/", {
        page: params.page || 1,
        page_size: params.limit || 50,
        search: params.search,
      });

      return response || [];
    } catch (error) {
      throw new Error("Failed to fetch employees");
    }
  },

  // Get single employee
  async getEmployee(id) {
    try {
      const response = await apiService.get(`/employees/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  },

  // Create new employee
  async createEmployee(employeeData) {
    try {
      const response = await apiService.post("/employees/", {
        username: employeeData.username,
        email: employeeData.email,
        department_id: employeeData.department_id,
      });
      return response;
    } catch (error) {
      throw new Error("Failed to create employee");
    }
  },

  // Update employee
  async updateEmployee(id, employeeData) {
    try {
      const response = await apiService.put(`/employees/${id}/`, {
        user: {
          username: employeeData.username,
          email: employeeData.email,
          is_supplier: employeeData.is_supplier || false,
          is_superuser: employeeData.is_superuser || false,
          is_employee: employeeData.is_employee !== false,
        },
        department: {
          name: employeeData.department_name,
        },
      });
      return response;
    } catch (error) {
      throw new Error("Failed to update employee");
    }
  },

  // Delete employee
  async deleteEmployee(id) {
    try {
      await apiService.delete(`/employees/${id}/`);
      return true;
    } catch (error) {
      throw new Error("Failed to delete employee");
    }
  },

  // Validate password setup token using verify-email endpoint
  async validatePasswordToken(token) {
    try {
      const response = await apiService.get("/verify-email/", {
        token: token,
      });
      return {
        valid: true,
        email: response.email || response.user?.email || "Unknown",
        message: response.message || "Email verified successfully",
      };
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error("Invalid or expired token");
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to validate token");
    }
  },

  // Set employee password using token (after email verification)
  async setEmployeePassword(data) {
    try {
      // First, verify the token and get user email
      const tokenValidation = await this.validatePasswordToken(data.token);
      if (!tokenValidation.valid) {
        throw new Error("Invalid token");
      }

      // Get the user by email to find their ID
      const usersResponse = await apiService.get("/users/", {
        search: tokenValidation.email
      });
      
      let user = null;
      if (usersResponse.results && usersResponse.results.length > 0) {
        user = usersResponse.results.find(u => u.email === tokenValidation.email);
      } else if (Array.isArray(usersResponse)) {
        user = usersResponse.find(u => u.email === tokenValidation.email);
      }

      if (!user) {
        throw new Error("User not found");
      }

      // Update the user's password
      const updateResponse = await apiService.patch(`/users/${user.id}/`, {
        password: data.password
      });

      return {
        success: true,
        message: "Password set successfully",
        user: updateResponse
      };
    } catch (error) {
      if (error.message === "Invalid token" || error.message === "User not found") {
        throw error;
      }
      if (error.response?.status === 400) {
        throw new Error(
          error.response?.data?.message ||
            "Password requirements not met"
        );
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to set password");
    }
  },
};
