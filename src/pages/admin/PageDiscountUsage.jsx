import DiscountUsageList from "../../components/admin/discounts/discountUsageList";
import Header from "../../components/admin/common/Header";

const PageDiscountUsage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Discount Usage" />
        <DiscountUsageList />
      </div>
    </div>
  );
};

export default PageDiscountUsage;