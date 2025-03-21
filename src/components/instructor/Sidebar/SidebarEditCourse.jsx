import { useState } from "react";

const SidebarEditCourse = ({ onSelect }) => {
  const [selectedItem, setSelectedItem] = useState("CourseDetails");

  const menuItems = [
    { label: "Thông tin chi tiết khóa học", key: "CourseDetails" },
    { label: "Đối tượng mục tiêu", key: "TargetAudience" },
    { label: "Nội dung khóa học", key: "CourseContent" },
    { label: "Mô tả tài nguyên khóa học", key: "ResourceDescription" },
    { label: "Yêu cầu khóa học", key: "Requirements" },
  ];

  const publishItems = [
    { label: "Bài học miễn phí", key: "ManageFreeLectures" },
    { label: "Nội dung khóa học", key: "SectionsAndLectures" },
  ];
  const actionItems = [
    { label: "Chuyển đổi trạng thái", key: "ChangeStatus" },
  ];

  const handleSelect = (key) => {
    setSelectedItem(key);
    if (onSelect) {
      onSelect(key);
    }
  };

  return (
    <div className="w-80 bg-white p-6 shadow-md rounded-lg">
      <h3 className="font-bold text-lg mb-3">Thông tin khóa học</h3>
      {menuItems.map((item) => renderMenuItem(item))}

      <h3 className="font-bold text-lg mt-4 mb-3">Nội dung khóa học</h3>
      {publishItems.map((item) => renderMenuItem(item))}

      <h3 className="font-bold text-lg mt-4 mb-3">Trạng thái hoạt động</h3>
      {actionItems.map((item) => renderMenuItem(item))}


    </div>
  );

  function renderMenuItem(item) {
    return (
      <div
        key={item.key}
        onClick={() => handleSelect(item.key)}
        className={`flex items-center space-x-3 mb-2 cursor-pointer p-2 rounded-md 
        ${selectedItem === item.key ? "bg-gray-100" : ""}`}
      >
        <div className={`h-6 w-1 rounded-full ${selectedItem === item.key ? "bg-black" : ""}`} />
        <span>{item.label}</span>
      </div>
    );
  }
};

export default SidebarEditCourse;
