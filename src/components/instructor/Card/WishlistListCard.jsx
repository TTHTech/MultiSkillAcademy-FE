import WishlistCard from './WishlistCard';

const WishlistList = ({ wishlist, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {wishlist.map((course, index) => (
        <WishlistCard key={index} course={course} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default WishlistList;
