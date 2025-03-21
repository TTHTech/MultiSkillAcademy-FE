import Swal from "sweetalert2";

const TableReview = ({ reviews, onDeleteReview, triggerRefresh }) => {
  const handleDelete = async (review) => {
    const token = localStorage.getItem("token");
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Bạn có chắc chắn muốn xóa bình luận của ${review.username} với nội dung "${review.comment}" hay không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/admin/reviews/${review.reviewId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error deleting review");
        }
        onDeleteReview(review.reviewId);
        Swal.fire({
          title: "Deleted!",
          text: "Bình luận đã được xóa thành công.",
          icon: "success",
        });
        triggerRefresh();
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          title: "Error!",
          text: "Có lỗi xảy ra khi xóa bình luận.",
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        text: "Bình luận không được xóa.",
        icon: "info",
      });
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="px-4 py-2 border border-gray-700">Username</th>
            <th className="px-4 py-2 border border-gray-700">Comment</th>
            <th className="px-4 py-2 border border-gray-700">Course Title</th>
            <th className="px-4 py-2 border border-gray-700">Rating</th>
            <th className="px-4 py-2 border border-gray-700">Created At</th>
            <th className="px-4 py-2 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr
              key={`${review.id || review.username}-${index}`}
              className="bg-gray-800 text-white hover:bg-gray-600"
            >
              <td className="px-4 py-2 border border-gray-700">
                {review.username}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {review.comment}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {review.courseTitle}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {review.rating}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-2 border border-gray-700">
                <button
                  onClick={() => handleDelete(review)}
                  className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableReview;
