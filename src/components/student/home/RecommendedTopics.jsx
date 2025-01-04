import React, { useState } from "react";

const topics = [
  {
    name: "JavaScript",
    icon: "🚀",
    color: "from-yellow-400 to-orange-500",
  },
  {
    name: "Node.js",
    icon: "💻",
    color: "from-green-400 to-green-600",
  },
  {
    name: "CSS",
    icon: "🎨",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "React JS",
    icon: "⚛️",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "Python",
    icon: "🐍",
    color: "from-yellow-400 to-green-500",
  },
  {
    name: "Phát triển web",
    icon: "🌐",
    color: "from-purple-400 to-pink-500",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Phát triển giao diện web",
    icon: "✨",
    color: "from-indigo-400 to-purple-500",
  },
  {
    name: "HTML",
    icon: "📝",
    color: "from-orange-400 to-red-500",
  },
  {
    name: "PHP",
    icon: "🐘",
    color: "from-blue-500 to-indigo-600",
  }
];

const RecommendedTopics = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-12 px-4 mx-auto max-w-[1500px]">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Các chủ đề được đề xuất
        </h2>
        <p className="text-gray-600">
          Khám phá các chủ đề phổ biến và bắt đầu hành trình học tập của bạn
        </p>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`
                h-full w-full rounded-xl p-4
                bg-gradient-to-br ${topic.color}
                transform transition-all duration-300
                ${hoveredIndex === index ? 'scale-105 shadow-lg' : 'shadow-md'}
                cursor-pointer
                hover:shadow-xl
              `}
            >
              {/* Topic Content */}
              <div className="flex flex-col items-center space-y-2 text-white">
                <span className="text-2xl mb-1">{topic.icon}</span>
                <span className="font-medium text-center text-sm">
                  {topic.name}
                </span>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`
                absolute inset-0 rounded-xl
                bg-black bg-opacity-0 transition-opacity duration-300
                group-hover:bg-opacity-10
                flex items-center justify-center
              `}>
                {hoveredIndex === index && (
                  <div className="transform scale-0 group-hover:scale-100 transition-transform duration-200">
                    <button className="bg-white text-gray-900 px-4 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Khám phá
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All Topics Button */}
      <div className="mt-8 text-center">
        <button className="
          bg-transparent hover:bg-gray-100
          text-gray-700 font-semibold
          py-2 px-6 border border-gray-300
          rounded-lg transition-all duration-200
          hover:border-gray-400 hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
        ">
          Xem tất cả chủ đề
        </button>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -z-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 left-0 -z-10 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 right-0 -z-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </section>
  );
};

export default RecommendedTopics;