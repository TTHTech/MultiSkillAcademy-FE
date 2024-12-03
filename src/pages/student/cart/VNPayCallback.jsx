import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Dùng useNavigate cho React Router v6

const VNPayCallback = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const responseCode = params.get("vnp_ResponseCode");
  const token = localStorage.getItem("token"); // Lấy token từ localStorage (hoặc context nếu có)

  useEffect(() => {
    // Kiểm tra xem responseCode có hợp lệ hay không
    if (responseCode === "00") {
      if (!token) {
        // Nếu không có token, chuyển hướng về trang đăng nhập
        alert("Bạn cần đăng nhập để xác nhận thanh toán.");
        navigate("/login");
        return;
      }

      // Gọi API xác nhận thanh toán
      const confirmPayment = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/student/payment/vn-pay-callback", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,  // Đảm bảo token hợp lệ nếu cần
            },
          });

          // Kiểm tra mã trạng thái trả về từ backend
          const data = await response.json();

          if (response.ok && data.code === "00") {
            // Thanh toán thành công
            navigate("/success"); // Chuyển hướng đến trang thành công
          } else {
            // Thanh toán thất bại
            alert(`Thanh toán thất bại: ${data.message || "Vui lòng thử lại."}`);
            navigate("/failure"); // Có thể chuyển hướng đến trang thất bại nếu cần
          }
        } catch (error) {
          // Xử lý lỗi khi gọi API
          alert("Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng thử lại.");
          navigate("/failure"); // Chuyển hướng đến trang thất bại
        }
      };

      confirmPayment(); // Gọi hàm xác nhận thanh toán
    } else {
      // Nếu mã phản hồi không hợp lệ
      alert("Thanh toán thất bại. Mã phản hồi không hợp lệ.");
      navigate("/failure"); // Chuyển hướng đến trang thất bại
    }
  }, [responseCode, navigate, token]);

  return null; // Component không có giao diện, chỉ dùng để redirect
};

export default VNPayCallback;
