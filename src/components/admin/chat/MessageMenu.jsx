// import React from 'react';
// import { Copy, Reply, Trash2 } from 'lucide-react';

// const MessageMenu = ({ 
//   showMessageMenu, 
//   messageId, 
//   message, 
//   menuPosition, 
//   onClose, 
//   onCopyMessage, 
//   onDeleteMessage 
// }) => {
//   if (showMessageMenu !== messageId) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div 
//         className="fixed inset-0 z-40" 
//         onClick={onClose} 
//       />

//       {/* Menu - Sử dụng absolute thay vì fixed */}
//       <div
//         className="absolute bg-white shadow-lg rounded-lg py-2 z-50 border min-w-[160px]"
//         style={{
//           // Đảm bảo menu không vượt ra ngoài viewport
//           top: `${Math.min(menuPosition.top, window.innerHeight - 200)}px`,
//           left: `${Math.max(10, Math.min(menuPosition.left, window.innerWidth - 180))}px`,
//         }}
//       >
//         <button
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left text-sm"
//           onClick={() => onCopyMessage(message)}
//         >
//           <Copy className="w-4 h-4 mr-3" />
//           Sao chép tin nhắn
//         </button>

//         <button
//           className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left text-sm"
//           onClick={() => {/* TODO: Implement reply */}}
//         >
//           <Reply className="w-4 h-4 mr-3" />
//           Trả lời
//         </button>

//         <div className="border-t my-1"></div>

//         <button
//           className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left text-sm"
//           onClick={() => onDeleteMessage(messageId)}
//         >
//           <Trash2 className="w-4 h-4 mr-3" />
//           Xóa tin nhắn
//         </button>
//       </div>
//     </>
//   );
// };

// export default MessageMenu;