import React, { useState } from "react";

const StudyReminder = () => {
  const [step, setStep] = useState(1);
  const [selectedFrequency, setSelectedFrequency] = useState("Hàng tuần");
  const [selectedDay, setSelectedDay] = useState([]);

  const handleFrequencyClick = (frequency) => {
    setSelectedFrequency(frequency);
  };

  const toggleDay = (day) => {
    setSelectedDay((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 border rounded shadow-lg bg-white mb-10">
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Nhắc nhở học tập</h2>
          <p className="text-gray-600 mb-2">Bước 1/3</p>
          <input
            type="text"
            placeholder="Nhắc nhở học tập"
            className="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <p className="mb-2 font-medium">Đính kèm nội dung (không bắt buộc)</p>
          <div className="space-y-3">
            {[
              "Khóa học: Viết ứng dụng bán hàng với Java Springboot/API và Angular",
              "Khóa học: Cách tạo một khóa học Udemy (Có phụ đề)",
              "Khóa học: Thiết kế cơ sở dữ liệu ứng dụng nghe nhạc với Oracle 21c",
              "Không có",
            ].map((option, index) => (
              <label key={index} className="block cursor-pointer">
                <input type="radio" name="course" className="mr-2" /> {option}
              </label>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-4 px-6 py-3 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Tiếp theo
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Nhắc nhở học tập</h2>
          <p className="text-gray-600 mb-2">Bước 2/3</p>
          <p className="mb-2 font-medium">Tần suất</p>
          <div className="flex space-x-4 mb-6">
            {["Hàng ngày", "Hàng tuần", "Một lần"].map((frequency) => (
              <button
                key={frequency}
                onClick={() => handleFrequencyClick(frequency)}
                className={`px-4 py-2 border rounded font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  selectedFrequency === frequency
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {frequency}
              </button>
            ))}
          </div>
          <div className="mb-6">
            <label className="block font-medium mb-2">Thời gian</label>
            <input
              type="time"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <p className="mb-2 font-medium">Ngày</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-4 py-2 border rounded font-medium transition-all ${
                  selectedDay.includes(day) ? "bg-blue-500 text-white" : ""
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border rounded shadow font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Trước
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Nhắc nhở học tập</h2>
          <p className="text-gray-600 mb-2">Bước 3/3</p>
          <p className="mb-4 font-medium">Thêm vào lịch (không bắt buộc)</p>
          <div className="flex space-x-4 mb-6">
            {["Google", "Apple", "Outlook"].map((platform) => (
              <button
                key={platform}
                className="px-6 py-3 border rounded font-medium shadow bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {platform}
              </button>
            ))}
          </div>
          <button
            onClick={() => alert("Hoàn thành!")}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Xong
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyReminder;
