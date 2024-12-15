# ✨ Admin Dashboard - ReactJS ✨

## 📆 **Tổng Quan Dự Án**
**Tên dự án**: Admin Dashboard  
**Công nghệ sử dụng**: ReactJS, Framer Motion, Tailwind CSS  
**Chức năng chính**:  
- 🔍 Quản lý người dùng  
- 🏢 Quản lý khóa học  
- 📋 Các chức năng quản trị khác  

---

## 🚀 **Hướng Dẫn Cài Đặt**

### ✅ **Yêu Cầu Môi Trường**
- **Node.js**: Phiên bản mới nhất hoặc từ `14.x` trở lên.  
- **npm** hoặc **yarn**: Công cụ quản lý các thư viện.  

---

### 🔧 **Bước 1: Sao Chép Dự Án**
Clone dự án từ repository:

```bash
git clone https://github.com/TTHTech/ADMINDASHBOARD.git
cd AdminDashboard
```

---

### ♻️ **Bước 2: Cài Đặt Các Phụ Thuộc**
Sử dụng lệnh dưới đây để cài đặt tất cả thư viện phụ thuộc:

```bash
npm install
```

---

### 🌄 **Bước 3: Chạy Dự Án Trong Chế Độ Phát Triển**
Khởi chạy dự án bằng lệnh:

```bash
npm run dev
```

Truy cập địa chỉ:  

```bash
http://localhost:5173
```

---

# 📘 **Các Thư Viện và Phiên Bản Sử Dụng**

## ✔️ Thư viện Cơ bản
- **React và React DOM**: Dùng để xây dựng giao diện người dùng.
    ```bash
    npm install react@18.3.1
    npm install react-dom@18.3.1
    ```

- **Axios**: Hỗ trợ gửi và nhận dữ liệu qua API.
    ```bash
    npm install axios@^1.7.7
    ```

- **React Router DOM**: Cung cấp điều hướng giữa các trang.
    ```bash
    npm install react-router-dom@^6.25.1
    ```

---

## 🔬 Thư viện Hiệu Ứng và Giao Diện
- **Framer Motion**: Tạo hiệu ứng động cho giao diện.
    ```bash
    npm install framer-motion@^11.11.8
    ```

- **Tailwind CSS**: Công cụ hỗ trợ thiết kế giao diện nhanh chóng.
    ```bash
    npm install tailwindcss@^3.4.7
    ```

- **Line Clamp**: Giới hạn dòng hiển thị trong văn bản.
    ```bash
    npm install @tailwindcss/line-clamp@^0.4.4
    ```

- **Heroicons**: Bộ icon dễ sử dụng.
    ```bash
    npm install @heroicons/react@^2.1.5
    ```

- **Font Awesome**: Bộ icon phổ biến cho ứng dụng web.
    ```bash
    npm install @fortawesome/fontawesome-free@^6.6.0
    ```

---

## 🔼 Thư viện Biểu Đồ và Báo Cáo
- **React ApexCharts**: Thư viện biểu đồ tích hợp cho React.
    ```bash
    npm install react-apexcharts@^1.5.0
    ```

- **ApexCharts**: Công cụ tạo biểu đồ mạnh mẽ.
    ```bash
    npm install apexcharts@^3.53.0
    ```

- **Recharts**: Thư viện biểu đồ đơn giản và đẹp mắt.
    ```bash
    npm install recharts@^2.12.7
    ```

- **JsPDF**: Hỗ trợ xuất file PDF.
    ```bash
    npm install jspdf@^2.5.2
    ```

- **JsPDF AutoTable**: Tạo bảng trong file PDF.
    ```bash
    npm install jspdf-autotable@^3.8.4
    ```

---

## ♻️ Thư viện Tiện Ích
- **Lodash**: Cung cấp các tiện ích thao tác dữ liệu.
    ```bash
    npm install lodash@^4.17.21
    ```

- **Moment.js**: Xử lý và định dạng ngày giờ.
    ```bash
    npm install moment@^2.30.1
    ```

- **JWT Decode**: Giải mã JSON Web Token (JWT).
    ```bash
    npm install jwt-decode@^4.0.0
    ```

- **React Toastify**: Hiển thị thông báo dạng toast.
    ```bash
    npm install react-toastify@^10.0.6
    ```

- **SweetAlert2**: Thông báo popup đẹp mắt.
    ```bash
    npm install sweetalert2@^11.14.5
    ```

---

## 🌐 Thư viện Xử Lý Đa Phương Tiện
- **React Player**: Hỗ trợ phát video và âm thanh.
    ```bash
    npm install react-player@^2.16.0
    ```

- **React Slick**: Tạo carousel (slider).
    ```bash
    npm install react-slick@^0.30.2
    ```

- **Slick Carousel**: Hỗ trợ React Slick.
    ```bash
    npm install slick-carousel@^1.8.1
    ```

- **Swiper**: Tạo slider và carousel.
    ```bash
    npm install swiper@^11.1.15
    ```

- **Fireworks JS**: Hiệu ứng pháo hoa.
    ```bash
    npm install fireworks-js@^2.10.8
    ```

---

## 🛠️ Công Cụ Dành Cho Nhà Phát Triển
- **Vite Plugin React**: Hỗ trợ React trong Vite.
    ```bash
    npm install @vitejs/plugin-react@^4.3.1
    ```

- **Vite**: Công cụ xây dựng và chạy dự án.
    ```bash
    npm install vite@^5.3.4
    ```

- **ESLint**: Công cụ kiểm tra code JavaScript.
    ```bash
    npm install eslint@^8.57.0
    ```

- **ESLint Plugin React**: Quy tắc ESLint dành cho React.
    ```bash
    npm install eslint-plugin-react@^7.34.3
    ```

- **ESLint Plugin React Hooks**: Kiểm tra hooks trong React.
    ```bash
    npm install eslint-plugin-react-hooks@^4.6.2
    ```

---

🚨 **Lưu Ý**:  
- Đảm bảo cài đặt đúng phiên bản Node.js.  
- Nếu gặp lỗi, kiểm tra lại phiên bản của các thư viện và môi trường.
