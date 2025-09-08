import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import topicsEngData from "../../data/topicseng.json";
import topicsTamData from "../../data/topicstam.json";
import bg from "../../assets/bg.jpg";

const TopicSelection = () => {
  const { classId, displayName, schoolName, subject, lang } = useParams();
  const navigate = useNavigate();

  // ✅ Language comes from route param
  const language = lang === "tamil" ? "tamil" : "english";

  // ✅ Correct way to fetch topics based on language
  const classKey = `class${classId}`;
  const dataset = language === "english" ? topicsEngData : topicsTamData;
  const classObj = dataset.find((item) => item[classKey]);
  const topics = classObj ? classObj[classKey]?.[subject.toLowerCase()] || [] : [];

  // ✅ Navigate to next page
  const goNext = (topic) => {
    navigate(
      `/single/${classId}/${displayName}/${schoolName}/${subject}/lang/${lang}/${topic}/ma`
    );
  };

  // ✅ Content translations
  const content = {
    english: {
      heading: "📚 Choose a Topic",
      subtitle: `Select a topic in ${subject} for Class ${classId} and start learning in style! 🚀`,
      notopics: "No topics available for this subject.",
    },
    tamil: {
      heading: "📚 தலைப்பை தேர்ந்தெடுக்கவும்",
      subtitle: `பாடம்: ${subject} | வகுப்பு: ${classId} — இப்போது கற்றலை தொடங்குங்கள்! 🚀`,
      notopics: "இந்த பாடத்திற்கு தலைப்புகள் இல்லை.",
    },
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center p-[5%]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-[#fbfbfb] opacity-85 rounded-[3vh] shadow-2xl p-[5%] w-full max-w-[70%] relative">
        {/* Heading */}
        <h1 className="text-[5vh] font-extrabold text-black mb-[2%] text-center drop-shadow-sm">
          {content[language].heading}
        </h1>

        {/* Subtitle */}
        <p className="text-[2.5vh] text-gray-700 text-center mb-[5%]">
          {content[language].subtitle}
        </p>

        {/* Topics List */}
        <div className="flex flex-col gap-[3vh]">
          {topics.length > 0 ? (
            topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => goNext(topic)}
                className="flex flex-col items-center gap-[3%] px-[4%] py-[3%] bg-white rounded-[2vh] shadow-md border border-gray-200 
                hover:shadow-2xl hover:bg-gradient-to-r hover:from-[#BCA5D4] hover:to-[#BACBFE] hover:text-black
                transition-all transform hover:scale-105"
              >
                <span className="text-[3vh]">🎮</span>
                <span className="text-[2.5vh] font-semibold">{topic}</span>
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full text-[2.5vh]">
              {content[language].notopics}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicSelection;