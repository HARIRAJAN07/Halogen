import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import scienceGif from "../../assets/science.gif";
import mathGif from "../../assets/math.gif";
import socialGif from "../../assets/social.gif";
import tamilGif from "../../assets/tamil.gif";
import englishGif from "../../assets/english.gif";
import physicsGif from "../../assets/physics.gif"; 
import chemistryGif from "../../assets/chemistry.gif"; 
import biologyGif from "../../assets/biology.gif"; 
import csGif from "../../assets/cs.gif"; 

const subjectsForGrades6to10 = [
  { en: "Science", ta: "அறிவியல்", gif: scienceGif, color: "bg-[#BCA5D4]" },
  { en: "Math", ta: "கணிதம்", gif: mathGif, color: "bg-[#BCA5D4]" },
  { en: "Social Studies", ta: "சமூக அறிவியல்", gif: socialGif, color: "bg-[#BCA5D4]" },
  { en: "Tamil", ta: "தமிழ்", gif: tamilGif, color: "bg-[#BCA5D4]" },
  { en: "English", ta: "ஆங்கிலம்", gif: englishGif, color: "bg-[#BCA5D4]" },
];

const subjectsForHigherGrades = [
  { en: "Physics", ta: "இயற்பியல்", gif: physicsGif, color: "bg-[#BCA5D4]" },
  { en: "Chemistry", ta: "வேதியியல்", gif: chemistryGif, color: "bg-[#BCA5D4]" },
  { en: "Biology", ta: "உயிரியல்", gif: biologyGif, color: "bg-[#BCA5D4]" },
  { en: "Computer Science", ta: "கணினி அறிவியல்", gif: csGif, color: "bg-[#BCA5D4]" },
  { en: "English", ta: "ஆங்கிலம்", gif: englishGif, color: "bg-[#BCA5D4]" },
];

const SubjectSelection = () => {
  const [flipped, setFlipped] = useState({});
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const { classId, displayName } = useParams();

  // 📝 Select the correct subject list based on classId
  const isHigherGrade = parseInt(classId) >= 11;
  const subjectsToDisplay = isHigherGrade ? subjectsForHigherGrades : subjectsForGrades6to10;

  const toggleFlip = (subjectName) => {
    setFlipped((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative"
      style={{ backgroundColor: "#EFE2FA" }}
    >
      {/* Language Toggle Button */}
      <button
        onClick={() => setLanguage(language === "en" ? "ta" : "en")}
        className="absolute top-6 left-6 px-6 py-3 text-lg rounded-lg bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition"
      >
        {language === "en" ? "தமிழ்" : "English"}
      </button>

      {/* Heading */}
      <h1 className="text-6xl sm:text-6xl 4xl:text-10xl font-extrabold text-center text-black mb-2 sm:mb-4 drop-shadow-sm">
        {language === "en" ? "Choose Your Subject" : "உங்கள் பாடத்தைத் தேர்வு செய்யுங்கள்"}
      </h1>
      <p className="text-md sm:text-xl 2xl:text-3xl text-gray-700 text-center mb-8 sm:mb-12">
        {language === "en"
          ? "Select a subject to Start your Game!"
          : "விளையாட்டைத் தொடங்க ஒரு பாடத்தைத் தேர்ந்தெடுக்கவும்!"}
      </p>

      {/* Flip Cards Row */}
      <div className="flex gap-6 sm:gap-10 overflow-x-auto px-4 w-full justify-center">
        {subjectsToDisplay.map((subject) => (
          <div
            key={subject.en}
            className="relative w-48 h-64 sm:w-64 sm:h-80 md:w-72 md:h-96 2xl:w-[18vw] 2xl:h-[40vh] [perspective:1000px] flex-shrink-0"
            onClick={() => toggleFlip(subject.en)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                flipped[subject.en] ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              {/* Front */}
              <div
                className={`${subject.color} absolute inset-0 rounded-3xl shadow-xl flex flex-col items-center justify-center [backface-visibility:hidden] p-4 sm:p-6`}
              >
                <img
                  src={subject.gif}
                  alt={subject.en}
                  className="w-24 h-24 sm:w-32 sm:h-32 2xl:w-[8vw] 2xl:h-[8vh] mb-2 sm:mb-4 object-contain"
                />
                <h2 className="text-2xl sm:text-4xl 2xl:text-5xl text-white font-bold text-center drop-shadow-lg">
                  {subject[language]}
                </h2>
              </div>

              {/* Back */}
              <div className="absolute inset-0 rounded-3xl shadow-xl flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden] p-4 sm:p-6 text-gray-800 bg-gradient-to-br from-[#e8f9ff] via-[#c4d9ff] to-[#c5baff]">
                <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-bold text-center mb-2 sm:mb-4">
                  {language === "en"
                    ? `Go to ${subject.en}`
                    : `${subject.ta} க்கு செல்லுங்கள்`}
                </h3>
                <p className="text-sm sm:text-lg 2xl:text-xl text-center mb-4 sm:mb-6">
                  {language === "en"
                    ? `Click below to continue with ${subject.en}.`
                    : `${subject.ta} கொண்டு தொடர கீழே கிளிக் செய்யவும்.`}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/single/${classId}/${displayName}/${subject.en.toLowerCase()}`, {
                      state: { subject: subject.en },
                    });
                  }}
                  className="px-6 py-2 sm:px-8 sm:py-3 bg-white font-bold rounded-full shadow-md hover:bg-gray-100 transition-all transform hover:scale-105 2xl:text-xl"
                  style={{ color: "#2c2c2c" }}
                >
                  {language === "en" ? "Choose Topic" : "பாடத்தைத் தேர்ந்தெடுக்கவும்"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelection;