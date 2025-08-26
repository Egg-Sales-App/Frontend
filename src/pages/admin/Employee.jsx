import React, { useState, useEffect } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import NewEmployeeForm from "../../components/ui/NewEmployeeForm";
const Employee = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/employees/");
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddEmployee = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  const handleEdit = (employeeId) => {
    console.log("Edit employee:", employeeId);
    // Add edit functionality
  };

  const handleDelete = (employeeId) => {
    console.log("Delete employee:", employeeId);
    // Add delete functionality
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
              {showForm ? "Cancel" : "Add Employee"}
            </button>
          </div>

          {showForm && (
            <NewEmployeeForm
              onAdd={handleAddEmployee}
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
                      Gender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pin
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
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.gender === "Male"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {employee.gender}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {employee.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {employee.pin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(employee.id)}
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
