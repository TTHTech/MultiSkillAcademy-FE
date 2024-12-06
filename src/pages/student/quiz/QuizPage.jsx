import React, { useState, useEffect } from "react";
import NavBar from "../../../components/student/common/NavBar"; 
import Footer from "../../../components/student/common/Footer"; 
import QuizSidebar from "../../../components/student/Quiz/QuizSidebar";
import QuizQuestionSection from "../../../components/student/Quiz/QuizQuestionSection";
import QuizNavigation from "../../../components/student/Quiz/QuizNavigation";

const QuizPage = () => {
  const questions = [
    { 
      question: "Câu hỏi 1: Bạn nghĩ gì về việc học trực tuyến trong thời gian qua? Liệu nó có thể thay thế hoàn toàn phương pháp học truyền thống không?", 
      options: ["Có, học trực tuyến rất tiện lợi", "Không, học trực tuyến thiếu tính tương tác", "Cả hai phương pháp đều có ưu điểm riêng", "Tôi không chắc"] 
    },
    { 
      question: "Câu hỏi 2: Theo bạn, điều gì là quan trọng nhất trong việc chọn nghề nghiệp? Hãy cho tôi biết suy nghĩ của bạn.", 
      options: ["Đam mê và sở thích cá nhân", "Mức lương cao", "Cơ hội thăng tiến trong công việc", "Sự ổn định và an toàn"] 
    },
    { 
      question: "Câu hỏi 3: Bạn cảm thấy như thế nào về vấn đề ô nhiễm môi trường hiện nay? Bạn nghĩ chúng ta có thể làm gì để giảm thiểu ô nhiễm?", 
      options: ["Đó là vấn đề nghiêm trọng, cần có hành động ngay lập tức", "Ô nhiễm không phải là vấn đề lớn đối với tôi", "Chúng ta cần giảm thiểu rác thải nhựa", "Chỉ có các tổ chức mới có thể giải quyết được"] 
    },
    { 
      question: "Câu hỏi 4: Bạn có nghĩ rằng sự thay đổi khí hậu là một mối nguy hiểm lớn trong tương lai? Nếu có, bạn nghĩ chính phủ và cộng đồng có thể làm gì?", 
      options: ["Có, chúng ta cần hành động ngay", "Không, tôi không nghĩ nó sẽ ảnh hưởng lớn", "Chúng ta nên tập trung vào giáo dục về môi trường", "Chỉ có các quốc gia lớn mới có thể giải quyết vấn đề này"] 
    },
    { 
      question: "Câu hỏi 5: Bạn có nghĩ rằng việc học ngoại ngữ sẽ giúp bạn thành công hơn trong sự nghiệp không? Tại sao?", 
      options: ["Có, ngoại ngữ mở ra cơ hội toàn cầu", "Không, chỉ cần chuyên môn là đủ", "Có thể, nhưng không phải lúc nào cũng cần thiết", "Tôi không chắc"] 
    },
    { 
      question: "Câu hỏi 6: Bạn nghĩ gì về việc làm việc từ xa? Liệu mô hình này có thể trở thành xu hướng lâu dài?", 
      options: ["Có, làm việc từ xa rất tiện lợi và hiệu quả", "Không, tôi thích làm việc ở văn phòng", "Chỉ nên làm việc từ xa trong một số ngành nghề nhất định", "Tôi không biết, cần phải nghiên cứu thêm"] 
    },
    { 
      question: "Câu hỏi 7: Trong xã hội hiện nay, bạn nghĩ ai là người đóng vai trò quan trọng trong việc giáo dục thế hệ trẻ?", 
      options: ["Các thầy cô giáo", "Các bậc phụ huynh", "Cộng đồng và xã hội", "Nhà nước và các tổ chức giáo dục"] 
    },
    { 
      question: "Câu hỏi 8: Bạn cảm thấy như thế nào về việc sử dụng công nghệ trong giáo dục? Liệu công nghệ có thể thay thế giáo viên không?", 
      options: ["Công nghệ có thể hỗ trợ nhưng không thể thay thế giáo viên", "Công nghệ hoàn toàn có thể thay thế giáo viên trong tương lai", "Công nghệ chỉ là công cụ hỗ trợ", "Không, tôi không tin công nghệ có thể thay thế giáo viên"] 
    },
    { 
      question: "Câu hỏi 9: Bạn có nghĩ rằng mỗi cá nhân đều có trách nhiệm trong việc bảo vệ động vật và thiên nhiên không? Bạn có hành động gì để bảo vệ chúng?", 
      options: ["Có, tôi luôn tham gia các hoạt động bảo vệ động vật", "Không, tôi không quan tâm nhiều đến vấn đề này", "Có, nhưng tôi không biết phải làm gì", "Tôi không chắc"] 
    },
    { 
      question: "Câu hỏi 10: Bạn có nghĩ rằng việc giữ gìn văn hóa truyền thống là quan trọng? Nếu có, bạn nghĩ chúng ta cần làm gì để bảo tồn các giá trị này?", 
      options: ["Có, tôi nghĩ chúng ta cần bảo tồn các giá trị văn hóa truyền thống", "Không, văn hóa truyền thống không còn quan trọng nữa", "Chúng ta cần kết hợp văn hóa truyền thống và hiện đại", "Tôi không biết"] 
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 phút

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
        }
        return prevTime > 0 ? prevTime - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar /> 
      
      <div className="flex flex-1 justify-center p-8 flex-row-reverse"> {/* Updated here */}
        {/* Sidebar */}
        <QuizSidebar
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          onSelectQuestion={handleSelectQuestion}
        />

        {/* Main content */}
        <div className="flex-1 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold">
              Thời gian còn lại: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          </div>

          <QuizQuestionSection
            question={questions[currentQuestionIndex].question}
            options={questions[currentQuestionIndex].options}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
          />

          <QuizNavigation
            onNext={handleNext}
            onPrev={handlePrev}
            isLastQuestion={currentQuestionIndex === questions.length - 1}
            isFirstQuestion={currentQuestionIndex === 0}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuizPage;
