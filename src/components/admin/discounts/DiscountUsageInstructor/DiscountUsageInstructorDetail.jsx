import { useState } from "react";
import DiscountCreator from "../InforUserCreateDiscount";

const DiscountUsageDetail = ({ discount, onClose }) => {
  const [coursesSearchTerm, setCoursesSearchTerm] = useState("");
  const [usagesSearchTerm, setUsagesSearchTerm] = useState("");

  const filteredCourses = discount.appliedCourseIds.filter((course) => {
    const lowerCaseSearch = coursesSearchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(lowerCaseSearch) ||
      course.courseId.toLowerCase().includes(lowerCaseSearch)
    );
  });

  const filteredUsages = discount.userDiscountUsages.filter((usage) => {
    const lowerSearch = usagesSearchTerm.toLowerCase();
    return (
      usage.userId.toString().toLowerCase().includes(lowerSearch) ||
      usage.username.toLowerCase().includes(lowerSearch) ||
      usage.email.toLowerCase().includes(lowerSearch) ||
      usage.courseTitle.toLowerCase().includes(lowerSearch) ||
      usage.courseId.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="mt-8 border-t border-gray-600 pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">
          Details for: {discount.discountName}
        </h3>
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md shadow transition duration-200 ease-in-out"
        >
          Close
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="md:w-1/2">
          <h4 className="text-xl font-semibold text-white mb-2">
            Discount Details
          </h4>
          <div className="space-y-3">
            <div className="text-sm text-gray-200">
              <span className="font-medium text-white">Discount Code:</span>{" "}
              {discount.discountCode}
            </div>
            <div className="text-sm text-gray-200">
              <span className="font-medium text-white">Usage Limit:</span>{" "}
              {discount.usageLimit}
            </div>
            <div className="text-sm text-gray-200">
              <span className="font-medium text-white">Used:</span>{" "}
              {discount.usageCount}
            </div>
            <div className="text-sm text-gray-200">
              <span className="font-medium text-white">Total Discount:</span>{" "}
              {discount.totalDiscountAmount}
            </div>
            <div className="text-sm text-gray-200">
              <span className="font-medium text-white">Start Date:</span>{" "}
              {new Date(...discount.startDate).toLocaleDateString("vi-VN")}
            </div>
            <div className="text-sm text-gray-200">
              <span className="font-medium text-white">End Date:</span>{" "}
              {new Date(...discount.endDate).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>
        <div className="md:w-1/2">
          <div  className="mb-4">
            <h4 className="text-xl font-semibold text-white mb-2">
              Instructor Create Discount:
            </h4>
            <DiscountCreator discountId={discount.discountId} />
          </div>
          {discount.appliedCourseIds && discount.appliedCourseIds.length > 0 ? (
            <div>
              <div className="flex items-center gap-x-2">
                <h4 className="font-semibold text-lg">Applied Courses:</h4>
                <input
                  type="text"
                  className="p-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Search..."
                  value={coursesSearchTerm}
                  onChange={(e) => setCoursesSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto mt-2">
                <ul className="list-disc ml-5 text-sm">
                  {filteredCourses.map((course) => (
                    <li key={course.courseId} className="mt-1">
                      {course.title} ({course.courseId})
                    </li>
                  ))}
                  {filteredCourses.length === 0 && (
                    <li className="mt-1 text-gray-400">
                      No matching courses found.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300">
              No applied courses available.
            </p>
          )}
        </div>
      </div>

      {discount.userDiscountUsages &&
        discount.userDiscountUsages.length > 0 && (
          <div>
            <div className="flex items-center gap-x-2 mb-2 mt-4">
              <h4 className="font-semibold">User Discount Usages:</h4>
              <input
                type="text"
                placeholder="Search..."
                value={usagesSearchTerm}
                onChange={(e) => setUsagesSearchTerm(e.target.value)}
                className="p-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-white text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-2 px-3 border border-gray-600">
                      User ID
                    </th>
                    <th className="py-2 px-3 border border-gray-600">
                      Username
                    </th>
                    <th className="py-2 px-3 border border-gray-600">Email</th>
                    <th className="py-2 px-3 border border-gray-600">Course</th>
                    <th className="py-2 px-3 border border-gray-600">
                      Discount
                    </th>
                    <th className="py-2 px-3 border border-gray-600">
                      Used At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsages.map((usage, idx) => (
                    <tr
                      key={`${usage.userId}-${idx}`}
                      className="hover:bg-gray-600 transition-colors duration-200"
                    >
                      <td className="py-1 px-2 border border-gray-600 text-center">
                        {usage.userId}
                      </td>
                      <td className="py-1 px-2 border border-gray-600">
                        {usage.username}
                      </td>
                      <td className="py-1 px-2 border border-gray-600">
                        {usage.email}
                      </td>
                      <td className="py-1 px-2 border border-gray-600">
                        {usage.courseTitle} ({usage.courseId})
                      </td>
                      <td className="py-1 px-2 border border-gray-600 text-center">
                        {usage.discountAmount}
                      </td>
                      <td className="py-1 px-2 border border-gray-600 text-center">
                        {new Date(...usage.usedAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                  {filteredUsages.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-1 px-2 border border-gray-600 text-center text-gray-400"
                      >
                        No matching usages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default DiscountUsageDetail;
