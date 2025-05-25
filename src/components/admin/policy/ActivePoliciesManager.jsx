import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Zap,
  Shield,
  Info,
  Calendar,
  CheckCircle,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

const ActivePoliciesManager = ({ isOpen, onClose, policies, onTogglePolicy, onRefresh }) => {
  const [localPolicies, setLocalPolicies] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen && policies) {
      setLocalPolicies(policies.map(p => ({ ...p })));
      setHasChanges(false);
    }
  }, [isOpen, policies]);

  const handleToggle = (policyId) => {
    setLocalPolicies(prev => 
      prev.map(p => 
        p.id === policyId ? { ...p, active: !p.active } : p
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Get policies that changed status
    const changedPolicies = localPolicies.filter((localPolicy, index) => {
      const originalPolicy = policies[index];
      return originalPolicy && originalPolicy.active !== localPolicy.active;
    });

    // Apply changes
    for (const policy of changedPolicies) {
      await onTogglePolicy(policy.id, !policy.active); // Toggle from original state
    }

    onRefresh();
    onClose();
  };

  const activePoliciesCount = localPolicies.filter(p => p.active).length;
  const hasActiveChanges = localPolicies.some((p, i) => policies[i] && policies[i].active !== p.active);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Zap className="mr-2 text-yellow-400" size={24} />
                Quản lý chính sách hoạt động
              </h2>
              <p className="text-gray-400 mt-1">
                Có thể kích hoạt nhiều chính sách cùng lúc. Hệ thống sẽ áp dụng theo độ ưu tiên.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">

        {/* Info Box */}
        <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="text-blue-400 mt-0.5 mr-3 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">Lưu ý về chính sách đa hoạt động:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-300">
                <li>Khi có nhiều chính sách active, hệ thống sẽ chọn theo độ ưu tiên cao nhất</li>
                <li>Chính sách EVENT có độ ưu tiên cao hơn STANDARD</li>
                <li>Trong cùng loại, chính sách có priority cao hơn sẽ được áp dụng</li>
                <li>Kiểm tra kỹ thời gian hiệu lực (validFrom - validTo) của từng chính sách</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">Tổng chính sách</p>
            <p className="text-2xl font-bold text-white">{localPolicies.length}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-400">{activePoliciesCount}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400">Thay đổi</p>
            <p className="text-2xl font-bold text-yellow-400">
              {localPolicies.filter((p, i) => policies[i] && policies[i].active !== p.active).length}
            </p>
          </div>
        </div>

        {/* Policy List */}
        <div className="space-y-3">
          {localPolicies.map((policy, index) => {
            const hasChanged = policies[index] && policies[index].active !== policy.active;
            const isExpired = policy.expired;
            
            return (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-700 rounded-lg p-4 border ${
                  hasChanged ? 'border-yellow-600' : 'border-gray-600'
                } ${isExpired ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Shield className={`${policy.active ? 'text-green-400' : 'text-gray-500'}`} size={20} />
                      <div>
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          {policy.name}
                          {hasChanged && (
                            <span className="text-xs text-yellow-400 bg-yellow-900 px-2 py-0.5 rounded">
                              Đã thay đổi
                            </span>
                          )}
                          {isExpired && (
                            <span className="text-xs text-red-400 bg-red-900 px-2 py-0.5 rounded">
                              Hết hạn
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                          <span>Loại: {policy.policyType}</span>
                          <span>Ưu tiên: {policy.priority}</span>
                          {policy.validTo && (
                            <span className="flex items-center">
                              <Calendar size={12} className="mr-1" />
                              Đến: {new Date(policy.validTo).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleToggle(policy.id)}
                    disabled={isExpired}
                    className={`ml-4 p-2 rounded-lg transition-all ${
                      isExpired 
                        ? 'bg-gray-800 cursor-not-allowed opacity-50' 
                        : policy.active 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                    }`}
                  >
                    {policy.active ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Warning for conflicts */}
        {activePoliciesCount > 1 && (
          <div className="mt-4 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg p-3">
            <div className="flex items-center text-yellow-300 text-sm">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <p>
                Có {activePoliciesCount} chính sách đang hoạt động. 
                Hệ thống sẽ ưu tiên chính sách có priority cao nhất phù hợp với từng trường hợp.
              </p>
            </div>
          </div>
        )}
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-800 rounded-b-xl">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                hasChanges
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle size={16} className="mr-2" />
              Lưu thay đổi {hasChanges && `(${localPolicies.filter((p, i) => policies[i] && policies[i].active !== p.active).length})`}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActivePoliciesManager;