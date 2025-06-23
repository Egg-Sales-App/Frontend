import React from "react";

const MetricCard = ({
  icon,
  value,
  label,
  bgColor = "bg-green-100",
  iconColor = "text-green-500",
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-8 h-8 ${bgColor} rounded-md flex items-center justify-center`}
    >
      {React.cloneElement(icon, { size: 18, className: iconColor })}
    </div>
    <div>
      <div className="text-[16px] font-semibold text-gray-600">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

export default MetricCard;
