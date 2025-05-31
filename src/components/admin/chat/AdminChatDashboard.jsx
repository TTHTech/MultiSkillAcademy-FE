// AdminChatDashboard.jsx
import React, { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function AdminChatDashboard() {
  const [stats, setStats] = useState({});
  const [messageStats, setMessageStats] = useState([]);
  const [largestGroups, setLargestGroups] = useState([]);
  const [emptyGroups, setEmptyGroups] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/api/admin/chat/system/statistics`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setStats);

    fetch(`${baseUrl}/api/admin/chat/system/message-stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setMessageStats);

    fetch(`${baseUrl}/api/admin/chat/system/largest-groups`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setLargestGroups);

    fetch(`${baseUrl}/api/admin/chat/system/empty-chats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setEmptyGroups);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Chat Thống Kê</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-lg font-bold">Tổng số chat</div>
          <div className="text-3xl">{stats.totalChats ?? "--"}</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-lg font-bold">Tổng số user</div>
          <div className="text-3xl">{stats.totalUsers ?? "--"}</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-lg font-bold">Tổng số tin nhắn</div>
          <div className="text-3xl">{stats.totalMessages ?? "--"}</div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <div className="text-lg font-bold">Nhóm chat rỗng</div>
          <div className="text-3xl">{emptyGroups.length}</div>
        </div>
      </div>
      <div className="mb-6">
        <div className="font-bold mb-2">Tin nhắn theo ngày (30 ngày):</div>
        <div className="overflow-x-auto">
          <table className="min-w-[500px] w-full text-left border">
            <thead>
              <tr>
                <th className="px-2 py-1 border-b">Ngày</th>
                <th className="px-2 py-1 border-b">Số tin nhắn</th>
              </tr>
            </thead>
            <tbody>
              {messageStats.map((stat, i) => (
                <tr key={i}>
                  <td className="px-2 py-1 border-b">{stat.date}</td>
                  <td className="px-2 py-1 border-b">{stat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="font-bold mb-2">Top nhóm chat lớn nhất:</div>
        <ul>
          {largestGroups.map((group, i) => (
            <li key={group.chatId} className="mb-1">
              <span className="font-medium">{group.groupName || group.chatId}</span> — <span>{group.participantCount} thành viên</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
