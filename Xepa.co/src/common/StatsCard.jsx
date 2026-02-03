import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue", 
  trend, 
  description,
  loading = false 
}) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" },
    red: { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-200" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
    gray: { bg: "bg-gray-50", icon: "text-gray-600", border: "border-gray-200" },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border ${colors.border} hover:shadow-md transition-shadow`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          {trend && (
            <div className={`text-sm font-medium px-2 py-1 rounded-full ${
              trend.direction === 'up' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              value
            )}
          </h3>
          <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
          {description && (
            <p className="text-xs text-gray-600">{description}</p>
          )}
        </div>
        
        {loading ? (
          <div className="mt-4 h-2 bg-gray-200 animate-pulse rounded-full"></div>
        ) : trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={`mr-2 ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? 'Increased' : 'Decreased'} from last period
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;