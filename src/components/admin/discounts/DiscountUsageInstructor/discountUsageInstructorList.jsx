import { useEffect, useState, useRef } from "react";
import axios from "axios";
import DiscountUsageSummaryList from "./DiscountUsageInstructorSummaryList";
import DiscountUsageDetail from "./DiscountUsageInstructorDetail";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const DiscountUsageDashboard = () => {
  const [discountUsages, setDiscountUsages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const detailRef = useRef(null);
  useEffect(() => {
    if (selectedDiscount && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedDiscount]);
  
  useEffect(() => {
    const fetchDiscountUsage = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/admin/discount-usage/instructor`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDiscountUsages(response.data);
      } catch (err) {
        setError("Không thể tải danh sách Discount Usage.");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscountUsage();
  }, [token]);

  if (loading) return <p className="text-white p-4">Đang tải dữ liệu...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-4 text-white">
      <h2 className="text-2xl font-bold mb-6">Discount Instructor Usage Dashboard</h2>
      <DiscountUsageSummaryList
        discountUsages={discountUsages}
        onSelect={setSelectedDiscount}
      />
      {selectedDiscount && (
        <div ref={detailRef}>
          <DiscountUsageDetail
            discount={selectedDiscount}
            onClose={() => setSelectedDiscount(null)}
          />
        </div>
      )}
    </div>
  );
};

export default DiscountUsageDashboard;
