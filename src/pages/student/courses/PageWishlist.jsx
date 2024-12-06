import NavBar from "../../../components/student/common/NavBar";
import Wishlist from "../../../components/student/content/PageWishlist"
import Footer from "../../../components/student/common/Footer";
const PageWishlist = () => {
  return (
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <NavBar />
        <Wishlist/>
        <Footer />
      </div>
  );
};

export default PageWishlist;