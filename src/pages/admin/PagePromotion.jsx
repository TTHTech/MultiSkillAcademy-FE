import PromotionTable  from "../../components/admin/Promotion/promotionsTable";
import Header from "../../components/admin/common/Header";

const PageCreatePromotion = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Danh Sách Khuyến Mãi " />
        <PromotionTable />
      </div>
    </div>
  );
};

export default PageCreatePromotion;
