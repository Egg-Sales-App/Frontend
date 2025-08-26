import React, { useState, useEffect } from "react";

const NewEmployeeForm = ({ employee, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    department_id: 1, // Default department
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.user?.username || "",
        email: employee.user?.email || "",
        password: "", // Don't pre-populate password for security
        department_id: employee.department?.id || 1,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { username, email, password, department_id } = formData;

    // For editing, password is optional
    if (username && email && (employee || password) && department_id) {
      const employeeData = {
        username,
        email,
        department_id: parseInt(department_id),
      };

      // Only include password for new employees
      if (!employee && password) {
        employeeData.password = password;
      }

      onAdd(employeeData);
      if (!employee) {
        setFormData({
          username: "",
          email: "",
          password: "",
          department_id: 1,
        });
      }
    } else {
      alert(
        `Please fill all required fields${
          !employee ? " including password" : ""
        }.`
      );
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {employee ? "Edit Employee" : "Add New Employee"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        {!employee && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required={!employee}
          />
        )}
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={1}>Sales Department</option>
          <option value={2}>IT Department</option>
          <option value={3}>HR Department</option>
          <option value={4}>Finance Department</option>
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
