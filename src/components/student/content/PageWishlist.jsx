import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Loader2,
  RefreshCw,
  Heart,
  X,
  AlertTriangle,
} from "lucide-react";
import WishlistList from "../../instructor/Card/WishlistListCard";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;
import { ChevronRight } from "lucide-react";
const ITEMS_PER_PAGE = 4;

const PageWishlist = () => {
  const userId = localStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/student/wishlist/${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setError("Failed to load wishlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const handleDeleteCourse = (courseId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((course) => course.courseId !== courseId)
    );
  };

  // Filter and Search Logic
  const filterCourses = (courses) => {
    return courses.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesPrice =
        priceFilter === "all"
          ? true
          : priceFilter === "free"
          ? course.price === 0
          : priceFilter === "paid"
          ? course.price > 0
          : true;

      const matchesRating =
        ratingFilter === "all" ? true : course.rating >= Number(ratingFilter);

      return matchesSearch && matchesPrice && matchesRating;
    });
  };

  // Sorting Logic
  const sortCourses = (courses) => {
    switch (sortBy) {
      case "price-low":
        return [...courses].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...courses].sort((a, b) => b.price - a.price);
      case "rating":
        return [...courses].sort((a, b) => b.rating - a.rating);
      case "newest":
        return [...courses].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      default:
        return courses;
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setRatingFilter("all");
    setSortBy("newest");
  };

  // Calculate pagination
  const filteredAndSortedCourses = sortCourses(filterCourses(wishlist));
  const totalPages = Math.ceil(
    filteredAndSortedCourses.length / ITEMS_PER_PAGE
  );
  const paginatedCourses = filteredAndSortedCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-gray-100 min-h-screen mt-[50px] mb-[90px]">
      <div className="max-w-[1350px] mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a
            href="/student/home"
            className="hover:text-blue-600 transition-colors duration-200 mt-[50px]"
          >
            Trang chủ
          </a>
          <ChevronRight className="w-4 h-4 mt-[50px]" />
          <span className="text-gray-700 font-medium mt-[50px]">
            Khóa học yêu thích
          </span>
        </div>
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-800">
              Danh sách khóa học yêu thích
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {filteredAndSortedCourses.length} khóa học đã lưu
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search your saved courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all cursor-pointer"
              >
                <option value="all">Tất cả giá</option>
                <option value="free">Miễn phí</option>
                <option value="paid">Trả phí</option>
              </select>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all cursor-pointer"
              >
                <option value="all">Tất cả xếp hạng</option>
                <option value="4">4+ Sao</option>
                <option value="3">3+ Sao</option>
                <option value="2">2+ Sao</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-all cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="price-low">Giá: Thấp đến cao</option>
                <option value="price-high">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || priceFilter !== "all" || ratingFilter !== "all") && (
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    Tìm kiếm: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {priceFilter !== "all" && (
                  <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    Giá:{" "}
                    {priceFilter.charAt(0).toUpperCase() + priceFilter.slice(1)}
                    <button
                      onClick={() => setPriceFilter("all")}
                      className="hover:text-green-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {ratingFilter !== "all" && (
                  <span className="bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                    Đánh giá: {ratingFilter}+ Sao
                    <button
                      onClick={() => setRatingFilter("all")}
                      className="hover:text-yellow-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center justify-between">
            <p className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </p>
            <button
              onClick={fetchWishlist}
              className="flex items-center gap-2 text-sm font-medium hover:text-red-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500">
                Đang tải danh sách yêu thích khóa học của bạn...
              </p>
            </div>
          ) : paginatedCourses.length > 0 ? (
            <>
              <WishlistList
                wishlist={paginatedCourses}
                onDelete={handleDeleteCourse}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Kế tiếp
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2 font-medium">
                Không tìm thấy khóa học nào
              </p>
              <p className="text-gray-500">
                {searchQuery || priceFilter !== "all" || ratingFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Your wishlist is empty. Save some courses to get started!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageWishlist;
