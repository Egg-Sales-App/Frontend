import React from "react";
import { EMPTY_STATE_MESSAGES } from "../../constants/constants";

const EmptyState = ({ type, title, message, icon, action, className = "" }) => {
  // Use predefined message if type is provided, otherwise use custom props
  const emptyState = type
    ? EMPTY_STATE_MESSAGES[type]
    : { title, message, icon };

  return (
    <div
      className={`flex flex-col items-center justify-center text-gray-500 ${className}`}
    >
      <div className="text-6xl mb-4 opacity-60">{emptyState.icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        {emptyState.title}
      </h3>
      <p className="text-sm text-center text-gray-600 mb-4 max-w-md">
        {emptyState.message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
