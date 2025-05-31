// AdminGroupManagement.jsx
import React, { useEffect, useState } from "react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

export default function AdminGroupManagement() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/api/admin/chat/system/largest-groups`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json()).then(setGroups);
  }, []);

  const selectGroup = async (chatId) => {
    setSelectedGroup(chatId);
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/api/admin/chat/${chatId}`, { headers: { Authorization: `Bearer ${token}` } });
    const chat = await res.json();
    setParticipants(chat.participants || []);
  };

  const handleMute = async (userId, muted) => {
    const token = localStorage.getItem("token");
    await fetch(`${baseUrl}/api/admin/chat/system/${selectedGroup}/participants/${userId}/mute?muted=${muted}`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}` }
    });
    selectGroup(selectedGroup); // reload
  };

  const handleRemove = async (userId) => {
    const token = localStorage.getItem("token");
    await fetch(`${baseUrl}/api/admin/chat/system/${selectedGroup}/participants/${userId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    });
    selectGroup(selectedGroup); // reload
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý nhóm chat</h2>
      <div className="flex gap-6">
        <div className="w-1/3">
          <div className="font-semibold mb-2">Chọn nhóm:</div>
          <ul>
            {groups.map(gr => (
              <li key={gr.chatId}>
                <button className={`block px-2 py-1 rounded hover:bg-emerald-50 ${selectedGroup === gr.chatId ? "bg-emerald-100 font-bold" : ""}`}
                  onClick={() => selectGroup(gr.chatId)}>
                  {gr.groupName || gr.chatId} ({gr.participantCount} thành viên)
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          {selectedGroup && (
            <>
              <div className="font-semibold mb-2">Thành viên nhóm:</div>
              <table className="min-w-full text-left border">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border-b">Tên</th>
                    <th className="px-2 py-1 border-b">Role</th>
                    <th className="px-2 py-1 border-b">Mute</th>
                    <th className="px-2 py-1 border-b">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.userId}>
                      <td className="px-2 py-1 border-b">{p.firstName} {p.lastName}</td>
                      <td className="px-2 py-1 border-b">{p.role}</td>
                      <td className="px-2 py-1 border-b">
                        <button
                          className={`px-2 py-1 rounded ${p.muted ? "bg-gray-300" : "bg-yellow-200"}`}
                          onClick={() => handleMute(p.userId, !p.muted)}
                        >
                          {p.muted ? "Bỏ mute" : "Mute"}
                        </button>
                      </td>
                      <td className="px-2 py-1 border-b">
                        <button
                          className="px-2 py-1 bg-red-200 rounded"
                          onClick={() => handleRemove(p.userId)}
                        >Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
