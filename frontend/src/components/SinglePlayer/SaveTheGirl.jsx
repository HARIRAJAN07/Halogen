// ✅ UPDATED SaveTheGirl with requested changes
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import women from "../../assets/womann.png";
import bg from "../../assets/bg.jpg";
import ConfettiExplosion from "react-confetti-explosion";
import { Fireworks } from "@fireworks-js/react";
import Confetti from "react-confetti";


// English & Tamil Questions
const questionsData = {
  en: [
    { q: "What is 2 + 2?", options: ["3", "4", "5", "6"], a: "4" },
    { q: "Capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], a: "Paris" },
    { q: "5 × 6 = ?", options: ["25", "30", "35", "40"], a: "30" },
    { q: "React library is mainly used for?", options: ["Database", "UI", "Networking", "AI"], a: "UI" },
    { q: "HTML stands for?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language"], a: "HyperText Markup Language" },
  ],
  ta: [
    { q: "2 + 2 = ?", options: ["3", "4", "5", "6"], a: "4" },
    { q: "பிரான்சின் தலைநகர்?", options: ["பெர்லின்", "மாட்ரிட்", "பாரிஸ்", "ரோம்"], a: "பாரிஸ்" },
    { q: "5 × 6 = ?", options: ["25", "30", "35", "40"], a: "30" },
    { q: "React நூலகம் எதற்காக?", options: ["தரவுத்தளம்", "UI", "நெட்வொர்க்", "AI"], a: "UI" },
    { q: "HTML என்பதன் விரிவாக்கம்?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language"], a: "HyperText Markup Language" },
  ],
};

