import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You could send the error to an error‑tracking service here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-900/20 border-l-4 border-red-500 text-red-400 p-4 rounded-lg my-4 shadow-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h2 className="text-lg font-semibold">Đã xảy ra lỗi</h2>
              <p className="text-sm mt-1 font-medium">
                {this.state.error?.message || "Không thể hiển thị component này"}
              </p>
              <button
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition shadow-sm text-sm font-medium inline-flex items-center"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={16} className="mr-2" />
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;