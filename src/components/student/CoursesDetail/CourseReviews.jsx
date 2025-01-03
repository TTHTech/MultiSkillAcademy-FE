import React, { useState, useMemo } from 'react';
import { Star, ChevronDown, ChevronUp, MessageCircle, Search, Filter, SortDesc } from 'lucide-react';

const RatingStars = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ))}
    <span className="ml-1 text-sm font-medium text-gray-700">
      {rating.toFixed(1)}
    </span>
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-start gap-4">
      <img
        src={review.profileImage || '/default-avatar.png'}
        alt={`${review.studentFirstName} ${review.studentLastName}`}
        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium text-gray-900">
              {review.studentFirstName} {review.studentLastName}
            </h4>
            <RatingStars rating={review.rating} />
          </div>
          <span className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed">
          {review.comment}
        </p>
      </div>
    </div>
  </div>
);

const FilterButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active 
        ? "bg-blue-50 text-blue-600 hover:bg-blue-100" 
        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);

const CourseReviews = ({ reviews = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest"); // "newest", "oldest", "highest", "lowest"

  // Tính toán thống kê đánh giá
  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length || 0;
  const ratingCounts = reviews.reduce((acc, curr) => {
    acc[curr.rating] = (acc[curr.rating] || 0) + 1;
    return acc;
  }, {});

  // Lọc và sắp xếp đánh giá
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = [...reviews];

    // Lọc theo tìm kiếm
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${review.studentFirstName} ${review.studentLastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo số sao
    if (selectedRating > 0) {
      filtered = filtered.filter(review => review.rating === selectedRating);
    }

    // Sắp xếp
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default: // "newest"
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [reviews, searchQuery, selectedRating, sortBy]);

  const displayedReviews = showAll ? filteredAndSortedReviews : filteredAndSortedReviews.slice(0, 6);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="text-blue-500" />
            Đánh giá từ học viên
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({reviews.length} đánh giá)
              </span>
            </div>
          )}
        </div>

        {reviews.length > 0 && (
          <>
            <div className="mt-6 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="w-20 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{rating}</span>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                      style={{
                        width: `${(ratingCounts[rating] || 0) / reviews.length * 100}%`
                      }}
                    />
                  </div>
                  <span className="w-20 text-sm text-gray-500 text-right">
                    {ratingCounts[rating] || 0} đánh giá
                  </span>
                </div>
              ))}
            </div>

            {/* Thanh tìm kiếm và bộ lọc */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đánh giá..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <SortDesc className="w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="highest">Đánh giá cao nhất</option>
                    <option value="lowest">Đánh giá thấp nhất</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-gray-400" />
                <FilterButton
                  active={selectedRating === 0}
                  onClick={() => setSelectedRating(0)}
                >
                  Tất cả
                </FilterButton>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <FilterButton
                    key={rating}
                    active={selectedRating === rating}
                    onClick={() => setSelectedRating(rating)}
                  >
                    {rating} sao ({ratingCounts[rating] || 0})
                  </FilterButton>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có đánh giá nào cho khóa học này.</p>
          </div>
        ) : filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy đánh giá phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        )}

        {filteredAndSortedReviews.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors"
            >
              {showAll ? (
                <>
                  Ẩn bớt
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Xem tất cả {filteredAndSortedReviews.length} đánh giá
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;