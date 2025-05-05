import PromotionUsage  from "../../components/admin/Promotion/PromotionUsageDashboard";
import Header from "../../components/admin/common/Header";

const PagePromotionUsage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Promotions Usage" />
        <PromotionUsage />
      </div>
    </div>
  );
};

export default PagePromotionUsage;