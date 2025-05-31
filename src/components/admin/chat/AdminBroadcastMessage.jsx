// AdminBroadcastMessage.jsx
import React, { useState } from "react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function AdminBroadcastMessage() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const sendBroadcast = async () => {
    setSending(true);
    setStatus("");
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/api/admin/chat/system/broadcast`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message })
    });
    setSending(false);
    if (res.ok) {
      setStatus("Đã gửi broadcast thành công!");
      setMessage("");
    } else {
      setStatus("Gửi thất bại.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gửi thông báo toàn hệ thống</h2>
      <textarea
        className="w-full border px-3 py-2 rounded mb-2"
        value={message}
        rows={4}
        placeholder="Nhập nội dung thông báo..."
        onChange={e => setMessage(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-emerald-500 text-white rounded"
        disabled={!message.trim() || sending}
        onClick={sendBroadcast}
      >Gửi Broadcast</button>
      {status && <div className="mt-2">{status}</div>}
    </div>
  );
}
