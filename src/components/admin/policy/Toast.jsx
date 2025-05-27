//--------------------------------
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

/**
 * Toast – lightweight animated notification
 * @param {"success"|"error"|"warning"|"info"} type
 * @param {string} message
 */
export const Toast = ({ type = "info", message }) => {
  const config = {
    success: {
      bg: "bg-green-700",
      border: "border-green-600",
      Icon: CheckCircle,
      color: "text-green-200",
    },
    error: {
      bg: "bg-red-700",
      border: "border-red-600",
      Icon: XCircle,
      color: "text-red-200",
    },
    warning: {
      bg: "bg-yellow-700",
      border: "border-yellow-600",
      Icon: AlertCircle,
      color: "text-yellow-200",
    },
    info: {
      bg: "bg-blue-700",
      border: "border-blue-600",
      Icon: Info,
      color: "text-blue-200",
    },
  }[type] ?? {};

  const { bg, border, Icon, color } = config;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      className={`fixed bottom-4 right-4 ${bg} p-4 rounded-lg shadow-xl z-50 max-w-md border ${border}`}
    >
      <div className="flex items-start text-white">
        <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${color}`} />
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>
    </motion.div>
  );
};
export default Toast;