import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

const slides = [
  {
    title: "Trau dồi kỹ năng, lấy chứng chỉ",
    description: "Bạn đang muốn phát triển sự nghiệp? Với khóa học luyện thi chứng chỉ Udemy, bạn có thể xác nhận các kỹ năng của bạn trong AWS, Azure, CompTIA, v.v.",
    image: "https://th.bing.com/th/id/R.1121b45735937ba6fbb48cc12c70c6f8?rik=QY0Pav2DonD0CA&pid=ImgRaw&r=0",
    badge: "Được yêu thích"
  },
  {
    title: "Học những gì bạn có hứng thú",
    description: "Trong một thế giới không ngừng thay đổi, việc trang bị cho bản thân những kỹ năng mới và cập nhật kiến thức là vô cùng cần thiết.",
    image: "https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4795.jpg?w=740&t=st=1699997178~exp=1699997778~hmac=7e088411897a774368186773f855734461c4444409994130231e7b270a2f30e5",
    badge: "Mới"
  },
  {
    title: "Khám phá tiềm năng của bạn",
    description: "Với hàng ngàn khóa học từ các chuyên gia hàng đầu, bạn sẽ có cơ hội tiếp cận những kiến thức tiên tiến và nâng cao kỹ năng của mình một cách hiệu quả.",
    image: "https://img.freepik.com/free-vector/flat-design-online-education-concept_23-2149240211.jpg?w=740&t=st=1699997277~exp=1699997877~hmac=4e0848452f8077776306c3918c3944a8e863c395619c2826b302824402c5536a",
    badge: "Hot"
  },
  {
    title: "Học mọi lúc, mọi nơi vô cùng tiện ích",
    description: "Chúng tôi cung cấp các khóa học trực tuyến với nội dung chất lượng, phù hợp với lịch trình của từng học viên. Chủ động nâng cao kỹ năng và kiến thức không giới hạn.",
    image: "https://blog.commlabindia.com/hubfs/Imported_Blog_Media/integrating-ilt-initiatives-with-elearning-1.jpg",
    badge: "Trending"
  },
  {
    title: "Tham gia cộng đồng học tập hàng triệu người",
    description: "Bạn sẽ được tiếp xúc với những quan điểm khác biệt, chia sẻ kiến thức, cũng như tạo dựng các mối quan hệ giá trị trong cộng đồng.",
    image: "https://img.freepik.com/free-vector/webinar-concept-illustration_114360-4793.jpg?w=740&t=st=1699997402~exp=1699998002~hmac=7241587350532111237083297108324611964364533380721842294444555547"
  }
];

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
    aria-label="Next slide"
  >
    <ChevronRight className="w-5 h-5 text-blue-600" />
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
    aria-label="Previous slide"
  >
    <ChevronLeft className="w-5 h-5 text-blue-600" />
  </button>
);

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    pauseOnHover: true,
    customPaging: () => (
      <div className="w-3 h-3 mx-1 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300" />
    )
  };

  return (
    <section
      className="py-16 px-4 relative mx-auto max-w-[1500px] overflow-hidden"
      style={{
        backgroundImage:
          'url("https://img-b.udemycdn.com/notices/web_carousel_slide/image/9fa1fa32-1920-45d1-8be1-e4653bbd7726.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 mix-blend-overlay" />

      <div className="container mx-auto max-w-5xl relative">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="relative outline-none">
              <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-8 relative">
                <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center items-center">
                  <div className="bg-white/80 p-6 rounded-xl shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 relative">
                    {slide.badge && (
                      <div className="absolute -top-3 -left-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-md">
                        <Sparkles className="w-4 h-4" />
                        {slide.badge}
                      </div>
                    )}
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {slide.title}
                    </h2>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 group">
                        <span>Tìm hiểu thêm</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative group">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-72 h-72 object-cover rounded-xl shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx global>{`
        .slick-dots {
          bottom: 20px;
        }
        .slick-dots li button:before {
          display: none;
        }
        .slick-dots li {
          margin: 0;
        }
        .slick-dots li.slick-active div {
          background-color: rgba(255, 255, 255, 0.9);
          transform: scale(1.2);
        }
        .slick-slide {
          padding: 1rem;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;