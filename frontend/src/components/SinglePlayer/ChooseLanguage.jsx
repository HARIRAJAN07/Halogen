import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.jpg";

const ChooseLanguage = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (language) => {
    // Navigate to the topics page, passing the language as a URL parameter
    navigate(`/topics/${language}`);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <h1 className="text-white text-5xl font-bold mb-10">Choose a Language 🌍</h1>
      <div className="flex justify-center items-center w-3/4 h-2/3 gap-10">
        
        {/* English Card */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #8F9FE4, #BACBFE)",
            height: "55%",
          }}
          onClick={() => handleLanguageSelect("english")}
        >
          <span className="text-white text-9xl">🇬🇧</span>
          <h2 className="text-white text-4xl font-bold mt-4">English</h2>
          <p className="text-white text-center mt-2 px-4">
            Proceed with English topics.
          </p>
        </div>

        {/* Tamil Card */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl shadow-lg cursor-pointer transition-transform transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #BCA5D4, #EFE2FA)",
            height: "55%",
          }}
          onClick={() => handleLanguageSelect("tamil")}
        >
          <span className="text-white text-9xl">🇮🇳</span>
          <h2 className="text-white text-4xl font-bold mt-4">தமிழ்</h2>
          <p className="text-white text-center mt-2 px-4">
            தமிழ் தலைப்புகளுடன் தொடரவும்.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseLanguage;