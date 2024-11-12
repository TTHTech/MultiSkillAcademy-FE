// src/components/home/RecommendedTopics.jsx
import React from "react";

const topics = [
  "JavaScript", 
  "Node.Js", 
  "CSS", 
  "React JS", 
  "Python", 
  "Phát triển web", 
  "MongoDB", 
  "Phát triển giao diện web", 
  "HTML", 
  "PHP (ngôn ngữ lập trình)"
];

const RecommendedTopics = () => {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Các chủ đề đề xuất dành cho bạn</h2>
      <div className="flex flex-wrap gap-4">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="w-40 h-16 flex items-center justify-center border border-gray-300 rounded-md bg-white shadow-sm"
          >
            <span className="text-gray-700 font-semibold text-lg">{topic}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedTopics;