const SaveTheGirl = () => {
  const [lang, setLang] = useState("en"); 
  const questions = questionsData[lang];

  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = () => {
    if (answer.trim().toLowerCase() === questions[currentQ].a.toLowerCase()) {
      setScore(score + 100);
      if (currentQ === questions.length - 1) {
        setWin(true);
        setGameOver(true);
      } else {
        setCurrentQ(currentQ + 1);
        setAnswer("");
      }
    } else {
      alert(lang === "en" ? "❌ Wrong Answer! Try again." : "❌ தவறான பதில்! மீண்டும் முயற்சி செய்யவும்.");
    }
  };

  const waterLevel = ((60 - timeLeft) / 60) * 100;
  const levelProgress = ((currentQ + 1) / questions.length) * 100;
  const timerColor = timeLeft > 30 ? "#BCA5D4" : timeLeft > 15 ? "#EFE2FA" : "red";

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {!gameOver ? (
        <div className="flex flex-col md:flex-row w-[95%] h-[95%] items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex flex-col items-center justify-between w-full max-w-[50%] h-full p-[3%]">
            {/* HEADER HUD */}
            <div
              style={{
                width: "100%",
                background: "linear-gradient(90deg,#BCA5D4,#EFE2FA)",
                borderRadius: "20px",
                padding: "2%",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.4)",
                textAlign: "center",
              }}
            >
              <motion.h1
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{
                  fontSize: "5vh",
                  fontWeight: "800",
                  color: "#fff",
                  textShadow: "0px 2px 6px rgba(0,0,0,0.6)",
                }}
              >
                🛡️ {lang === "en" ? "SAVE THE GIRL!!!" : "பெண்ணை காப்பாற்றுங்கள்!!!"}
              </motion.h1>

              {/* Level & Progress */}
              <div style={{ marginTop: "2%", textAlign: "center" }}>
                <p style={{ fontSize: "2.5vh", fontWeight: "700", color: "white" }}>
                  {lang === "en" ? "Level" : "நிலை"} {currentQ + 1}/{questions.length}
                </p>
                <div
                  style={{
                    width: "100%",
                    height: "2vh",
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: "10px",
                    marginTop: "1%",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg,#BCA5D4,#EFE2FA)",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              </div>

              {/* Score */}
              <p
                style={{
                  marginTop: "2%",
                  fontSize: "2.3vh",
                  fontWeight: "700",
                  color: "#fff",
                  textShadow: "0px 2px 6px rgba(0,0,0,0.4)",
                }}
              >
                ⭐ {lang === "en" ? "Score" : "மதிப்பெண்"}: {score}
              </p>
            </div>

            {/* Tank (increased 10%) */}
            <div
              style={{
                position: "relative",
                width: "77%", // increased from 70%
                height: "55%", // increased from 55%
                borderWidth: "6px",
                borderColor: "#BCA5D4",
                borderRadius: "20px",
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 0 25px rgba(188,165,212,0.7)",
                marginTop: "4%",
              }}
            >
              {/* Water rising (blue gradient) */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  background: "linear-gradient(to top, #1E3A8A, #3B82F6)", // 🔵 blue tones
                  zIndex: 20,
                  height: `${waterLevel}%`,
                  opacity: 0.7,
                }}
              />

              {/* Character */}
              <img
                src={women}
                alt="character"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%]"
              />
            </div>
          </div>

          {/* RIGHT SIDE - Quiz */}
          <div
            style={{
              width: "100%",
              height: "70%",
              background: "linear-gradient(135deg, #ffffff, #EFE2FA)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "30px",
              boxShadow: "0px 6px 20px rgba(0,0,0,0.3)",
              padding: "3%",
            }}
          >
            {/* ✅ Timer moved to top-right */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "5%",
              }}
            >
              <div
                style={{
                  width: "15vh",
                  height: "15vh",
                  borderRadius: "50%",
                  border: `6px solid ${timerColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5vh",
                  fontWeight: "700",
                  color: "black",
                  boxShadow: `0 0 20px ${timerColor}`,
                  background: "rgba(0,0,0,0)",
                }}
              >
                ⏳ {timeLeft}s
              </div>
            </div>

            <p style={{ fontSize: "4vh", fontWeight: "700", marginBottom: "4%" }}>
              {questions[currentQ].q}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "4%",
                width: "100%",
                justifyItems: "center",
              }}
            >
              {questions[currentQ].options.map((opt, i) => {
                const isSelected = answer === opt;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAnswer(opt)}
                    style={{
                      width: "90%",
                      height: "8vh",
                      background: isSelected
                        ? "linear-gradient(135deg, #BCA5D4, #EFE2FA)"
                        : "#e5e7eb",
                      color: isSelected ? "white" : "black",
                      fontSize: "2.5vh",
                      fontWeight: "600",
                      borderRadius: "15px",
                      boxShadow: isSelected
                        ? "0px 4px 15px rgba(113,100,180,0.6)"
                        : "0px 2px 6px rgba(0,0,0,0.2)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="mt-[5%]"
              onClick={handleSubmit}
              style={{
                background: "linear-gradient(90deg,#BCA5D4,#EFE2FA)",
                color: "white",
                padding: "2% 5%",
                borderRadius: "20px",
                fontSize: "2.8vh",
                fontWeight: "700",
                marginTop: "6%",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              {lang === "en" ? "Submit ✅" : "சமர்ப்பிக்கவும் ✅"}
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white p-[5%] rounded-[3vh] shadow-2xl">
          {win ? (
            <>
              <h1 className="text-[5vh] font-bold text-green-600 mb-[2%]">
                🎉 {lang === "en" ? "You Saved Her!" : "நீங்கள் காப்பாற்றினீர்கள்!"}
              </h1>
              <Confetti />
              <div style={{ position: "absolute", zIndex: 10 }}>
                <ConfettiExplosion force={0.7} duration={4500} particleCount={150} width={1200} />
              </div>
              <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <Fireworks
                  options={{
                    rocketsPoint: { min: 50, max: 50 },
                    hue: { min: 0, max: 360 },
                    delay: { min: 30, max: 60 },
                    speed: 5,
                    acceleration: 1.05,
                    friction: 0.95,
                    gravity: 1.5,
                    particles: 100,
                    trace: 3,
                    explosion: 6,
                  }}
                  style={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                  }}
                />
              </div>
            </>
          ) : (
            <h1 className="text-[5vh] font-bold text-red-600">
              💀 {lang === "en" ? "The Character Drowned!" : "பாத்திரம் மூழ்கியது!"}
            </h1>
          )}
          <button
            className="bg-gradient-to-r from-[#BCA5D4] to-[#EFE2FA] text-white px-[6%] py-[2%] rounded-[2vh] mt-[5%] text-[2.5vh] font-bold"
            onClick={() => {
              setCurrentQ(0);
              setAnswer("");
              setTimeLeft(60);
              setGameOver(false);
              setWin(false);
              setScore(0);
            }}
          >
            🔄 {lang === "en" ? "Play Again" : "மீண்டும் விளையாடவும்"}
          </button>
        </div>
      )}

      {/* 🔘 Toggle Button Bottom-Right */}
      <button
        onClick={() => setLang(lang === "en" ? "ta" : "en")}
        className="absolute bottom-5 right-5 px-5 py-3 rounded-[2vh] text-[2.5vh] font-bold text-white"
        style={{
          background: "linear-gradient(90deg,#BCA5D4,#EFE2FA)",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        {lang === "en" ? "தமிழ்" : "English"}
      </button>
    </div>
  );
};

export default SaveTheGirl;
