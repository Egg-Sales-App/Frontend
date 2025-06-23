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
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error
              ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
              : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
          }`}
          placeholder={placeholder}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
