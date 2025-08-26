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
        password: employeeData.password,
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
};
