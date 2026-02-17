import React, { useEffect, useState } from "react";

const StatCard = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  color = "blue",
  animated = true,
}) => {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated || typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    const duration = 1000; // 1 second
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, animated]);

  const colorClasses = {
    blue: "from-blue-600/20 to-indigo-900/40 border-blue-500/30",
    green: "from-green-600/20 to-emerald-900/40 border-green-500/30",
    purple: "from-purple-600/20 to-pink-900/40 border-purple-500/30",
    orange: "from-orange-600/20 to-red-900/40 border-orange-500/30",
    teal: "from-teal-600/20 to-cyan-900/40 border-teal-500/30",
  };

  const iconColorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    green: "bg-green-500/20 text-green-400",
    purple: "bg-purple-500/20 text-purple-400",
    orange: "bg-orange-500/20 text-orange-400",
    teal: "bg-teal-500/20 text-teal-400",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-white">
            {typeof displayValue === "number" && displayValue % 1 !== 0
              ? displayValue.toFixed(1)
              : displayValue}
          </h3>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${iconColorClasses[color]}`}
          >
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          <span
            className={
              trend.direction === "up" ? "text-green-400" : "text-red-400"
            }
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-gray-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
