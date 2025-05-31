// AdminChatMessageSearch.jsx
import React, { useState } from "react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function AdminChatMessageSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/api/admin/chat/system/messages/search?keyword=${encodeURIComponent(keyword)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setResults(await res.json());
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tìm kiếm tin nhắn toàn hệ thống</h2>
      <div className="flex mb-4 gap-2">
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          className="flex-1 border px-3 py-2 rounded-md"
          placeholder="Nhập từ khoá tìm kiếm..."
        />
        <button
          className="px-4 py-2 bg-emerald-500 text-white rounded-md"
          onClick={handleSearch}
          disabled={loading}
        >Tìm kiếm</button>
      </div>
      <div>
        {loading ? <div>Đang tìm kiếm...</div> :
          results.length === 0 ? <div>Không có kết quả</div> :
            <ul>
              {results.map(msg => (
                <li key={msg.messageId} className="border-b py-2">
                  <div><span className="font-medium">Nội dung:</span> {msg.content}</div>
                  <div><span className="font-medium">Người gửi:</span> {msg.senderName}</div>
                  <div><span className="font-medium">Chat ID:</span> {msg.chatId}</div>
                  <div><span className="font-medium">Thời gian:</span> {msg.createdAt}</div>
                </li>
              ))}
            </ul>
        }
      </div>
    </div>
  );
}
