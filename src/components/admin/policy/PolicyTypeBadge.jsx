import React from "react";
import { Gift, Calendar, Star, TrendingUp, Shield } from "lucide-react";

/**
 * PolicyTypeBadge – chip showing promotion / policy nature
 */
export const PolicyTypeBadge = ({ type, category }) => {
  const map = {
    // By category (higher priority)
    HOLIDAY: {
      Icon: Gift,
      label: "Lễ",
      bg: "bg-red-900",
      text: "text-red-200",
      border: "border-red-700",
    },
    SEASONAL: {
      Icon: Calendar,
      label: "Mùa",
      bg: "bg-blue-900",
      text: "text-blue-200",
      border: "border-blue-700",
    },
    SPECIAL_EVENT: {
      Icon: Star,
      label: "Sự kiện",
      bg: "bg-purple-900",
      text: "text-purple-200",
      border: "border-purple-700",
    },
    // By type
    TIERED: {
      Icon: TrendingUp,
      label: "Bậc thang",
      bg: "bg-green-900",
      text: "text-green-200",
      border: "border-green-700",
    },
    EVENT: {
      Icon: Star,
      label: "Sự kiện",
      bg: "bg-yellow-900",
      text: "text-yellow-200",
      border: "border-yellow-700",
    },
    DEFAULT: {
      Icon: Shield,
      label: "Chuẩn",
      bg: "bg-gray-700",
      text: "text-gray-300",
      border: "border-gray-600",
    },
  };

  const cfg = map[category] ?? map[type] ?? map.DEFAULT;
  const { Icon, label, bg, text, border } = cfg;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} border ${border}`}
    >
      <Icon size={12} className="mr-1" />
      {label}
    </span>
  );
};
export default PolicyTypeBadge;