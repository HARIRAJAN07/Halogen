import React, { useState } from "react";
import single from "../assets/single.png";
import multi from "../assets/multi.png";
import { useNavigate } from "react-router-dom";
import FloatingBackground from "./utils/FloatingBackground";
import Logo from "./utils/logo"; // logo component
import LanguageToggle from "./utils/LanguageToggle";

// 🌐 Language translations
const translations = {
  en: {
    singleFront: "SOLO🕹️",
    singleBack: "Challenge yourself, race the clock, and celebrate your win!",
    multiFront: "BATTLE⚔️",
    multiBack: "Compete with friends, answer fast, and celebrate together!",
    proceed: "Proceed",
    toggle: "தமிழ்", // Button shows opposite language
  },
  ta: {
    singleFront: "ஒரே வீரர்🕹️",
    singleBack:
      "உங்களை சவாலில் ஈடுபடுத்தி, நேரத்தை வென்று, வெற்றியை கொண்டாடுங்கள்!",
    multiFront: "நீயா⚔️நானா",
    multiBack: "நண்பர்களுடன் போட்டியிட்டு, வெற்றி கொண்டாடுங்கள்",
    proceed: "தொடரவும்",
    toggle: "English",
  },
};

// 🎴 Flip Card Component
const FlipCard = ({
  frontText,
  backText,
  image,
  proceedText,
  navigateTo,
  imageStyle, // 👈 new prop for custom image size
}) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();

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
        {/* Front Side */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl text-white cursor-pointer transition-all duration-500"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #BACBFE, #C1ddE8)",
            fontSize: "4vh",
            fontWeight: "700",
            height: "40vh",
            color: "#265380",
            boxShadow: "0 0 25px rgba(100, 149, 237, 0.9)", // ✨ constant glow
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
              ...imageStyle, // 👈 override if provided
            }}
          />
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl text-white p-4 transition-all duration-500"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #A1BCEA, #BCA5D4)",
            transform: "rotateY(180deg)",
            fontSize: "2vh",
            color: "#265380",
            boxShadow: "0 0 25px rgba(186, 85, 211, 0.9)", // ✨ constant glow
          }}
        >
          <p className="mb-[10%] text-center font-bold text-[2.5vh]">
            {backText}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // stop flipping
              navigate(navigateTo);
            }}
            className="px-[10%] py-[5%] rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            style={{
              background: "linear-gradient(135deg, #9FD0E4, #DBF8FE)",
              fontSize: "2.2vh",
              fontWeight: "700",
              boxShadow: "0 0 12px rgba(159, 208, 228, 0.9)", // ✨ glowing button
            }}
          >
            {proceedText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChooseSorM = () => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const handleLanguageToggle = () => {
    setLang((prev) => (prev === "en" ? "ta" : "en"));
  };

  return (
    <FloatingBackground>
      {/* ✅ Logo at top-left */}
      <Logo />

      {/* 🎴 Cards Section */}
      <div
        className="flex justify-center items-center -translate-y-[2%]"
        style={{ width: "80%", height: "70%", gap: "10%" }}
      >
        {/* Single Player → Subject Selection */}
        <FlipCard
          frontText={t.singleFront}
          backText={t.singleBack}
          image={single}
          proceedText={t.proceed}
          navigateTo="/single"
        />

        {/* Multi Player → XO Game (zoomed image) */}
        <FlipCard
          frontText={t.multiFront}
          backText={t.multiBack}
          image={multi}
          proceedText={t.proceed}
          navigateTo="/multiplayer-input"
          imageStyle={{ width: "35%", height: "35%" }}
        />
      </div>

      {/* 🌐 Language Toggle */}
      <LanguageToggle currentLanguage={lang} onPress={handleLanguageToggle} />
    </FloatingBackground>
  );
};


export default ChooseSorM;
