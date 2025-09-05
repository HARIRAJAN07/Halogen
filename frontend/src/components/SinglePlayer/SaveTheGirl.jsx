import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import women from "../../assets/womann.png";
import bg from "../../assets/bg.jpg";
import Confetti from "react-confetti";

const questions = [
  { q: "What is 2 + 2?", options: ["3", "4", "5", "6"], a: "4" },
  { q: "Capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], a: "Paris" },
  { q: "5 × 6 = ?", options: ["25", "30", "35", "40"], a: "30" },
  { q: "React library is mainly used for?", options: ["Database", "UI", "Networking", "AI"], a: "UI" },
  { q: "HTML stands for?", options: ["Hyper Trainer Marking Language", "HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language"], a: "HyperText Markup Language" },
];

const SaveTheGirl = () => {
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
      setScore(score + 100); // +100 points per correct answer
      if (currentQ === questions.length - 1) {
        setWin(true);
        setGameOver(true);
      } else {
        setCurrentQ(currentQ + 1);
        setAnswer("");
      }
    } else {
      alert("❌ Wrong Answer! Try again.");
    }
  };

  const waterLevel = ((60 - timeLeft) / 60) * 100;
  const levelProgress = ((currentQ + 1) / questions.length) * 100;

  // Timer circle color
  const timerColor = timeLeft > 30 ? "#8F9FE4" : timeLeft > 15 ? "#BCA5D4" : "red";

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {!gameOver ? (
        <div className="flex flex-col md:flex-row w-[95%] h-[95%] items-center justify-between">
          {/* LEFT SIDE */}
          <div
            style={{
              width: "100%",
              maxWidth: "50%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "3%",
            }}
          >
            {/* HEADER HUD */}
            <div
              style={{
                width: "100%",
                background: "linear-gradient(90deg,#7164B4,#8F9FE4,#BACBFE)",
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
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(90deg, #fff, #fff)",
                  
                }}
              >
                🛡️ SAVE THE GIRL!!!
              </motion.h1>

              {/* Level & Progress */}
              <div style={{ marginTop: "2%", textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "2.5vh",
                    fontWeight: "700",
                    color: "white",
                  }}
                >
                  Level {currentQ + 1}/{questions.length}
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
                      background: "linear-gradient(90deg,#7164B4,#BACBFE)",
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
                ⭐ Score: {score}
              </p>
            </div>

            {/* Timer Circle */}
            <div
              style={{
                marginTop: "5%",
                width: "20vh",
                height: "20vh",
                borderRadius: "50%",
                border: `8px solid ${timerColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3.5vh",
                fontWeight: "700",
                color: "white",
                boxShadow: `0 0 25px ${timerColor}`,
                background: "rgba(255,255,255,0.1)",
              }}
            >
              ⏳ {timeLeft}s
            </div>

            {/* Tank */}
            <div
              style={{
                position: "relative",
                width: "70%",
                height: "55%",
                borderWidth: "6px",
                borderColor: "#7164B4",
                borderRadius: "20px",
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.1)",
                boxShadow: "0 0 25px rgba(113,100,180,0.7)",
                marginTop: "4%",
                
              }}
            >
              {/* Water rising */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  background: "linear-gradient(to top, #8F9FE4, #BACBFE)",
                  zIndex: 20,
                  height: `${waterLevel}%`,
                  opacity: 0.7,
                }}
              />

              {/* Character */}
              <img
                src={women}
                alt="character"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20%]"
              />
            </div>
          </div>

          {/* RIGHT SIDE - Quiz */}
          <div
            style={{
              width: "100%",
              maxWidth: "50%",
              height: "70%",
              background: "linear-gradient(135deg, #ffffff, #BACBFE)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "30px",
              boxShadow: "0px 6px 20px rgba(0,0,0,0.3)",
              padding: "3%",
            }}
          >
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
                        ? "linear-gradient(135deg, #7164B4, #8F9FE4)"
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
                background: "linear-gradient(90deg,#7164B4,#BCA5D4)",
                color: "white",
                padding: "2% 5%",
                borderRadius: "20px",
                fontSize: "2.8vh",
                fontWeight: "700",
                marginTop: "6%",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
              }}
            >
              Submit ✅
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white p-[5%] rounded-[3vh] shadow-2xl">
          {win ? (
            <>
              <h1 className="text-[5vh] font-bold text-green-600 mb-[2%]">
                🎉 You Saved Them!
              </h1>
              <Confetti />
            </>
          ) : (
            <h1 className="text-[5vh] font-bold text-red-600">
              💀 The Character Drowned!
            </h1>
          )}
          <button
            className="bg-gradient-to-r from-[#7164B4] to-[#8F9FE4] text-white px-[6%] py-[2%] rounded-[2vh] mt-[5%] text-[2.5vh] font-bold"
            onClick={() => {
              setCurrentQ(0);
              setAnswer("");
              setTimeLeft(60);
              setGameOver(false);
              setWin(false);
              setScore(0);
            }}
          >
            🔄 Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SaveTheGirl;
