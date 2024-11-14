import { useEffect, useState } from 'react';
import axios from 'axios';
import WishlistList from '../../../components/instructor/Card/WishlistListCard';

const userId = 16;
const PageWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/student/wishlist/${userId}`)
      .then(response => {
        setWishlist(response.data);
      })
      .catch(error => {
        console.error("Error fetching wishlist data:", error);
      });
  }, []);

  const handleDeleteCourse = (courseId) => {
    setWishlist(prevWishlist => prevWishlist.filter(course => course.courseId !== courseId));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">My Wishlist</h1>
      <WishlistList wishlist={wishlist} onDelete={handleDeleteCourse} />
    </div>
  );
};

export default PageWishlist;
