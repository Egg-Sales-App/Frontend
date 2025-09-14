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

  // Get user by email (for password setup)
  async getUserByEmail(email) {
    try {
      const response = await apiService.get("/users/", {
        search: email,
      });

      let user = null;
      if (response.results && response.results.length > 0) {
        user = response.results.find((u) => u.email === email);
      } else if (Array.isArray(response)) {
        user = response.find((u) => u.email === email);
      }

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw new Error("Failed to fetch user");
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

      // Extract email from response - it might be in different places
      let email = response.email || response.user?.email;

      // If email is not in response, try to decode from token
      if (!email && token) {
        try {
          // Token format: "email".timestamp.signature
          const tokenParts = token.split(".");
          if (tokenParts.length >= 1) {
            // Decode base64 encoded email (remove quotes)
            const decodedEmail = atob(tokenParts[0]).replace(/"/g, "");
            if (decodedEmail.includes("@")) {
              email = decodedEmail;
            }
          }
        } catch (decodeError) {
          console.warn("Could not decode email from token:", decodeError);
        }
      }

      return {
        valid: true,
        email: email || "Unknown",
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

      // Use the dedicated employee set-password endpoint
      const response = await apiService.post("/employees/set-password/", {
        token: data.token,
        password: data.password,
        confirm_password: data.confirmPassword,
        email: tokenValidation.email,
      });

      return {
        success: true,
        message: "Password set successfully",
        user: response,
      };
    } catch (error) {
      if (
        error.message === "Invalid token" ||
        error.message === "User not found"
      ) {
        throw error;
      }
      if (error.response?.status === 400) {
        throw new Error(
          error.response?.data?.message || "Password requirements not met"
        );
      } else if (error.response?.status === 403) {
        throw new Error("Invalid credentials or token expired");
      } else if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to set password");
    }
  },
};
