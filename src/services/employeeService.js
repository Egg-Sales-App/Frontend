import { apiService } from "./api";

export const employeeService = {
  // Get all employees
  async getEmployees(params = {}) {
    try {
      const response = await apiService.get("/employees", {
        page: params.page || 1,
        limit: params.limit || 50,
        search: params.search,
        department: params.department,
        role: params.role,
        status: params.status || "active",
      });

      return {
        employees: response.data || response.employees || [],
        pagination: response.pagination || {},
        total: response.total || 0,
      };
    } catch (error) {
      throw new Error("Failed to fetch employees");
    }
  },

  // Get single employee
  async getEmployee(id) {
    try {
      const response = await apiService.get(`/employees/${id}`);
      return response.data || response.employee || response;
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  },

  // Create new employee
  async createEmployee(employeeData) {
    try {
      const response = await apiService.post("/employees", {
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        gender: employeeData.gender,
        department: employeeData.department,
        role: employeeData.role || "employee",
        salary: parseFloat(employeeData.salary || 0),
        hireDate: employeeData.hireDate,
        address: employeeData.address,
        emergencyContact: employeeData.emergencyContact,
        status: employeeData.status || "active",
      });

      return {
        success: true,
        employee: response.data || response.employee || response,
        message: response.message || "Employee created successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create employee");
    }
  },

  // Update employee
  async updateEmployee(id, employeeData) {
    try {
      const response = await apiService.put(`/employees/${id}`, employeeData);

      return {
        success: true,
        employee: response.data || response.employee || response,
        message: response.message || "Employee updated successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update employee");
    }
  },

  // Delete employee (usually soft delete)
  async deleteEmployee(id) {
    try {
      const response = await apiService.delete(`/employees/${id}`);

      return {
        success: true,
        message: response.message || "Employee deleted successfully",
      };
    } catch (error) {
      throw new Error("Failed to delete employee");
    }
  },

  // Search employees
  async searchEmployees(query) {
    try {
      const response = await apiService.get("/employees/search", { q: query });
      return response.data || response.employees || [];
    } catch (error) {
      throw new Error("Failed to search employees");
    }
  },

  // Get employee stats
  async getEmployeeStats() {
    try {
      const response = await apiService.get("/employees/stats");
      return response.data || response;
    } catch (error) {
      throw new Error("Failed to fetch employee statistics");
    }
  },
};
