import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PromotionUsageSummaryList from "./PromotionUsageSummaryList";
import PromotionUsageDetail from "./PromotionUsageDetail";

const PromotionUsageDashboard = () => {
  const [usages, setUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [selectedPromo, setSelectedPromo] = useState(null);
  const detailRef = useRef(null);

  // Khi chọn promo, scroll xuống detail
  useEffect(() => {
    if (selectedPromo && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedPromo]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/admin/promotion-usage",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsages(res.data);
      } catch {
        setError("Không thể tải dữ liệu Promotion Usage.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  if (loading)
    return <p className="text-white p-4">Đang tải dữ liệu...</p>;
  if (error)
    return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-gray-800 mt-4 text-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Promotion Usage Dashboard</h2>
      <PromotionUsageSummaryList
        usages={usages}
        onSelect={setSelectedPromo}
      />
      {selectedPromo && (
        <div ref={detailRef}>
          <PromotionUsageDetail
            promotion={selectedPromo}
            onClose={() => setSelectedPromo(null)}
          />
        </div>
      )}
    </div>
  );
};

export default PromotionUsageDashboard;
