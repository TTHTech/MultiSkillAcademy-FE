import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const RecommendedTopics = () => {
  const [topics, setTopics] = useState([
    {
      name: "JavaScript",
      icon: "🚀",
      color: "from-yellow-400 to-orange-500",
      apiPath: "javascript"
    },
    {
      name: "Node.js",
      icon: "💻",
      color: "from-green-400 to-green-600",
      apiPath: "nodejs"
    },
    {
      name: "CSS",
      icon: "🎨",
      color: "from-blue-400 to-blue-600",
      apiPath: "css"
    },
    {
      name: "React JS",
      icon: "⚛️",
      color: "from-cyan-400 to-blue-500",
      apiPath: "reactjs"
    },
    {
      name: "Python",
      icon: "🐍",
      color: "from-yellow-400 to-green-500",
      apiPath: "python"
    },
    {
      name: "Phát triển web",
      icon: "🌐",
      color: "from-purple-400 to-pink-500",
      apiPath: "website"
    },
    {
      name: "MongoDB",
      icon: "🍃",
      color: "from-green-500 to-emerald-600",
      apiPath: "mongodb"
    },
    {
      name: "Phát triển giao diện web",
      icon: "✨",
      color: "from-indigo-400 to-purple-500",
      apiPath: "develop"
    },
    {
      name: "HTML",
      icon: "📝",
      color: "from-orange-400 to-red-500",
      apiPath: "html"
    },
    {
      name: "PHP",
      icon: "🐘",
      color: "from-blue-500 to-indigo-600",
      apiPath: "php"
    },
    {
      name: "Unity",
      icon: "🎮",
      color: "from-gray-700 to-gray-900",
      apiPath: "unity"
    },
    {
      name: "Data",
      icon: "📊",
      color: "from-blue-600 to-indigo-700",
      apiPath: "data"
    },
    {
      name: "Game",
      icon: "🎯",
      color: "from-red-500 to-pink-600",
      apiPath: "game"
    },
    {
      name: "App",
      icon: "📱",
      color: "from-teal-400 to-cyan-500",
      apiPath: "app"
    },
    {
      name: "Music",
      icon: "🎵",
      color: "from-purple-500 to-violet-600",
      apiPath: "music"
    }
  ]);
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Determine how many topics to display
  const displayedTopics = showAllTopics ? topics : topics.slice(0, 10);

  return (
    <section className="py-12 px-4 mx-auto max-w-[1500px] relative">
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
        {displayedTopics.map((topic, index) => (
          <div
            key={index}
            className="group relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link
              to={`/topic/${topic.apiPath}`}
              state={{ topicName: topic.name }}
              className="block w-full h-full z-10"
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
                  pointer-events-none
                `}>
                  {hoveredIndex === index && (
                    <div className="transform scale-0 group-hover:scale-100 transition-transform duration-200">
                      <span className="bg-white text-gray-900 px-4 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Khám phá
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Toggle Button - Show More/Less */}
      <div className="mt-8 text-center">
        <button 
          onClick={() => setShowAllTopics(prev => !prev)}
          className="
            bg-transparent hover:bg-indigo-50
            text-indigo-600 font-semibold
            py-2 px-6 border border-indigo-300
            rounded-lg transition-all duration-200
            hover:border-indigo-400 hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2
            flex items-center mx-auto gap-2
          "
        >
          {showAllTopics ? (
            <>
              Hiển thị ít hơn <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Xem tất cả chủ đề <ChevronDown className="w-4 h-4" />
            </>
          )}
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