// src/components/admin/revenue/Toast.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-emerald-600 to-green-600",
          border: "border-emerald-500/30",
          icon: CheckCircle2,
          iconColor: "text-emerald-200"
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-600 to-rose-600",
          border: "border-red-500/30",
          icon: AlertCircle,
          iconColor: "text-red-200"
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-600 to-orange-600",
          border: "border-yellow-500/30",
          icon: AlertTriangle,
          iconColor: "text-yellow-200"
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-600 to-indigo-600",
          border: "border-blue-500/30",
          icon: Info,
          iconColor: "text-blue-200"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-600 to-gray-700",
          border: "border-gray-500/30",
          icon: Info,
          iconColor: "text-gray-200"
        };
    }
  };

  const config = getToastConfig(toast.type);
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      <motion.div 
        className={`fixed bottom-6 right-6 ${config.bg} text-white p-4 rounded-xl shadow-2xl z-50 max-w-sm border ${config.border} backdrop-blur-sm`}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-5">{toast.message}</p>
            {toast.description && (
              <p className="text-xs text-white/80 mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-white/80 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 4, ease: "linear" }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;