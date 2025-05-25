import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination – compact paginator with ellipsis
 */
export const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
  const build = () => {
    const pages = [];
    const V = 7; // max visible buttons

    if (totalPages <= V) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(...[1, 2, 3, 4, 5, "...", totalPages]);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", ...Array.from({ length: 5 }, (_, i) => totalPages - 4 + i));
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    return pages;
  };

  const numbers = build();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-400">
        Hiển thị trang <span className="font-medium text-gray-300">{currentPage}</span> / <span className="font-medium text-gray-300">{totalPages}</span>
        {totalItems !== undefined && <span className="ml-2">({totalItems} kết quả)</span>}
      </div>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Center buttons */}
        {numbers.map((page, i) => (
          <button
            key={i}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={`min-w-[40px] px-3 py-2 rounded-md transition-colors ${
              page === currentPage
                ? "bg-purple-600 text-white"
                : page === "..."
                ? "bg-transparent text-gray-500 cursor-default"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
export default Pagination;