import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import topicsEngData from "../../data/topicseng.json";
import topicsTamData from "../../data/topicstam.json";



const TopicSelection = () => {
  const { classId, subject } = useParams();
  const navigate = useNavigate();

  // Correct way to fetch topics
  const classKey = `class${classId}`;
  const topics = topicsData[classKey]?.[subject.toLowerCase()] || [];

  const goNext = (topic) => {
    navigate(
      `/difficulty/${classId}/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c5baff] via-[#c4d9ff] to-[#e8f9ff] p-8">
      <div className="bg-[#fbfbfb] rounded-3xl shadow-2xl p-12 w-full max-w-5xl">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-black mb-4 text-center drop-shadow-sm">
          📚 Choose a Topic
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-700 text-center mb-12">
          Select a topic in{" "}
          <span className="font-bold capitalize">{subject}</span> for Class{" "}
          <span className="font-bold">{classId}</span> and start learning in style! 🚀
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => goNext(topic)}
                className="flex items-center gap-4 px-6 py-5 bg-white rounded-2xl shadow-md border border-gray-200 
                hover:shadow-xl hover:bg-[#c5baff] hover:text-gray-900 
                transition-all transform hover:scale-105"
              >
                <span className="text-3xl">📘</span>
                <span className="text-lg font-semibold">{topic}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No topics available for this subject.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;
