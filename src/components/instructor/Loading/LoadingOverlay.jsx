// LoadingOverlay.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ isVisible, message = 'Loading...' }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          // từ fixed chuyển sang absolute
          className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm"
          aria-live="polite"
          aria-busy="true"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center"
          >
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" aria-label="Loading spinner" />
            <p className="mt-4 text-gray-800 text-lg font-semibold">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
