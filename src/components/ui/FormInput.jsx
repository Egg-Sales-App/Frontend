import React from "react";

const FormInput = ({
  label,
  type = "text",
  placeholder,
  icon,
  error,
  required = false,
  value,
  onChange,
  ...props
}) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-600 mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full h-10 px-4 border rounded-full focus:outline-none focus:ring focus:ring-blue-300 ${
          error ? "border-red-400" : "border-gray-400"
        }`}
        placeholder={placeholder}
        {...props}
      />
      {icon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default FormInput;
