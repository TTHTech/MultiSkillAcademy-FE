import React, { useState, useMemo } from "react";

const PageSalesCourse = ({ courseItem, onClose }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const safeCourseItem = courseItem || {
    instructorSalesUse: [],
    courseName: "N/A",
  };
  const salesUse = safeCourseItem.instructorSalesUse || [];
  const totalItems = salesUse.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return salesUse.slice(startIndex, startIndex + itemsPerPage);
  }, [salesUse, currentPage, itemsPerPage]);
  const formatUsedAt = (usedAt) => {
    if (!usedAt) {
      return "Không áp dụng discount";
    }
    const [year, month, day, hours, minutes, seconds, ms] = usedAt;
    const date = new Date(year, month - 1, day, hours, minutes, seconds, ms);
    return date.toLocaleString();
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      {onClose && (
        <button
          onClick={onClose}
          className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Quay lại
        </button>
      )}
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Chi tiết khóa học: {safeCourseItem.courseName}
      </h1>
      {!courseItem ? (
        <div className="p-6">
          <p className="text-red-500">
            Không có dữ liệu khóa học. Vui lòng thử lại.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    User ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Discount Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Discount Code
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Discount Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Used At
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData && currentData.length > 0 ? (
                  currentData.map((saleUser, index) => (
                    <tr key={index} className="border-b hover:bg-blue-50">
                      <td className="px-4 py-3 text-sm text-gray-800 text-center">
                        {saleUser.userId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {saleUser.firstName} {saleUser.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 text-center">
                        {saleUser.phoneNumber ? saleUser.phoneNumber : "N/A"}
                      </td>

                      {saleUser.discountName ? (
                        <>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {saleUser.discountName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 text-center">
                            {saleUser.discountCode}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 text-center">
                            {saleUser.discountAmount}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {formatUsedAt(saleUser.usedAt)}
                          </td>
                        </>
                      ) : (
                        <td
                          colSpan="4"
                          className="px-4 py-3 text-sm text-gray-500 italic text-center"
                        >
                          Không áp dụng discount
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-500">
                      Không có dữ liệu đăng ký cho khóa học này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {(() => {
                const pageNumbers = [];
                const maxPageButtons = 5;
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, currentPage + 2);

                if (endPage - startPage < maxPageButtons - 1) {
                  if (startPage === 1) {
                    endPage = Math.min(
                      totalPages,
                      startPage + maxPageButtons - 1
                    );
                  } else if (endPage === totalPages) {
                    startPage = Math.max(1, endPage - maxPageButtons + 1);
                  }
                }
                if (startPage > 1) {
                  pageNumbers.push(1);
                  if (startPage > 2) {
                    pageNumbers.push("ellipsis-start");
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageNumbers.push("ellipsis-end");
                  }
                  pageNumbers.push(totalPages);
                }

                return pageNumbers.map((page, index) =>
                  typeof page === "number" ? (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded border ${
                        page === currentPage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-blue-600 border-blue-300 hover:bg-blue-100"
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="px-4 py-2 text-gray-500">
                      ...
                    </span>
                  )
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PageSalesCourse;
