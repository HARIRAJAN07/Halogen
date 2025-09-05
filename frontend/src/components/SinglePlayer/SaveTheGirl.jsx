import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import women from "../images/womann.png";
import bg from "../images/bg.jpg";
import Confetti from "react-confetti";

const questions = [
  {
    q: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    a: "4",
  },
  {
    q: "Capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    a: "Paris",
  },
  {
    q: "5 × 6 = ?",
    options: ["25", "30", "35", "40"],
    a: "30",
  },
  {
    q: "React library is mainly used for?",
    options: ["Database", "UI", "Networking", "AI"],
    a: "UI",
  },
  {
    q: "HTML stands for?",
    options: [
      "Hyper Trainer Marking Language",
      "HyperText Markup Language",
      "HighText Machine Language",
      "HyperTool Multi Language",
    ],
    a: "HyperText Markup Language",
  },
];

const SaveTheGirl = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // Timer countdown
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
      if (currentQ === questions.length - 1) {
        setWin(true);
        setGameOver(true);
      } else {
        setCurrentQ(currentQ + 1);
        setAnswer("");
      }
    } else {
      alert("Wrong Answer! Try again.");
    }
  };

  // Water fill percentage
  const waterLevel = ((60 - timeLeft) / 60) * 100;

  return (
    <div
      className="flex  items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {!gameOver ? (
        <>
          <div
            style={{
              width: "50%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "6vh", textAlign: "center", color:"white",fontWeight:"700",margin:"1% 0% 1% 0%" }}>
              Save the Paapa!!!
            </h1>
            <h1 style={{ fontSize: "5vh", textAlign: "center" ,fontWeight:"500",margin:"1% 0% 2% 0%"}}>
              TIME LEFT : {timeLeft} sec
            </h1>
            {/* Tank */}
            <div
              style={{
                position: "relative",
                width: "50%",
                height: "60%",
                borderWidth: "4px",
                borderColor: "#1d4ed8", // Tailwind blue-700
                borderRadius: "0.5rem", // rounded-lg ≈ 8px
                overflow: "hidden",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-xl
                textAlign: "center",
              }}
            >
              {/* Water rising */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  backgroundColor: "#60a5fa", // Tailwind bg-blue-400
                  zIndex: 20,
                  height: `${waterLevel}%`,
                  opacity: 0.5,
                }}
              />

              {/* Character (woman image inside the tank) */}
              <img
                src={women}
                alt="character"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] "
              />
            </div>
          </div>
         <div style={{ width: "50%", height: "100vh" }} className="flex justify-center items-center">
            <div
                style={{
                width: "80%",
                height: "45vh",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius:"30px",
                }}
            >
                <p style={{ fontSize: "4vh" , fontWeight:"700" }}>{questions[currentQ].q}</p>

                {/* ✅ Wrap all options in one grid */}
                <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr", // 2 columns
                    gap: "1rem", // spacing between buttons
                    marginTop: "1rem",
                    width: "100%",
                    justifyItems: "center",
                }}
                >
                {questions[currentQ].options.map((opt, i) => {
                const isSelected = answer === opt; // check if current option is selected
                return (
                    <button
                    key={i}
                    onClick={() => setAnswer(opt)}
                    style={{
                        width: "80%",
                        height: "60px",
                        backgroundColor: isSelected ? "#60a5fa" : "#e5e7eb", // blue-400 if selected, gray-200 default
                        color: isSelected ? "white" : "black",
                        borderRadius: "0.375rem",
                        transition: "all 0.2s ease",
                    }}
                    >
                    {opt}
                    </button>
                );
                })}

                </div>

                <button
                className="bg-green-500 text-white px-[4%] py-[2%] rounded mt-[5%] font-bold text-[2.5vh]"
                onClick={handleSubmit}
                >
                Submit
                </button>
            </div>
            </div>
        </>
      ) : (
        <div className="text-center bg-white p-6 rounded-xl shadow-lg ">
          {win ? (
            <>
            <h1 className="text-3xl font-bold text-green-600">
              🎉 You Saved Them!
            </h1>
            <Confetti />
            </>
          ) : (
            <h1 className="text-3xl font-bold text-red-600">
              💀 The Character Drowned!
            </h1>
          )}
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded mt-4"
            onClick={() => {
              setCurrentQ(0);
              setAnswer("");
              setTimeLeft(60); // reset to 1 minute
              setGameOver(false);
              setWin(false);
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SaveTheGirl;
