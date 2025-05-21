import { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Calendar, Check, Clock, AlertTriangle, ChevronLeft, ChevronRight, Mail, MessageSquare } from "lucide-react";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const CreateStudyReminder = ({ closeModal, triggerRefresh, courseId }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    content: "",
    email: localStorage.getItem("email") || "",
    courseId: "",
    frequency: "Hàng ngày",
    time: "09:00",
    selectedDays: [],
    isActive: true,
  });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isContentSelected, setIsContentSelected] = useState(false);
  
  useEffect(() => {
    if (!formData.content) {
      setFormData((prev) => ({
        ...prev,
        content: "Tiến lên mỗi ngày, bạn đang tiến gần hơn đến mục tiêu!",
      }));
    }
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "content" && value !== "") {
      setIsContentSelected(true);
    }
  };

  const handleFrequencyClick = (frequency) => {
    if (frequency === "Hàng tuần") {
      setFormData((prev) => ({ ...prev, frequency, selectedDays: [] }));
    } else {
      setFormData((prev) => ({ ...prev, frequency, selectedDays: [] }));
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      if (prev.selectedDays.includes(day)) {
        return {
          ...prev,
          selectedDays: prev.selectedDays.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          selectedDays: [...prev.selectedDays, day],
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        content: formData.content,
        email: formData.email,
        courseId: courseId,
        frequency: formData.frequency,
        selectedDays: formData.selectedDays,
        time: formData.time,
        isActive: formData.isActive,
        userId: localStorage.getItem("userId"),
      };
      
      const response = await axios.post(
        `${baseUrl}/api/student/reminders`,
        payload
      );

      // Thông báo thành công với alert
      alert("Nhắc nhở học tập đã được thêm thành công!");
      closeModal();
      triggerRefresh();
    } catch (error) {
      console.error("Có lỗi xảy ra khi thêm nhắc nhở:", error);
      alert("Không thể thêm nhắc nhở. Vui lòng thử lại!");
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((stepNumber) => (
            <div 
              key={stepNumber}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-medium transition-all ${
                stepNumber === step 
                  ? "bg-indigo-600 text-white" 
                  : stepNumber < step 
                  ? "bg-indigo-100 text-indigo-600" 
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {stepNumber < step ? (
                <Check className="w-4 h-4" />
              ) : (
                stepNumber
              )}
            </div>
          ))}
        </div>
        <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-indigo-600 transition-all duration-300 ease-in-out"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800 mb-1">Nội dung thông báo</h3>
                  <p className="text-sm text-indigo-600">Chọn nội dung thông báo sẽ được gửi đến email của bạn</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                "Tiến lên mỗi ngày, bạn đang tiến gần hơn đến mục tiêu!",
                "Chỉ cần kiên trì, thành công sẽ đến với bạn!",
                "Mỗi bước nhỏ đều dẫn bạn đến thành công lớn!",
                "Chinh phục thử thách và vươn tới đỉnh cao!",
                "Nội dung khác",
              ].map((option, index) => (
                <label 
                  key={index} 
                  className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 ${
                    option === "Nội dung khác"
                      ? showCustomInput
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-gray-200"
                      : formData.content === option
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="content"
                    value={option}
                    checked={
                      option === "Nội dung khác"
                        ? ![
                            "Tiến lên mỗi ngày, bạn đang tiến gần hơn đến mục tiêu!",
                            "Chỉ cần kiên trì, thành công sẽ đến với bạn!",
                            "Mỗi bước nhỏ đều dẫn bạn đến thành công lớn!",
                            "Chinh phục thử thách và vươn tới đỉnh cao!",
                          ].includes(formData.content)
                        : formData.content === option
                    }
                    onChange={(e) => {
                      handleInputChange(e);
                      if (option === "Nội dung khác") {
                        setShowCustomInput(true);
                        setFormData({ ...formData, content: "" });
                      } else {
                        setShowCustomInput(false);
                        setFormData({ ...formData, content: option });
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 mr-3"
                  />
                  <span className="text-gray-700 font-medium">{option}</span>
                </label>
              ))}
            </div>
            
            {showCustomInput && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhập nội dung tùy chỉnh</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập nội dung khác"
                    className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <Bell className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800 mb-1">Tần suất nhắc nhở</h3>
                  <p className="text-sm text-indigo-600">Chọn tần suất và thời gian bạn muốn nhận nhắc nhở</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tần suất</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Hàng ngày", "Hàng tuần", "Một lần"].map((frequency) => (
                  <button
                    key={frequency}
                    type="button"
                    onClick={() => handleFrequencyClick(frequency)}
                    className={`px-4 py-2 rounded-lg border transition-colors focus:outline-none ${
                      formData.frequency === frequency
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
            </div>

            {formData.frequency === "Hàng tuần" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn các ngày trong tuần</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { code: "Su", label: "CN" },
                    { code: "Mo", label: "T2" },
                    { code: "Tu", label: "T3" },
                    { code: "We", label: "T4" },
                    { code: "Th", label: "T5" },
                    { code: "Fr", label: "T6" },
                    { code: "Sa", label: "T7" },
                  ].map((day) => (
                    <button
                      key={day.code}
                      type="button"
                      onClick={() => toggleDay(day.code)}
                      className={`w-10 h-10 rounded-full font-medium transition-all focus:outline-none ${
                        formData.selectedDays.includes(day.code)
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
                {formData.selectedDays.length === 0 && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="text-sm">Bạn cần chọn ít nhất 1 ngày trong tuần</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Thời gian thông báo
                </div>
              </label>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <select
                    name="timeHour"
                    value={formData.time.split(":")[0]}
                    onChange={(e) => setFormData({
                      ...formData,
                      time: `${e.target.value}:${formData.time.split(":")[1]}`,
                    })}
                    className="w-full p-3 appearance-none border border-gray-200 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {Array.from({ length: 24 }, (_, index) => (
                      <option key={index} value={index.toString().padStart(2, "0")}>
                        {index.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                
                <div className="px-2 text-xl font-medium text-gray-500">:</div>
                
                <div className="relative flex-1">
                  <select
                    name="timeMinutes"
                    value={formData.time.split(":")[1]}
                    onChange={(e) => setFormData({
                      ...formData,
                      time: `${formData.time.split(":")[0]}:${e.target.value}`,
                    })}
                    className="w-full p-3 appearance-none border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {Array.from({ length: 60 }, (_, index) => (
                      <option key={index} value={index.toString().padStart(2, "0")}>
                        {index.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                  <Mail className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800 mb-1">Email nhận thông báo</h3>
                  <p className="text-sm text-indigo-600">Nhập địa chỉ email bạn muốn nhận nhắc nhở học tập</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com"
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
                    ? "border-gray-200 focus:ring-indigo-500 focus:border-transparent"
                    : "border-red-300 focus:ring-red-500 focus:border-transparent"
                  }`}
                />
              </div>
              
              {!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email) && formData.email && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 mt-2 rounded-lg border border-red-200">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm">Vui lòng nhập địa chỉ email hợp lệ</p>
                </div>
              )}
            </div>
            
            <div className="pt-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Tóm tắt thông tin nhắc nhở</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nội dung:</span>
                    <span className="text-gray-700 font-medium">{formData.content.substring(0, 30)}{formData.content.length > 30 ? '...' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tần suất:</span>
                    <span className="text-gray-700 font-medium">{formData.frequency}</span>
                  </div>
                  {formData.frequency === "Hàng tuần" && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Các ngày:</span>
                      <span className="text-gray-700 font-medium">{formData.selectedDays.join(", ")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Thời gian:</span>
                    <span className="text-gray-700 font-medium">{formData.time}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceedFromStep2 = () => {
    if (formData.frequency === "Hàng tuần") {
      return formData.selectedDays.length > 0;
    }
    return true;
  };

  const canProceedFromStep3 = () => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email);
  };

  const getStepNavigation = () => {
    const isLastStep = step === 3;
    const isFirstStep = step === 1;
    
    const canProceed = 
      (step === 1 && !!formData.content) || 
      (step === 2 && canProceedFromStep2()) ||
      (step === 3 && canProceedFromStep3());

    return (
      <div className="flex justify-between pt-6 mt-8 border-t border-gray-100">
        {!isFirstStep ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Trước
          </button>
        ) : (
          <div></div>
        )}

        <button
          type="button"
          onClick={() => {
            if (isLastStep) {
              handleSubmit();
            } else {
              setStep(step + 1);
            }
          }}
          disabled={!canProceed}
          className={`flex items-center gap-1 px-5 py-2 font-medium rounded-lg transition-colors ${
            canProceed
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLastStep ? "Hoàn tất" : "Tiếp theo"}
          {!isLastStep && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Chọn nội dung nhắc nhở";
      case 2:
        return "Cài đặt tần suất";
      case 3:
        return "Xác nhận thông tin";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Tạo mới nhắc nhở học tập
        </h2>
        <div className="flex items-center">
          <span className="text-gray-500 text-sm">Bước {step}/3:</span>
          <span className="font-medium text-indigo-600 text-sm ml-1">{getStepTitle()}</span>
        </div>
      </div>
      
      {renderProgressBar()}
      
      {renderStepContent()}
      
      {getStepNavigation()}
    </div>
  );
};

export default CreateStudyReminder;