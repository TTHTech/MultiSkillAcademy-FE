import CreatePromotion from "../../components/admin/Promotion/createPromotion";
import Header from "../../components/admin/common/Header";

const PageCreatePromotion = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <div className="container mx-auto px-4">
        <Header title="Tạo Khuyến Mãi" />
        <CreatePromotion />
      </div>
    </div>
  );
};

export default PageCreatePromotion;
