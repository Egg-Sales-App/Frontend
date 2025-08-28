import React, { useState, useEffect } from "react";
import { departmentService } from "../../services/departmentService";

const NewEmployeeForm = ({ employee, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department_id: "", // Will be set when departments load
  });
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
        // Set default department if no employee is being edited
        if (!employee && data.length > 0) {
          setFormData((prev) => ({ ...prev, department_id: data[0].id }));
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, [employee]);

  // Pre-populate form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.user?.username || "",
        email: employee.user?.email || "",
        department_id: employee.department?.id || "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { username, email, department_id } = formData;

    // For editing
    if (username && email && employee && department_id) {
      const employeeData = {
        username,
        email,
        department_id: parseInt(department_id),
      };

      onAdd(employeeData);
      if (!employee) {
        setFormData({
          username: "",
          email: "",
          department_id: 1,
        });
      }
    } else {
      alert(`Please fill all required fields.`);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-500">
        {employee ? "Edit Employee" : "Add New Employee"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
          disabled={loadingDepartments}
        >
          {loadingDepartments ? (
            <option value="">Loading departments...</option>
          ) : departments.length > 0 ? (
            <>
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </>
          ) : (
            <option value="">No departments available</option>
          )}
        </select>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {employee ? "Update Employee" : "Add Employee"}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewEmployeeForm;
