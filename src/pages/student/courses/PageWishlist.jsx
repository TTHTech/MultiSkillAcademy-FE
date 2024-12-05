import NavBar from "../../../components/student/common/NavBar";
import Wishlist from "../../../components/student/content/PageWishlist"
const PageWishlist = () => {
  return (
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <NavBar />
        <Wishlist/>
      </div>
  );
};

export default PageWishlist;
