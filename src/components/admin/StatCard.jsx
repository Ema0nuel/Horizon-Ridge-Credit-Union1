import React from "react";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType,
  color,
}) => {
  const trendColor =
    trendType === "increase" ? "text-green-600" : "text-red-600";
  const trendBg = trendType === "increase" ? "bg-green-50" : "bg-red-50";

  return (
    <div className="bg-primary border border-secondary rounded-sm p-6 shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs sm:text-sm text-secondary opacity-70 uppercase tracking-wider font-semibold mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-secondary">
            {value}
          </p>
        </div>
        <div
          className={`${color} p-3 rounded-sm text-primary flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-secondary">
        <p className="text-xs text-secondary opacity-60">{subtitle}</p>
        <div
          className={`${trendBg} ${trendColor} px-2 py-1 rounded text-xs font-semibold`}
        >
          {trend}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
