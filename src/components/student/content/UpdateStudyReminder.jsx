import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateStudyReminder = ({ Data, closeModal }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    content: Data.content,
    email: Data.email,
    courseId: Data.courseId,
    frequency: Data.frequency,
    time: Data.time,
    selectedDays: Data.selectedDays,
    isActive: Data.isActive,
  });
  const { id } = useParams();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isContentSelected, setIsContentSelected] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "content" && value !== "") {
      setIsContentSelected(true);
    }
  };

  const handleFrequencyClick = (frequency) => {
    if (frequency === "Hàng tuần") {
      setFormData((prev) => ({ ...prev, frequency: "", selectedDays: [] }));
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
        courseId: id,
        frequency: formData.frequency,
        selectedDays: formData.selectedDays,
        time: formData.time,
        isActive: formData.isActive,
        userId: localStorage.getItem("userId"),
      };
      console.log(localStorage.getItem("userId"));
      const response = await axios.put(
        `http://localhost:8080/api/student/reminders/${Data.id}`,
        payload
      );

      alert("Nhắc nhở học tập đã được cập nhật thành công!");
      closeModal();
      console.log(response.data);
    } catch (error) {
      console.error("Có lỗi xảy ra khi cập nhật nhắc nhở:", error);
      alert("Không thể cập nhật nhắc nhở. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white mb-10">
      {step === 1 && (
        <div className="h-full">
          <p className="text-gray-600 mb-2">Bước 1/3</p>
          <div>
            <p className="mb-2 font-bold text-xl text-gray-900">
              Nội dung thông báo được đính kèm là:
            </p>
            <p className="mb-2 font-bold text-xl text-gray-900">
              {formData.content}
            </p>
            <p className="mb-2 font-medium">Chọn nội dung thông báo khác:</p>
            <div className="space-y-3">
              {[
                "Tiến lên mỗi ngày, bạn đang tiến gần hơn đến mục tiêu!",
                "Chỉ cần kiên trì, thành công sẽ đến với bạn!",
                "Mỗi bước nhỏ đều dẫn bạn đến thành công lớn!",
                "Chinh phục thử thách và vươn tới đỉnh cao!",
                "Không có",
                "Nội dung khác",
              ].map((option, index) => (
                <label key={index} className="block cursor-pointer">
                  <input
                    type="radio"
                    name="content"
                    value={option}
                    checked={formData.content === option}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (option === "Nội dung khác") {
                        setShowCustomInput(true);
                      } else {
                        setShowCustomInput(false);
                      }
                    }}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>

            {showCustomInput && (
              <input
                type="text"
                name="content"
                value={formData.content}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value) {
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    });
                  }
                }}
                placeholder="Nhập nội dung khác"
                className="w-full p-3 border rounded mt-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}
          </div>

          {formData.content && (
            <button
              onClick={() => setStep(2)}
              className="mt-4 px-6 py-3 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tiếp theo
            </button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="h-full">
          <p className="text-gray-600 mb-2">Bước 2/3</p>
          <p className="mb-2 font-medium">Tần suất</p>
          <div className="flex space-x-4 mb-6">
            {["Hàng ngày", "Hàng tuần", "Một lần"].map((frequency) => (
              <button
                key={frequency}
                onClick={() => {
                  handleFrequencyClick(frequency);
                  if (frequency !== "Hàng tuần") {
                    setFormData((prev) => ({
                      ...prev,
                      selectedDays: [],
                      frequency,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      frequency,
                    }));
                  }
                }}
                className={`px-4 py-2 border rounded font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  formData.frequency === frequency
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {frequency}
              </button>
            ))}
          </div>

          {formData.frequency === "Hàng tuần" && (
            <>
              <p className="mb-2 font-medium">Chọn các ngày trong tuần</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 border rounded font-medium transition-all ${
                      formData.selectedDays.includes(day)
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="mb-6">
            <label className="block font-medium mb-2">
              Thời gian thông báo
            </label>
            <input
              type="time"
              name="time"
              value={`${String(formData.time[0]).padStart(2, "0")}:${String(
                formData.time[1]
              ).padStart(2, "0")}`}
              onChange={handleInputChange}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border rounded shadow font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Trước
            </button>
            <button
              onClick={() => {
                setStep(3);
              }}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="h-full">
          <p className="text-gray-600 mb-2">Bước 3/3</p>
          <p className="text-gray-600">Email nhận thông báo</p>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={formData.email}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            formData.email
          ) ? (
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border rounded shadow font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-2"
              >
                Trước
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              >
                Xong
              </button>
            </div>
          ) : (
            <p className="text-red-500 text-sm mt-2">
              Vui lòng nhập địa chỉ email hợp lệ.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateStudyReminder;
