import { useState } from "react";

const ITEMS_PER_PAGE = 9;

const PromotionUsageSummaryList = ({ usages, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(true);
  const [pageUsed, setPageUsed] = useState(1);
  const [pageUnused, setPageUnused] = useState(1);

  const toDate = arr => new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
  const formatCurrency = amount =>
    amount != null ? `${new Intl.NumberFormat('vi-VN').format(amount)} VND` : '-';

  // Filter by search
  const filtered = usages.filter(p =>
    p.promotionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Partition by active / inactive
  const now = new Date();
  const activeItems = filtered.filter(p => {
    const start = toDate(p.startDate);
    const end = toDate(p.endDate);
    return start <= now && end >= now;
  });
  const inactiveItems = filtered.filter(p => !activeItems.includes(p));

  // Within each, split used vs unused
  const splitGroups = items => ({
    used: items.filter(p => p.usageCount > 0),
    unused: items.filter(p => p.usageCount === 0)
  });

  const activeGroups = splitGroups(activeItems);
  const inactiveGroups = splitGroups(inactiveItems);

  // Choose groups based on tab
  const groups = activeTab ? activeGroups : inactiveGroups;

  const genPages = length => {
    const total = Math.ceil(length / ITEMS_PER_PAGE);
    if (total <= 1) return [];
    return Array.from({ length: total }, (_, i) => i + 1);
  };

  const Section = ({ title, items, currentPage, setPage }) => {
    const totalPages = genPages(items.length);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageData = items.slice(start, start + ITEMS_PER_PAGE);

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">{title} ({items.length})</h3>
        {pageData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageData.map(p => (
                <PromotionCard key={p.promotionId} promotion={p} onSelect={onSelect} formatCurrency={formatCurrency} toDate={toDate} />
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {totalPages.map(pg => (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`px-3 py-1 rounded ${
                    pg === currentPage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-400">Không có mục nào.</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg text-white">
      {/* Filter + Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Tìm promotion..."
          className="flex-1 p-2 rounded bg-gray-700 text-white mb-3 md:mb-0 md:mr-4 focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setPageUsed(1); setPageUnused(1); }}
        />
        <div className="flex">
          {['Đang hoạt động', 'Không hoạt động'].map((label, idx) => (
            <button
              key={label}
              onClick={() => { setActiveTab(idx === 0); setPageUsed(1); setPageUnused(1); }}
              className={`px-4 py-2 ${
                activeTab === (idx === 0)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              } ${idx === 0 ? 'rounded-l' : 'rounded-r'} transition`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <Section title="Đã sử dụng" items={groups.used} currentPage={pageUsed} setPage={setPageUsed} />
      <Section title="Chưa sử dụng" items={groups.unused} currentPage={pageUnused} setPage={setPageUnused} />
    </div>
  );
};

const PromotionCard = ({ promotion, onSelect, formatCurrency, toDate }) => {
  const now = new Date();
  const isActive = toDate(promotion.startDate) <= now && toDate(promotion.endDate) >= now;
  return (
    <div
      onClick={() => onSelect(promotion)}
      className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold">{promotion.promotionName}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}> {isActive ? 'Đang hoạt động' : 'Không hoạt động'} </span>
      </div>
      <p className="text-sm text-gray-300">Giảm: {promotion.percentage}%</p>
      <p className="text-sm text-gray-300">Max: {formatCurrency(promotion.maxPromotion)}</p>
      <p className="text-sm text-gray-300">Lượt dùng: {promotion.usageCount} | Tổng giảm: {formatCurrency(promotion.totalDiscountAmount)}</p>
    </div>
  );
};

export default PromotionUsageSummaryList;
