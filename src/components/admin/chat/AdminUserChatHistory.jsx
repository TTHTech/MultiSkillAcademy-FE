// AdminUserChatHistory.jsx
import React, { useState } from "react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function AdminUserChatHistory() {
  const [userId, setUserId] = useState("");
  const [userId2, setUserId2] = useState("");
  const [chatList, setChatList] = useState([]);
  const [singleChat, setSingleChat] = useState(null);

  const fetchUserChats = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/api/admin/chat/system/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setChatList(await res.json());
  };

  const fetchBetweenChats = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/api/admin/chat/system/between/${userId}/${userId2}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSingleChat(await res.json());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lịch sử chat theo user</h2>
      <div className="mb-4">
        <input className="border px-2 py-1 rounded mr-2" placeholder="Nhập userId"
          value={userId} onChange={e => setUserId(e.target.value)} />
        <button className="px-3 py-1 bg-emerald-500 text-white rounded" onClick={fetchUserChats}>Xem chat của user</button>
      </div>
      {chatList.length > 0 && (
        <div>
          <div className="font-bold mb-2">Tất cả chat:</div>
          <ul>
            {chatList.map(c => (
              <li key={c.chatId}>Chat ID: {c.chatId} — Participants: {c.participants?.length}</li>
            ))}
          </ul>
        </div>
      )}
      <hr className="my-6"/>
      <div className="mb-4">
        <input className="border px-2 py-1 rounded mr-2" placeholder="UserId 1"
          value={userId} onChange={e => setUserId(e.target.value)} />
        <input className="border px-2 py-1 rounded mr-2" placeholder="UserId 2"
          value={userId2} onChange={e => setUserId2(e.target.value)} />
        <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={fetchBetweenChats}>Xem chat giữa 2 user</button>
      </div>
      {singleChat && (
        <div>
          <div className="font-bold mb-2">Chat giữa hai user:</div>
          <div>Chat ID: {singleChat.chatId}</div>
          <div>Participants: {singleChat.participants?.length}</div>
          <div>Tin nhắn: {singleChat.messages?.length}</div>
        </div>
      )}
    </div>
  );
}
