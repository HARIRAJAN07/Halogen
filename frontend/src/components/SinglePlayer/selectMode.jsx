import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import surprise from "../../assets/surprise.png";
import match from "../../assets/match.png";

import FloatingBackground from "../utils/FloatingBackground"; // ✅ background
import Logo from "../utils/logo"; // ✅ logo
import LanguageToggle from "../utils/LanguageToggle";
import BackButton from "../utils/backbutton";
import Footer from "../utils/Footer";

// 🌐 Translations
const translations = {
  en: {
    surpriseFront: "Surprise Game",
    surpriseBack:
      "A hidden challenge is revealed randomly. Learners play to test knowledge and win rewards.",
    matchFront: "Link & Learn",
    matchBack:
      "Questions or terms are listed on the left side. Learners match them with corresponding answers on the right.",
    proceed: "Proceed",
    toggle: "தமிழ்",
  },
  ta: {
    surpriseFront: "அதிர்ச்சி விளையாட்டு",
    surpriseBack:
      "ஒரு மறைந்த சவால் சீரற்ற முறையில் வெளிப்படுத்தப்படுகிறது. கற்றவர்கள் அறிவைப் பரிசோதித்து பரிசுகளை வெல்ல விளையாடுகிறார்கள்.",
    matchFront: "இணைத்து கற்போம்",
    matchBack:
      "கேள்விகள் அல்லது சொற்கள் இடது பக்கத்தில் பட்டியலிடப்பட்டுள்ளன. கற்றவர்கள் அவற்றை வலது பக்கத்தில் உள்ள பதில்களுடன் பொருத்துகிறார்கள்.",
    proceed: "தொடரவும்",
    toggle: "English",
  },
};

// 🎴 FlipCard
const FlipCard = ({ frontText, backText, image, proceedText, navigateTo }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const { classId, displayName, schoolName, subject } = useParams();

  return (
    <div
      className="relative"
      style={{
        width: "25%",
        height: "55%",
        margin: "2%",
      }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl text-white cursor-pointer"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #BACBFE, #C1ddE8)",
            fontSize: "4vh",
            fontWeight: "700",
            height: "40vh",
            color: "#265380",
          }}
        >
          {frontText}
          <img
            src={image}
            alt=""
            style={{
              width: "30%",
              height: "30%",
              margin: "6% 0 0 0",
            }}
          />
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl text-white p-4"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #A1BCEA, #BCA5D4)",
            transform: "rotateY(180deg)",
            fontSize: "2vh",
            color: "#265380",
          }}
        >
          <p className="mb-[10%] text-center font-bold text-[2.5vh]">{backText}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                // If subject is "english" or "tamil", skip language selection page and go directly to topic selection page,
                // passing subject itself as language input
                ((subject?.toLowerCase() === "english" || subject?.toLowerCase() === "tamil") && navigateTo==="/lang" )
                  ? `/single/${classId}/${displayName}/${schoolName}/${subject}/lang/${subject}`
                  : `/single/${classId}/${displayName}/${schoolName}/${subject}${navigateTo}`
              );
            }}
            className="px-[10%] py-[5%] rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            style={{
              background: "linear-gradient(135deg, #9FD0E4, #DBF8FE)",
              fontSize: "2.2vh",
              fontWeight: "700",
              boxShadow: "0 0 12px rgba(159, 208, 228, 0.9)",
            }}
          >
            {proceedText}
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎯 Main Component
const SelectMode = () => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const handleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ta" : "en"));
  };

  return (
    <FloatingBackground>
      {/* ✅ Logo at top-left */}
      <Logo />

      {/* 🎴 Cards Section (same size & position as before) */}
      <div
        className="flex justify-center items-center"
        style={{
          width: "80%",
          height: "70%",
          gap: "10%",
          textAlign: "center",
        }}
      >
        {/* Surprise Game */}
        <FlipCard
          frontText={t.surpriseFront}
          backText={t.surpriseBack}
          image={surprise}
          proceedText={t.proceed}
          navigateTo="/game"
        />

        {/* Match Game */}
        <FlipCard
          frontText={t.matchFront}
          backText={t.matchBack}
          image={match}
          proceedText={t.proceed}
          navigateTo="/lang"
        />
      </div>
      <Footer />
      <BackButton />
      <LanguageToggle currentLanguage={lang} onPress={handleLanguage} />
    </FloatingBackground>
  );
};

export default SelectMode;
