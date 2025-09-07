import React, { useState } from "react";
import bg from "../assets/bg.jpg";
import single from "../assets/single.png";
import multi from "../assets/multi.png";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    singleFront: "Single Player",
    singleBack:
      "Challenge yourself, beat the clock, and celebrate victory with fun confetti",
    multiFront: "Multi Player",
    multiBack:
      "Compete with friends, race through questions, and enjoy exciting celebrations together.",
    proceed: "Proceed",
    toggle: "தமிழ்", // Button shows opposite language
  },
  ta: {
    singleFront: "ஒரே வீரர்",
    singleBack:
      "உங்களை சவால் செய்யுங்கள், நேரத்தை வெல்லுங்கள், மற்றும் கொண்டாட்ட கான்பெட்டியுடன் வெற்றியை கொண்டாடுங்கள்",
    multiFront: "பல வீரர்கள்",
    multiBack:
      "நண்பர்களுடன் போட்டியிடுங்கள், கேள்விகளை விரைவாக முடிக்கவும், சுவாரஸ்யமான கொண்டாட்டங்களை அனுபவிக்கவும்.",
    proceed: "தொடரவும்",
    toggle: "English",
  },
};

const FlipCard = ({ frontText, backText, image, proceedText, navigateTo }) => {
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
              e.stopPropagation(); // prevent flip on button click
              navigate(navigateTo);
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

const ChooseSorM = () => {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Language Toggle Button */}
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

        {/* Multi Player → XO Game */}
        <FlipCard
          frontText={t.multiFront}
          backText={t.multiBack}
          image={multi}
          proceedText={t.proceed}
          navigateTo="/multiplayer-input"
        />
      </div>
    </div>
  );
};

export default ChooseSorM;
