import { useEffect, useState } from "react";
import axios from "axios";
import EditPromotion from "./updatePromotion";

const PromotionsTable = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editingPromotionId, setEditingPromotionId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const triggerRefresh = () => setRefresh(prev => !prev);
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const getPaginationItems = () => {
    const totalPages = Math.ceil(filteredPromotions.length / pageSize);
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/admin/promotion",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPromotions(res.data);
      } catch {
        setError("Không thể tải danh sách Promotions.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, [token, refresh]);

  const filteredPromotions = promotions.filter(promo => {
    const nameMatch = promo.name.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = searchStatus ? promo.status === searchStatus : true;
    return nameMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredPromotions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPromotions = filteredPromotions.slice(startIndex, startIndex + pageSize);

  return (
    <div className="overflow-x-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-4">
      {editingPromotionId ? (
        <EditPromotion
          promotionId={editingPromotionId}
          onCancel={() => setEditingPromotionId(null)}
          triggerRefresh={triggerRefresh}
        />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4 text-white">
            Danh sách Promotions
          </h2>
          <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-6 px-4">
            <input
              type="text"
              placeholder="Tìm theo tên promotion..."
              value={searchName}
              onChange={e => { setSearchName(e.target.value); setCurrentPage(1); }}
              className="w-full sm:max-w-md px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={searchStatus}
              onChange={e => { setSearchStatus(e.target.value); setCurrentPage(1); }}
              className="w-full sm:max-w-xs px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>

          {loading ? (
            <p className="text-white">Đang tải dữ liệu...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <table className="w-full text-white border-collapse">
                <thead>
                  <tr className="bg-gray-700 border-b border-gray-600">
                    <th className="py-3 px-4 border-r border-gray-600">STT</th>
                    <th className="py-3 px-4 border-r border-gray-600">Tên</th>
                    <th className="py-3 px-4 border-r border-gray-600">%	Giảm</th>
                    <th className="py-3 px-4 border-r border-gray-600">Max Giảm</th>
                    <th className="py-3 px-4 border-r border-gray-600">Ngày bắt đầu</th>
                    <th className="py-3 px-4 border-r border-gray-600">Ngày kết thúc</th>
                    <th className="py-3 px-4 border-r border-gray-600">Trạng thái</th>
                    <th className="py-3 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPromotions.map((promo, idx) => {
                    const sn = startIndex + idx + 1;
                    return (
                      <tr key={promo.promotionId} className="hover:bg-gray-700 transition-colors duration-200">
                        <td className="py-3 px-4 border-r border-gray-600 text-center">{sn}</td>
                        <td className="py-3 px-4 border-r border-gray-600">{promo.name}</td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">{promo.percentage}%</td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">{promo.maxPromotion || '-'}</td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">{new Date(...promo.startDate).toLocaleString('vi-VN')}</td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">{new Date(...promo.endDate).toLocaleString('vi-VN')}</td>
                        <td className="py-3 px-4 border-r border-gray-600 text-center">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${promo.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}>{promo.status}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setEditingPromotionId(promo.promotionId)}
                            className="bg-yellow-500 text-white px-4 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors"
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-4 flex justify-center items-center space-x-2 text-white">
                {getPaginationItems().map((item, i) => (
                  <button
                    key={i}
                    onClick={() => typeof item === 'number' && setCurrentPage(item)}
                    className={`px-3 py-1 rounded ${item === currentPage ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                    disabled={item === '...'}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PromotionsTable;