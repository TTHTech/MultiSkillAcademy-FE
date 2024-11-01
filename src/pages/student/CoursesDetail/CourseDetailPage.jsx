// src/pages/CourseDetailPage.jsx
import React from 'react';
import NavBar from "../../../components/student/common/NavBar";
import Footer from "../../../components/student/common/Footer";
import CourseHeader from "../../../components/student/CoursesDetail/CourseHeader";
import CourseMedia from "../../../components/student/CoursesDetail/CourseMedia";
import CourseContent from "../../../components/student/CoursesDetail/CourseContent";
import CourseContentDetails from "../../../components/student/CoursesDetail/CourseContentDetails";
import CourseRequirements from "../../../components/student/CoursesDetail/CourseRequirements";
import CourseReviews from "../../../components/student/CoursesDetail/CourseReviews";
import CourseInstructor from "../../../components/student/CoursesDetail/CourseInstructor";

const CourseDetailPage = () => {
  const courseData = {
    title: "C++ Cơ bản dành cho người mới học lập trình",
    description: "Bắt đầu học lập trình bằng ngôn ngữ C++",
    instructor: "Le Tran Dat",
    rating: 4.2,
    studentCount: 1549,
    lastUpdated: "03/2017",
    price: "1.299.000",
    thumbnail: "https://th.bing.com/th/id/OIP.R3QTrncUS-nFrjb8e0lk2QHaEK?rs=1&pid=ImgDetMain",
    content: [
      {
        title: "Giới thiệu khóa học",
        lectures: [
          { title: "Giới thiệu khóa học C++", duration: "04:48" },
          { title: "Cài đặt công cụ lập trình", duration: "08:32" },
        ],
        duration: "17 phút",
      },
      {
        title: "Biến và kiểu dữ liệu trong C++",
        lectures: [
          { title: "Giới thiệu về biến", duration: "04:10" },
          { title: "Kiểu dữ liệu cơ bản", duration: "06:49" },
          { title: "Kiểu dữ liệu phức hợp", duration: "07:03" },
          { title: "Toán tử trong C++", duration: "08:32" },
        ],
        duration: "1 giờ 20 phút",
      },
      {
        title: "Cấu trúc điều khiển",
        lectures: [
          { title: "Cấu trúc rẽ nhánh", duration: "05:17" },
          { title: "Vòng lặp for", duration: "07:49" },
          { title: "Vòng lặp while và do-while", duration: "06:50" },
        ],
        duration: "2 giờ",
      },
      {
        title: "Hàm và thư viện trong C++",
        lectures: [
          { title: "Giới thiệu về hàm", duration: "08:20" },
          { title: "Tham số và trả về", duration: "09:15" },
          { title: "Sử dụng thư viện chuẩn", duration: "05:50" },
        ],
        duration: "1 giờ 30 phút",
      },
    ],
    requirements: [
      "Cần có một máy tính chạy Windows hoặc Mac hoặc Linux",
      "Kiến thức cơ bản về toán học",
      "Tư duy logic và giải quyết vấn đề",
      "Kiến thức cơ bản về bất kỳ ngôn ngữ lập trình nào (không bắt buộc)",
      "Khả năng kiên nhẫn và chú ý đến chi tiết",
      "Có kết nối Internet để truy cập tài liệu khóa học",
    ],
    targetAudience: [
      "Các bạn sinh viên muốn tìm hiểu về ngôn ngữ Java hoàn thành dự án trên trường đại học",
      "Các bạn muốn tìm hiểu Java để phỏng vấn, đi làm thực tế",
      "Cần bạn đã đi làm, nhưng dưới nửa năm kinh nghiệm, muốn tìm hiểu thêm về ngôn ngữ",
      "Các bạn muốn luyện thi chứng chỉ SCJP",
    ],
    contentDetails: [
      "Tác giả là cựu sinh viên lớp kĩ sư tài năng đại học Bách Khoa Hà Nội và founder VietJack, website giáo dục lớn nhất Việt Nam hiện tại.",
      "Một khóa học hoàn toàn bằng tiếng Việt trên trang bán khóa học uy tín số 1 thế giới.",
      "Học mãi mãi, không giới hạn thời gian và số lần học với gần 100 videos quay sẵn.",
      "Tự tin đi phỏng vấn và trả lời các câu hỏi phỏng vấn tại các công ty tập đoàn.",
      "Các project mẫu vượt xa độ khó phạm vi kiến thức trong trường đại học.",
      "Được định hướng Java dưới yêu cầu doanh nghiệp, ngôn ngữ để xin việc và lương cao nhất.",
      "Một khóa học được đánh giá 4.7/5 từ nhận xét của các bạn học viên.",
      "Tự tin làm các project trên trường.",
      "Phạm vi khóa học vượt xa các kiến thức trong trường đại học, gắn liền thực tế doanh nghiệp yêu cầu.",
      "Định hướng học viên phát triển tiếp lên Java Web JSP theo yêu cầu doanh nghiệp.",
    ],
    instructorDetails: {
      name: "Từ Thanh Hoài",
      title: "Founder tại VietJack & Java Teacher",
      image: "https://i1.sndcdn.com/artworks-ku6NqZLkrVuKrxIb-5yzisw-t500x500.jpg", // Replace with actual image URL
      rating: 4.7,
      reviews: 201,
      students: 699,
      courses: 1,
      description: "Nguyễn Thanh Tuyên là một kỹ sư lập trình Java chuyên nghiệp, có hơn 5 năm trong lĩnh vực lập trình Java, là một kỹ sư quan trọng của nhiều dự án outsourcing quy mô về y tế, viễn thông, ERP cho các khách hàng Mỹ, Singapore. Anh là cựu sinh viên chương trình đào tạo kỹ sư tài năng của đại học Bách Khoa Hà Nội...",
    },
    reviews: [
      { name: "Nguyễn Hữu P.", rating: 5, comment: "Rất dễ hiểu và chi tiết!" },
      { name: "Lê Thị Mai", rating: 4, comment: "Khóa học tuyệt vời, giúp tôi nắm rõ căn bản." },
      { name: "Phạm Minh H.", rating: 5, comment: "Giảng viên tận tâm và nhiệt tình. Đáng tiền!" },
      { name: "Trần Văn Bình", rating: 3, comment: "Khóa học ổn nhưng có thể thêm ví dụ thực tế hơn." },
      { name: "Hoàng Hải", rating: 4, comment: "Nội dung chất lượng, phù hợp cho người mới bắt đầu." },
      { name: "Lý Quang T.", rating: 5, comment: "Khóa học rất tuyệt, dễ hiểu và bổ ích." },
      { name: "Thùy Linh", rating: 4, comment: "Một khóa học tốt, nhưng có thể cải thiện phần thực hành." },
      { name: "Đỗ Văn A.", rating: 3, comment: "Khóa học được, nhưng hơi khó hiểu ở một số chỗ." },
      { name: "Vũ Trần", rating: 5, comment: "Giảng viên giảng dạy chi tiết và nhiệt tình." },
      { name: "Mai Huyền", rating: 4, comment: "Khóa học giúp mình hiểu rõ về các khái niệm cơ bản." },
      { name: "Nguyễn Anh Khoa", rating: 4, comment: "Khóa học ổn, cung cấp nhiều kiến thức hữu ích." },
      { name: "Hà Linh", rating: 5, comment: "Rất hài lòng, giảng viên giảng dễ hiểu." },
      { name: "Phương Nam", rating: 4, comment: "Khóa học tốt, tuy nhiên phần lý thuyết hơi dài." },
      { name: "Minh Hoàng", rating: 5, comment: "Bài giảng rõ ràng và logic." },
      { name: "Thái Vũ", rating: 3, comment: "Cần nhiều bài tập thực hành hơn để hiểu sâu." },
      { name: "Đăng Minh", rating: 5, comment: "Tuyệt vời! Khóa học rất hữu ích." },
      { name: "Lan Anh", rating: 4, comment: "Mình học được nhiều kiến thức từ khóa học này." },
      { name: "Duy Phát", rating: 5, comment: "Giảng viên rất giỏi, mình thích phong cách dạy của anh." },
      { name: "Thiên Phú", rating: 4, comment: "Khóa học khá hay, nhưng cần thêm bài tập." }
    ]

  };

  return (
    <div className="w-full h-full min-h-screen bg-gray-100 overflow-y-auto">
      <NavBar /> {/* NavBar at the top */}
      
      <div className="container mx-auto px-8 py-8 lg:flex lg:gap-8 lg:pr-16">
        <div className="lg:w-3/4">
          <CourseHeader
            title={courseData.title}
            description={courseData.description}
            instructor={courseData.instructor}
            rating={courseData.rating}
            studentCount={courseData.studentCount}
            lastUpdated={courseData.lastUpdated}
          />

          {/* Content Details Section */}
          <CourseContentDetails contentDetails={courseData.contentDetails} />

          {/* Main Content and Requirements */}
          <CourseContent content={courseData.content} />
          <CourseRequirements 
            requirements={courseData.requirements} 
            description={courseData.description} 
            targetAudience={courseData.targetAudience} 
          />

          {/* Instructor Section */}
          <CourseInstructor instructor={courseData.instructorDetails} />

          {/* Reviews Section */}
          <CourseReviews reviews={courseData.reviews} />
        </div>

        {/* Sidebar with Course Media */}
        <div className="lg:flex lg:justify-center lg:w-1/4 lg:mr-4 lg:items-start">
          <CourseMedia
            price={courseData.price}
            thumbnail={courseData.thumbnail}
            onAddToCart={() => alert("Thêm vào giỏ hàng")}
            onBuyNow={() => alert("Mua ngay")}
          />
        </div>
      </div>
      
      <Footer /> {/* Footer at the bottom */}
    </div>
  );
};

export default CourseDetailPage;
