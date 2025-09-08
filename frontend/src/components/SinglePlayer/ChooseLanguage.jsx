import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../utils/FloatingBackground";
import BackButton from "../utils/backbutton";
import Footer from "../utils/Footer";
import Logo from "../utils/logo";

const ChooseLanguage = () => {
  const navigate = useNavigate();
  const { classId, displayName, schoolName, subject } = useParams();

  const handleLanguageSelect = (language) => {
    navigate(`/single/${classId}/${displayName}/${schoolName}/${subject}/lang/${language}`);
  };

  return (
    <Background>
      <Logo />
      <div
        className="min-h-screen flex items-center justify-center w-full"
        style={{
          padding: "15%",
        }}
      >
        <div className="bg-gradient-to-br from-[#BACBFE] to-[#C1DDE8]
"
          style={{
            width: "100%",
            maxWidth: "80%",
            borderRadius: "3%",
            boxShadow: "0 1.25rem 3rem rgba(0, 0, 0, 0.2)",
            padding: "12%",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "4vh",
              fontWeight: "800",
              marginBottom: "4%",
              color: "black",
              textShadow: "0 0.125rem 0.125rem rgba(0, 0, 0, 0.1)",
            }}
          >
            🌐 Choose Language
          </h1>
          <p
            style={{
              fontSize: "2vh",
              color: "#4B5563",
              marginBottom: "8%",
            }}
          >
            Do you want the questions in Tamil or English?
          </p>
          <div
            style={{
              display: "flex",
             
              gap: "8%",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => handleLanguageSelect("english")}
              style={{
                padding: "6% 16%",
                backgroundColor: "white", // bg-indigo-600
                color: "black",
                borderRadius: "1.25rem",
                boxShadow: "0 0.25rem 0.75rem rgba(79, 70, 229, 0.4)",
                fontSize: "4vh",
                fontWeight: "600",
                transition: "background-color 0.3s",
                cursor: "pointer",
              }}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => handleLanguageSelect("tamil")}
              style={{
                 padding: "6% 16%",
                backgroundColor: "white", // bg-green-600
                color: "black",
                borderRadius: "1.25rem",
                boxShadow: "0 0.25rem 0.75rem rgba(22, 163, 74, 0.4)",
                fontSize: "4vh",
                fontWeight: "600",
                transition: "background-color 0.3s",
                cursor: "pointer",
              }}
              >
              🇮🇳 Tamil
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <BackButton />
    </Background>
  );
};

export default ChooseLanguage;
