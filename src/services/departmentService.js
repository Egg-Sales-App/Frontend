import { apiService } from "./api";

export const departmentService = {
  // Get all departments
  async getDepartments() {
    try {
      const response = await apiService.get("/departments/");
      return response || [];
    } catch (error) {
      throw new Error("Failed to fetch departments");
    }
  },

  // Get single department
  async getDepartment(id) {
    try {
      const response = await apiService.get(`/departments/${id}/`);
      return response;
    } catch (error) {
      throw new Error("Failed to fetch department");
    }
  },

  // Create new department
  async createDepartment(departmentData) {
    try {
      const response = await apiService.post("/departments/", {
        name: departmentData.name,
      });
      return response;
    } catch (error) {
      throw new Error("Failed to create department");
    }
  },

  // Update department
  async updateDepartment(id, departmentData) {
    try {
      const response = await apiService.put(`/departments/${id}/`, {
        name: departmentData.name,
      });
      return response;
    } catch (error) {
      throw new Error("Failed to update department");
    }
  },

  // Delete department
  async deleteDepartment(id) {
    try {
      await apiService.delete(`/departments/${id}/`);
      return true;
    } catch (error) {
      throw new Error("Failed to delete department");
    }
  },
};
