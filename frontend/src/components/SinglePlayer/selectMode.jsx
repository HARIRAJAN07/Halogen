import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ import navigation + params
import bg from "../../assets/bg.jpg";
import match from "../../assets/match.png";
import surprise from "../../assets/surprise.png";

// 🔄 Translations for English & Tamil
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

const FlipCard = ({ frontText, backText, image, proceedText, navigateTo }) => {
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const { classId,displayName, subject } = useParams(); // ✅ get params from route
  const classKey = `class${classId}`
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
        className={`relative w-full h-full transition-transform duration-700`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-lg text-white cursor-pointer"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #8F9FE4, #BACBFE)",
            fontSize: "4vh",
            fontWeight: "700",
            height: "40vh",
          }}
        >
          {frontText}
          <img
            src={image}
            alt=""
            style={{ width: "30%", height: "30%", margin: "6% 0% 0% 0%" }}
          />
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-lg text-white p-4"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #BCA5D4, #EFE2FA)",
            transform: "rotateY(180deg)",
            fontSize: "2vh",
          }}
        >
          <p className="mb-[10%] text-center font-bold text-[2.5vh]">
            {backText}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent flipping again
              navigate(`/single/${classId}/${displayName}/${subject}${navigateTo}`);
            }}
            className="px-[10%] py-[5%] rounded-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7164B4, #8F9FE4)",
              fontSize: "2.2vh",
              fontWeight: "700",
            }}
          >
            {proceedText}
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectMode = () => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* 🌐 Language Toggle Button */}
      <button
        onClick={() => setLang(lang === "en" ? "ta" : "en")}
        className="absolute top-5 right-5 px-4 py-2 rounded-xl shadow-lg font-bold"
        style={{
          background: "linear-gradient(135deg, #FFB347, #FFCC33)",
          fontSize: "2vh",
        }}
      >
        {t.toggle}
      </button>

      {/* Cards */}
      <div
        className="flex justify-center items-center"
        style={{ width: "80%", height: "70%", gap: "10%", textAlign: "center" }}
      >
        {/* Surprise Game → /game */}
        <FlipCard
          frontText={t.surpriseFront}
          backText={t.surpriseBack}
          image={surprise}
          proceedText={t.proceed}
          navigateTo="/game"
        />

        {/* Match Game → /match */}
        <FlipCard
          frontText={t.matchFront}
          backText={t.matchBack}
          image={match}
          proceedText={t.proceed}
          navigateTo="/match"
        />
      </div>
    </div>
  );
};

export default SelectMode;
