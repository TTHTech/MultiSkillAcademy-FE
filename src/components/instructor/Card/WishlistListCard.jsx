import WishlistCard from './WishlistCard';

const WishlistList = ({ wishlist, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
  {wishlist.length > 0 ? (
    wishlist.map((course, index) => (
      <WishlistCard key={index} course={course} onDelete={onDelete} />
    ))
  ) : (
    <div className="col-span-full text-center text-gray-600 text-lg font-semibold">
      Danh sách yêu thích của bạn đang trống!
    </div>
  )}
</div>

  );
};

export default WishlistList;
