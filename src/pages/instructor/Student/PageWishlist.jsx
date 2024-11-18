import { useEffect, useState } from "react";
import axios from "axios";
import WishlistList from "../../../components/instructor/Card/WishlistListCard";
import NavBar from "../../../components/student/common/NavBar";

const userId = localStorage.getItem("userId");
const PageWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    setLoading(true); // Bắt đầu loading
    axios
      .get(`http://localhost:8080/api/student/wishlist/${userId}`)
      .then((response) => {
        setWishlist(response.data);
      })
      .catch((error) => {
        console.error("Error fetching wishlist data:", error);
      })
      .finally(() => {
        setLoading(false); // Kết thúc loading
      });
  }, []);

  const handleDeleteCourse = (courseId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((course) => course.courseId !== courseId)
    );
  };

  return (
    <>
      <NavBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          My Wishlist
        </h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
          </div>
        ) : wishlist.length > 0 ? (
          <WishlistList wishlist={wishlist} onDelete={handleDeleteCourse} />
        ) : (
          <p className="text-center text-xl text-gray-600">
            Không có khóa học trong wishlist
          </p>
        )}
      </div>
    </>
  );
};

export default PageWishlist;
