import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <section
      className="py-16 px-4 relative mx-auto max-w-[1500px]"
      style={{
        backgroundImage:
          'url("https://img-b.udemycdn.com/notices/web_carousel_slide/image/9fa1fa32-1920-45d1-8be1-e4653bbd7726.png")',
        backgroundSize: "cover",
        backgroundPosition: "center", // Giữ hình ảnh cân đối
      }}
    >
      <div className="container mx-auto max-w-5xl">
        <Slider {...settings}>
          {/* Slide 1 */}
          <div className="relative">
            {/* Button at the top */}

            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
              <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center items-center">
                <div className="bg-white/80 p-6 rounded-lg shadow-md backdrop-blur-sm">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Trau dồi kỹ năng, lấy chứng chỉ
                  </h2>
                  <p className="text-gray-800 text-base">
                    Bạn đang muốn phát triển sự nghiệp? Với khóa học luyện thi
                    chứng chỉ Udemy, bạn có thể xác nhận các kỹ năng của bạn
                    trong AWS, Azure, CompTIA, v.v.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <img
                  src="https://th.bing.com/th/id/R.1121b45735937ba6fbb48cc12c70c6f8?rik=QY0Pav2DonD0CA&pid=ImgRaw&r=0"
                  alt="Illustration of person"
                  className="w-72 h-72 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Button at the bottom */}
            <div className="absolute bottom-4 left-4 z-10">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="relative">
            {/* Button at the top */}

            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
              <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center items-center">
                <div className="bg-white/80 p-6 rounded-lg shadow-md backdrop-blur-sm">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Học những gì bạn có hứng thú
                  </h2>
                  <p className="text-gray-800 text-base">
                    Trong một thế giới không ngừng thay đổi, việc trang bị cho
                    bản thân những kỹ năng mới và cập nhật kiến thức là vô cùng
                    cần thiết.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <img
                  src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4795.jpg?w=740&t=st=1699997178~exp=1699997778~hmac=7e088411897a774368186773f855734461c4444409994130231e7b270a2f30e5"
                  alt="Online Learning"
                  className="w-72 h-72 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Button at the bottom */}
            <div className="absolute bottom-4 left-4 z-10">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="relative">
            {/* Button at the top */}

            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
              <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center items-center">
                <div className="bg-white/80 p-6 rounded-lg shadow-md backdrop-blur-sm">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Khám phá tiềm năng của bạn
                  </h2>
                  <p className="text-gray-800 text-base">
                    Với hàng ngàn khóa học từ các chuyên gia hàng đầu, bạn sẽ có
                    cơ hội tiếp cận những kiến thức tiên tiến và nâng cao kỹ
                    năng của mình một cách hiệu quả.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <img
                  src="https://img.freepik.com/free-vector/flat-design-online-education-concept_23-2149240211.jpg?w=740&t=st=1699997277~exp=1699997877~hmac=4e0848452f8077776306c3918c3944a8e863c395619c2826b302824402c5536a"
                  alt="Explore your potential"
                  className="w-72 h-72 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Button at the bottom */}
            <div className="absolute bottom-4 left-4 z-10">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Slide 4 */}
          <div className="relative">
            {/* Button at the top */}

            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
              <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center items-center">
                <div className="bg-white/80 p-6 rounded-lg shadow-md backdrop-blur-sm">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Học mọi lúc, mọi nơi vô cùng tiện ích
                  </h2>
                  <p className="text-gray-800 text-base">
                    Chúng tôi cung cấp các khóa học trực tuyến với nội dung chất
                    lượng, phù hợp với lịch trình của từng học viên.chủ động
                    nâng cao kỹ năng và kiến thức không giới hạn.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <img
                  src="https://topicanative.edu.vn/wp-content/uploads/2020/06/hoc-tieng-anh-online-o-dau-hieu-qua-2.jpg"
                  alt="Learn anytime, anywhere"
                  className="w-72 h-72 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Button at the bottom */}
            <div className="absolute bottom-4 left-4 z-10">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Slide 5 */}
          <div className="relative">
            {/* Button at the top */}

            <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8">
              <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center items-center">
                <div className="bg-white/80 p-6 rounded-lg shadow-md backdrop-blur-sm">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                    Tham gia cộng đồng học tập hàng triệu người
                  </h2>
                  <p className="text-gray-800 text-base">
                    Bạn sẽ được tiếp xúc với những quan điểm khác biệt, chia sẻ
                    kiến thức, cũng như tạo dựng các mối quan hệ giá trị trong
                    cộng đồng.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <img
                  src="https://img.freepik.com/free-vector/webinar-concept-illustration_114360-4793.jpg?w=740&t=st=1699997402~exp=1699998002~hmac=7241587350532111237083297108324611964364533380721842294444555547"
                  alt="Join learning community"
                  className="w-72 h-72 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Button at the bottom */}
            <div className="absolute bottom-4 left-4 z-10">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                Learn More
              </button>
            </div>
          </div>
        </Slider>
      </div>
    </section>
  );
};

export default HeroSection;
