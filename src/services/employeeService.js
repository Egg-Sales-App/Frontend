import { apiService } from "./api";

export const employeeService = {
  async getEmployees(params = {}) {
    try {
      return await apiService.get("/employees", params);
    } catch (error) {
      throw new Error("Failed to fetch employees");
    }
  },

  async getEmployee(id) {
    try {
      return await apiService.get(`/employees/${id}`);
    } catch (error) {
      throw new Error("Failed to fetch employee");
    }
  },

  async createEmployee(employeeData) {
    try {
      return await apiService.post("/employees", employeeData);
    } catch (error) {
      throw new Error(error.message || "Failed to create employee");
    }
  },

  async updateEmployee(id, employeeData) {
    try {
      return await apiService.put(`/employees/${id}`, employeeData);
    } catch (error) {
      throw new Error(error.message || "Failed to update employee");
    }
  },

  async deleteEmployee(id) {
    try {
      return await apiService.delete(`/employees/${id}`);
    } catch (error) {
      throw new Error("Failed to delete employee");
    }
  },

  async searchEmployees(query) {
    try {
      return await apiService.get("/employees/search", { q: query });
    } catch (error) {
      throw new Error("Failed to search employees");
    }
  },
};
