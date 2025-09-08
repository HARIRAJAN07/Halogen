import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import FloatingBackground from "../utils/FloatingBackground";
import LanguageToggle from "../utils/LanguageToggle";

import scienceGif from "../../assets/science.gif";
import mathGif from "../../assets/math.gif";
import socialGif from "../../assets/social.gif";
import tamilGif from "../../assets/tamil.gif";
import englishGif from "../../assets/english.gif";
import physicsGif from "../../assets/physics.gif";
import chemistryGif from "../../assets/chemistry.gif";
import biologyGif from "../../assets/biology.gif";
import csGif from "../../assets/cs.gif";
import Logo from "../utils/logo";

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
  { en: "Math", ta: "கணிதம்", gif: mathGif, color: "bg-[#BCA5D4]" },
];

const SubjectSelection = () => {
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const { classId, displayName, schoolName } = useParams();

  // Determine if the class is higher grade (11 or 12)
  const classNumber = parseInt(classId, 10);
  const isHigherGrade = classNumber >= 11 && classNumber <= 12;

  // Select appropriate subject array
  const subjectsToDisplay = isHigherGrade ? subjectsForHigherGrades : subjectsForGrades6to10;

  const handleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ta" : "en"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundColor: "#EFE2FA" }}>
      {/* Background Layer */}
      <FloatingBackground>
        <Logo />
        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-[2vw]">
          {/* Language Toggle Button */}
          {/* (Assuming LanguageToggle renders toggle and calls handleLanguage) */}

          {/* Heading */}
          <h1 className="text-[7vh] font-extrabold text-center text-black mb-[1vh] sm:mb-[1vh] drop-shadow-sm">
            {language === "en" ? "Choose Your Subject" : "உங்கள் பாடத்தைத் தேர்வு செய்யுங்கள்"}
          </h1>
          <p className="text-[4vh] text-gray-700 text-center mb-[5vh] sm:mb-[10vh]">
            {language === "en" ? "Click any card to begin!" : "தொடங்க எந்த கார்டையும் கிளிக் செய்யவும்!"}
          </p>

          {/* Subjects */}
          <div className="flex flex-row justify-center gap-[3vw] w-full max-w-[95vw] flex-wrap mb-[7vh]">
            {subjectsToDisplay.map((item, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center justify-center rounded-[2vh] overflow-hidden cursor-pointer"
                style={{ width: "15vw", height: "30vh", marginBottom: "12vh" }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() =>
                  navigate(`/single/${classId}/${displayName}/${schoolName}/${item.en.toLowerCase()}`, {
                    state: { subject: item.en },
                  })
                }
              >
                <div
                  className={`${item.color} absolute inset-0 rounded-[2vh] shadow-xl flex flex-col items-center justify-center p-[2vh]`}
                >
                  <img src={item.gif} alt={item.en} className="w-[8vw] h-[10vh] mb-[2vh] object-contain" />
                  <h2 className="text-[2.5vh] font-bold text-white text-center drop-shadow-lg">{item[language]}</h2>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <LanguageToggle currentLanguage={language} onPress={handleLanguage} />
      </FloatingBackground>
    </div>
  );
};

export default SubjectSelection;
