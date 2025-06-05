import BrowseDiscounts from "../../components/admin/discounts/DiscountInstructor/BrowseDiscounts";
import Header from "../../components/admin/common/Header";

const PageBrowseDiscount = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Duyệt mã giảm giá" />
        <BrowseDiscounts />
      </div>
    </div>
  );
};

export default PageBrowseDiscount;
