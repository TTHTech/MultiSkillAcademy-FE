import CreateDiscount from "../../components/admin/discounts/createDiscount";
import Header from "../../components/admin/common/Header";

const PageCreateDiscounts = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Tạo Mã Giảm Giá" />
        <CreateDiscount />
      </div>
    </div>
  );
};

export default PageCreateDiscounts;
