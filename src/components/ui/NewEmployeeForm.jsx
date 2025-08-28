import React, { useState, useEffect } from "react";
import { departmentService } from "../../services/departmentService";

const NewEmployeeForm = ({ employee, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Added loading state

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getDepartments();
        setDepartments(data);
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
    } else {
      // Reset form for new employee
      setFormData({
        username: "",
        email: "",
        department_id: departments.length > 0 ? departments[0].id : "",
      });
    }
  }, [employee, departments]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { username, email, department_id } = formData;

    // Improved validation
    if (!username.trim()) {
      alert("Username is required");
      return;
    }
    if (!email.trim()) {
      alert("Email is required");
      return;
    }
    if (!department_id) {
      alert("Please select a department");
      return;
    }

    setSubmitting(true);

    try {
      const employeeData = {
        username: username.trim(),
        email: email.trim(),
        department_id: parseInt(department_id),
      };
      await onAdd(employeeData);

      // Reset form only for new employees
      if (!employee) {
        setFormData({
          username: "",
          email: "",
          department_id: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error will be handled by parent component via toast
    } finally {
      setSubmitting(false);
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
          placeholder="Username *"
          value={formData.username}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={submitting}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="email"
          disabled={submitting}
          required
        />
        <select
          name="department_id"
          value={formData.department_id}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loadingDepartments || submitting}
          required
        >
          {loadingDepartments ? (
            <option value="">Loading departments...</option>
          ) : departments.length > 0 ? (
            <>
              <option value="">Select a department *</option>
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
      
      {/* Password Setup Info for New Employees */}
      {!employee && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
              <span className="text-white text-xs">ℹ</span>
            </div>
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">Password Setup</p>
              <p className="text-blue-700">
                The employee will receive an email with a secure link to set up their password. 
                No password is required during employee creation.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSubmit}
          disabled={submitting || loadingDepartments}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {employee ? "Update Employee" : "Add Employee"}
        </button>
        <button
          onClick={onCancel}
          disabled={submitting}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewEmployeeForm;
