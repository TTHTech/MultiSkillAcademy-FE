// src/components/admin/revenue/ErrorBoundary.jsx
import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/admin";
  };

  render() {
    if (this.state.hasError) {
      const isDevMode = process.env.NODE_ENV === 'development';
      
      return (
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <AlertCircle className="h-10 w-10 text-red-400" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                Oops! Đã xảy ra lỗi
              </h1>
              
              <p className="text-gray-300 text-lg">
                Ứng dụng gặp phải một vấn đề không mong muốn
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-gray-800/40 rounded-xl p-6 mb-8 border border-gray-700/50">
              <h3 className="text-red-400 font-semibold mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Chi tiết lỗi
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Thông báo lỗi:</p>
                  <p className="text-red-300 font-mono text-sm bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                    {this.state.error?.message || 'Lỗi không xác định'}
                  </p>
                </div>
                
                {this.state.retryCount > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Số lần thử lại:</p>
                    <p className="text-yellow-300 font-semibold">{this.state.retryCount}</p>
                  </div>
                )}
                
                {isDevMode && this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300 transition-colors">
                      Stack trace (Development mode)
                    </summary>
                    <pre className="text-xs text-gray-500 mt-2 bg-gray-900/50 p-3 rounded-lg border border-gray-700/50 overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.button
                onClick={this.handleRetry}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Thử lại
              </motion.button>

              <motion.button
                onClick={this.handleReload}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Tải lại trang
              </motion.button>

              <motion.button
                onClick={this.handleGoHome}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="h-5 w-5 mr-2" />
                Về trang chủ
              </motion.button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ với đội hỗ trợ kỹ thuật
              </p>
              
              {isDevMode && (
                <p className="text-yellow-400 text-xs mt-2 font-mono">
                  Development Mode - Chi tiết lỗi được hiển thị để debug
                </p>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;