import { useState, useEffect } from "react";
import FilterReview from "../../components/admin/ReviewCourse/FilterReview";
import TableReview from "../../components/admin/ReviewCourse/TableReview";
import Header from "../../components/admin/common/Header";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const PageReview = () => {
  const [reviews, setReviews] = useState([]);
  const [filters, setFilters] = useState({
    courseTitle: "",
    username: "",
    rating: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const handleDeleteReview = (deletedId) => {
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review.id !== deletedId)
    );
  };
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh((prev) => !prev);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${baseUrl}/api/admin/reviews/table`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Lỗi khi tải dữ liệu reviews");
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [refresh]);
  const filteredReviews = reviews.filter((review) => {
    const searchValue = filters.courseTitle.toLowerCase();
    const matchesSearch =
      review.courseTitle.toLowerCase().includes(searchValue) ||
      review.username.toLowerCase().includes(searchValue);
    const matchesRating =
      filters.rating === "" || review.rating.toString() === filters.rating;
    return matchesSearch && matchesRating;
  });
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPagination = () => {
    let pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const left = [1, 2, 3];
      const right = [totalPages - 2, totalPages - 1, totalPages];
      let middle = [];
      if (currentPage > 3 && currentPage < totalPages - 2) {
        middle = [currentPage - 1, currentPage, currentPage + 1];
      } else if (currentPage <= 3) {
        middle = [4, 5];
      } else {
        middle = [totalPages - 4, totalPages - 3];
      }
      let allPages = [...new Set([...left, ...middle, ...right])].sort(
        (a, b) => a - b
      );
      for (let i = 0; i < allPages.length; i++) {
        if (i > 0 && allPages[i] - allPages[i - 1] > 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(allPages[i]);
      }
    }

    return (
      <div className="flex items-center space-x-2 mt-4 justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Prev
        </button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1 text-gray-700">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-700 text-white font-bold"
                  : "bg-blue-500 text-white"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto">
        <Header title="Đánh Giá Khóa Học" />
        <div className="p-6">
          <FilterReview filters={filters} setFilters={setFilters} />
          <TableReview
            reviews={currentReviews}
            onDeleteReview={handleDeleteReview}
            triggerRefresh={triggerRefresh}
          />
          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default PageReview;
