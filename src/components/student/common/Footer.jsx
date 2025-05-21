import React from "react";
import { Globe, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { title: "Giới thiệu", href: "#" },
      { title: "Tải ứng dụng", href: "#" },
      { title: "Liên hệ với chúng tôi", href: "#" },
      { title: "Đối tác", href: "#" },
    ],
    resources: [
      { title: "Nghề nghiệp", href: "#" },
      { title: "Blog", href: "#" },
      { title: "Trợ giúp & Hỗ trợ", href: "#" },
      { title: "Đơn vị liên kết", href: "#" },
      { title: "Nhà đầu tư", href: "#" },
    ],
    legal: [
      { title: "Điều khoản sử dụng", href: "#" },
      { title: "Chính sách quyền riêng tư", href: "#" },
      { title: "Cài đặt cookie", href: "#" },
      { title: "Sơ đồ trang web", href: "#" },
      { title: "Tuyên bố về khả năng tiếp cận", href: "#" },
    ],
    social: [
      { icon: Facebook, href: "#", label: "Facebook" },
      { icon: Twitter, href: "#", label: "Twitter" },
      { icon: Instagram, href: "#", label: "Instagram" },
      { icon: Linkedin, href: "#", label: "LinkedIn" },
      { icon: Youtube, href: "#", label: "YouTube" },
    ]
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Công ty</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Tài nguyên</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Pháp lý</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Language and Social Links */}
          <div className="space-y-6">
            {/* Language Selector */}
            <div>
              <button className="w-full flex items-center justify-center space-x-2 bg-transparent hover:bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-4 py-2 transition-all duration-200">
                <Globe className="w-5 h-5" />
                <span>Tiếng Việt</span>
              </button>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Theo dõi chúng tôi</h3>
              <div className="flex space-x-4">
                {footerLinks.social.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/appgallery-30bf7.appspot.com/o/images%2FIronix-fotor-2024112911327.png?alt=media&token=47065fe1-64a1-449c-8cb1-4f91b96484ec"
              alt="Logo"
              className="h-8 w-auto filter brightness-0 invert"
            />
          </div>

          {/* Copyright Text */}
          <div className="text-gray-500 text-sm">
            © {currentYear} Ironix. Đã đăng ký bản quyền.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;