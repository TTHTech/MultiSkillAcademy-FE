// src/components/home/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between flex-wrap gap-6 mb-6">
          
          {/* Cột 1 */}
          <div>
            <ul className="space-y-2">
          
              <li>Tải ứng dụng</li>
              <li>Giới thiệu</li>
              <li>Hãy liên hệ với chúng tôi</li>
            </ul>
          </div>
          
          {/* Cột 2 */}
          <div>
            <ul className="space-y-2">
              <li>Nghề nghiệp</li>
              <li>Blog</li>
              <li>Trợ giúp và Hỗ trợ</li>
              <li>Đơn vị liên kết</li>
              <li>Nhà đầu tư</li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div>
            <ul className="space-y-2">
              <li>Điều khoản</li>
              <li>Chính sách về quyền riêng tư</li>
              <li>Cài đặt cookie</li>
              <li>Sơ đồ trang web</li>
              <li>Tuyên bố về khả năng tiếp cận</li>
            </ul>
          </div>

          {/* Nút ngôn ngữ */}
          <div className="flex items-center">
            <button className="flex items-center border border-gray-400 px-4 py-2 rounded text-gray-300">
              <i className="fas fa-globe mr-2"></i> Tiếng Việt
            </button>
          </div>
        </div>
        
        {/* Logo và bản quyền */}
        <div className="flex justify-between items-center mt-4">
          <img src="https://frontends.udemycdn.com/frontends-logged-in-homepages/staticx/udemy/images/v7/logo-udemy.svg" alt="Udemy Logo" className="h-6" />
          <span className="text-gray-500 text-sm"></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
