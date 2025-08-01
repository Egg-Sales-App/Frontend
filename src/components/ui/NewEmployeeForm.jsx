import React, { useState } from "react";

const NewEmployeeForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    userId: '',
    pin: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, gender, userId, pin } = formData;
    if (name && gender && userId && pin) {
      const newEmployee = {
        ...formData,
        id: Date.now(), // or use a better ID system
      };
      onAdd(newEmployee);
      setFormData({ name: '', gender: '', userId: '', pin: '' });
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Employee</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="pin"
          placeholder="Pin"
          value={formData.pin}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewEmployeeForm;
