import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import NewEmployeeForm from "../../components/ui/NewEmployeeForm";
import { employeeService } from "../../services/employeeService";
import { useToast } from "../../components/ui/ToastContext";
const Employee = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const { success: showSuccess, error: showError } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await employeeService.getEmployees();
        setEmployees(data);
        showSuccess("Employees loaded successfully");
      } catch (err) {
        console.error("Error fetching employees:", err);
        showError("Failed to load employees");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [showSuccess, showError]);

  const handleAddEmployee = async (newEmployeeData) => {
    try {
      setLoading(true);
      const newEmployee = await employeeService.createEmployee(newEmployeeData);

      // Try to fetch complete employee data, fallback to refreshing the list
      try {
        const completeEmployeeData = await employeeService.getEmployee(
          newEmployee.id
        );
        setEmployees([...employees, completeEmployeeData]);
      } catch (fetchError) {
        console.warn(
          "Could not fetch complete employee data, refreshing list:",
          fetchError
        );
        // Fallback: refresh the entire employees list
        const refreshedEmployees = await employeeService.getEmployees();
        setEmployees(refreshedEmployees);
      }

      setShowForm(false);
      showSuccess("Employee added successfully");
    } catch (err) {
      console.error("Error adding employee:", err);
      showError("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleEdit = async (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleUpdateEmployee = async (updatedEmployeeData) => {
    try {
      setLoading(true);
      const updatedEmployee = await employeeService.updateEmployee(
        editingEmployee.id,
        updatedEmployeeData
      );

      // Try to fetch complete employee data, fallback to refreshing the list
      try {
        const completeEmployeeData = await employeeService.getEmployee(
          editingEmployee.id
        );
        setEmployees(
          employees.map((emp) =>
            emp.id === editingEmployee.id ? completeEmployeeData : emp
          )
        );
      } catch (fetchError) {
        console.warn(
          "Could not fetch complete employee data, refreshing list:",
          fetchError
        );
        // Fallback: refresh the entire employees list
        const refreshedEmployees = await employeeService.getEmployees();
        setEmployees(refreshedEmployees);
      }

      setShowForm(false);
      setEditingEmployee(null);
      showSuccess("Employee updated successfully");
    } catch (err) {
      console.error("Error updating employee:", err);
      showError("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        setLoading(true);
        await employeeService.deleteEmployee(employeeId);
        setEmployees(employees.filter((emp) => emp.id !== employeeId));
        showSuccess("Employee deleted successfully");
      } catch (err) {
        console.error("Error deleting employee:", err);
        showError("Failed to delete employee");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="p-6 text-center text-gray-500">
          Loading employees data...
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Employees ({employees.length})
              </h2>
              <p className="text-gray-600">Manage your team members</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn bg-blue-500 text-white font-medium hover:bg-blue-600"
            >
              {showForm
                ? "Cancel"
                : editingEmployee
                ? "Edit Employee"
                : "Add Employee"}
            </button>
          </div>

          {showForm && (
            <NewEmployeeForm
              employee={editingEmployee}
              onAdd={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
              onCancel={handleCancelForm}
            />
          )}

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {employee.user?.username || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {employee.user?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {employee.department?.name || "No Department"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.user?.is_superuser
                              ? "bg-red-100 text-red-800"
                              : employee.user?.is_supplier
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {employee.user?.is_superuser
                            ? "Admin"
                            : employee.user?.is_supplier
                            ? "Supplier"
                            : "Employee"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit employee"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete employee"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {employees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No employees found. Add your first employee to get started.
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Employee;
