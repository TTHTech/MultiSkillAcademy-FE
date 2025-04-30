import { useState } from "react";

const ITEMS_PER_PAGE = 9;

const PromotionUsageSummaryList = ({ usages, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageWith, setPageWith] = useState(1);
  const [pageWithout, setPageWithout] = useState(1);

  // convert startDate/endDate array → Date
  const toDate = arr =>
    new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);

  // lọc theo tên và trạng thái
  const filtered = usages.filter(p => {
    const nameMatch = p.promotionName
      .toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const active = toDate(p.startDate) <= now && toDate(p.endDate) >= now;
    let statusMatch = true;
    if (statusFilter === "active") statusMatch = active;
    if (statusFilter === "expired") statusMatch = !active;
    return nameMatch && statusMatch;
  });

  const withData = filtered.filter(p => p.usageCount > 0);
  const without = filtered.filter(p => p.usageCount === 0);

  const totalWith = Math.ceil(withData.length/ITEMS_PER_PAGE);
  const totalWithout = Math.ceil(without.length/ITEMS_PER_PAGE);

  const currWith = withData.slice(
    (pageWith-1)*ITEMS_PER_PAGE,
    pageWith*ITEMS_PER_PAGE
  );
  const currWithout = without.slice(
    (pageWithout-1)*ITEMS_PER_PAGE,
    pageWithout*ITEMS_PER_PAGE
  );

  const genPages = (cur, tot) => {
    if (tot<=1) return [];
    const pages = [1];
    if (cur>2) pages.push(cur-1);
    if (cur!==1 && cur!==tot) pages.push(cur);
    if (cur<tot-1) pages.push(cur+1);
    if (tot>1) pages.push(tot);
    return [...new Set(pages)].sort((a,b)=>a-b);
  };

  return (
    <div className="mb-6">
      {/* Filter */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên promotion..."
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setPageWith(1);
            setPageWithout(1);
          }}
        />
        <select
          className="p-2 rounded bg-gray-700 text-white"
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setPageWith(1);
            setPageWithout(1);
          }}
        >
          <option value="all">Tất cả</option>
          <option value="active">Còn hạn</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>

      {/* Với data */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3">Promotions đã dùng</h3>
        {withData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currWith.map(p => (
                <div
                  key={p.promotionId}
                  className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition"
                  onClick={() => onSelect(p)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{p.promotionName}</h4>
                    {toDate(p.startDate) <= new Date() &&
                    toDate(p.endDate) >= new Date() ? (
                      <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                        Còn hạn
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                        Hết hạn
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300">Giảm: {p.percentage}%</p>
                  <p className="text-sm text-gray-300">
                    Max: {p.maxPromotion ?? "-"}
                  </p>
                  <p className="text-sm text-gray-300">
                    Lượt dùng: {p.usageCount} | Tổng giảm: {p.totalDiscountAmount}
                  </p>
                  <p className={`mt-1 font-medium ${
                    p.status==="ACTIVE"? "text-green-400"
                    : p.status==="INACTIVE"? "text-red-400"
                    : "text-yellow-400"
                  }`}>
                    {p.status}
                  </p>
                </div>
              ))}
            </div>

            {/* pagination */}
            <div className="mt-4 flex justify-center space-x-2">
              {genPages(pageWith, totalWith).map(pg => (
                <button
                  key={pg}
                  onClick={() => setPageWith(pg)}
                  className={`px-3 py-1 rounded ${
                    pg===pageWith
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-400">Không có promotion đã dùng.</p>
        )}
      </div>

      {/* Không data */}
      {without.length>0 && (
        <div>
          <h3 className="text-xl font-bold mb-3">Promotions chưa dùng</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currWithout.map(p => (
              <div
                key={p.promotionId}
                className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                onClick={() => onSelect(p)}
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">{p.promotionName}</h4>
                  {toDate(p.startDate) <= new Date() &&
                  toDate(p.endDate) >= new Date() ? (
                    <span className="bg-green-500 text-white px-2 py-1 text-xs rounded-full">
                      Còn hạn
                    </span>
                  ) : (
                    <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                      Hết hạn
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300">Giảm: {p.percentage}%</p>
                <p className="text-sm text-gray-300">
                  Lượt dùng: {p.usageCount}
                </p>
              </div>
            ))}
          </div>
          {/* pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            {genPages(pageWithout, totalWithout).map(pg => (
              <button
                key={pg}
                onClick={() => setPageWithout(pg)}
                className={`px-3 py-1 rounded ${
                  pg===pageWithout
                    ? "bg-blue-500 text-white"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-500"
                }`}
              >
                {pg}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionUsageSummaryList;
