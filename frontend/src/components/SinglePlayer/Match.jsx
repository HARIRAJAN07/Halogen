import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import matchData from "../../data/match.json"; // adjust path as needed

const Match = () => {
  const { classId, subject, topic } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [shuffledDefs, setShuffledDefs] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [userPairs, setUserPairs] = useState({});
  const [pairColors, setPairColors] = useState({});
  const [correctCount, setCorrectCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [timerRunning, setTimerRunning] = useState(true);
  const timerRef = useRef(null);

  // Helper functions remain the same
  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const pickRandom = (arr, n) =>
    shuffleArray(arr).slice(0, Math.min(n, arr.length));

  // Fetch and filter questions
  useEffect(() => {
    if (!classId || !subject || !topic) return;

    const filtered = matchData.filter(
      (q) =>
        q.class === parseInt(classId) &&
        q.subject.toLowerCase() === subject.toLowerCase() &&
        q.topic.toLowerCase() === topic.toLowerCase() &&
        q.type === "match"
    );

    const easy = pickRandom(filtered.filter((q) => q.difficulty === "easy"), 2);
    const medium = pickRandom(
      filtered.filter((q) => q.difficulty === "medium"),
      2
    );
    const hard = pickRandom(filtered.filter((q) => q.difficulty === "hard"), 1);
    let selected = [...easy, ...medium, ...hard];

    if (selected.length < 5) {
      const remaining = filtered.filter((q) => !selected.includes(q));
      const fill = pickRandom(remaining, 5 - selected.length);
      selected = [...selected, ...fill];
    }
    setQuestions(shuffleArray(selected));
  }, [classId, subject, topic]);

  // Shuffle definitions when a new question is loaded
  useEffect(() => {
    if (questions.length > 0) {
      const currentMatches = questions[currentQ].matches;
      setShuffledDefs(shuffleArray(currentMatches.map((m) => m.definition)));
    }
  }, [questions, currentQ]);

  // Timer logic
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      // Logic for time up
      setShowPopup(true);
      setIsCorrect(false); // Treat as wrong if time runs out
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]);

  // Handle term selection
  const handleTermSelect = (term) => {
    if (userPairs[term]) return;
    setSelectedTerm(term);
  };

  // Handle definition selection and pairing
  const handleDefinitionSelect = (definition) => {
    if (!selectedTerm || Object.values(userPairs).includes(definition)) return;

    const newColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
    const newPair = { [selectedTerm]: definition };

    setUserPairs((prev) => ({ ...prev, ...newPair }));
    setPairColors((prev) => ({ ...prev, [selectedTerm]: newColor }));
    setSelectedTerm(null);
  };

  // Check the user's answers against the correct ones
  const checkAnswers = () => {
    setTimerRunning(false);
    let allCorrect = true;
    const currentMatches = questions[currentQ].matches;
    for (const term in userPairs) {
      const correctDef = currentMatches.find(
        (m) => m.term.toLowerCase() === term.toLowerCase()
      )?.definition;
      if (!correctDef || userPairs[term].toLowerCase() !== correctDef.toLowerCase()) {
        allCorrect = false;
        break;
      }
    }
    setIsCorrect(allCorrect);
    setShowPopup(true);
  };

  // Move to the next question without checking
  const handleNext = () => {
    if (showPopup) {
      setShowPopup(false);
      setTimerRunning(true);
      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }
    }

    const nextQ = currentQ + 1;
    if (nextQ < questions.length) {
      setCurrentQ(nextQ);
      setUserPairs({});
      setPairColors({});
      setSelectedTerm(null);
    } else {
      // Game Over Screen
      setShowPopup(true); // Show final score popup
      setIsCorrect(true); // A bit of a hack, but this will display the end game screen
      setTimerRunning(false);
    }
  };

  const handleTryAgain = () => {
    setShowPopup(false);
    setTimerRunning(true);
    setUserPairs({});
    setPairColors({});
    setSelectedTerm(null);
  };

  const handlePlayAgain = () => {
    setCurrentQ(0);
    setCorrectCount(0);
    setUserPairs({});
    setPairColors({});
    setSelectedTerm(null);
    setTimeLeft(180);
    setTimerRunning(true);
    setShowPopup(false);
  };

  const handleGoToDashboard = () => {
    navigate("/");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-[3vh] font-bold text-gray-600">
          Loading questions...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQ];
  const terms = currentQuestion.matches.map((m) => m.term);
  const allPaired = Object.keys(userPairs).length === terms.length;
  const isGameOver = currentQ === questions.length - 1 && showPopup && isCorrect;

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-[5%] relative">
      <div className="absolute top-[2%] right-[5%] text-[3vh] font-bold text-gray-700">
        Timer: {formatTime(timeLeft)}
      </div>

      {isGameOver ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-6">
              You got {correctCount} out of {questions.length} questions correct.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleGoToDashboard}
                className="px-6 py-3 rounded-lg text-white font-bold bg-gray-500 hover:bg-gray-600 transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handlePlayAgain}
                className="px-6 py-3 rounded-lg text-white font-bold bg-blue-500 hover:bg-blue-600 transition"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-[2vh] p-[3%] w-full max-w-[80%]">
          <h1 className="text-[4vh] font-extrabold mb-[1%] text-center">
            {currentQuestion.question}
          </h1>
          <p className="text-[2vh] text-gray-600 text-center mb-[2%]">
            Difficulty:{" "}
            <span className="font-bold capitalize">
              {currentQuestion.difficulty}
            </span>{" "}
            | Q {currentQ + 1}/{questions.length}
          </p>

          <div className="flex w-full justify-between gap-[5%]">
            <div className="w-[45%] flex flex-col gap-[2%]">
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => handleTermSelect(term)}
                  className="w-full py-[3%] border-2 rounded-[1.5vh] text-[2.5vh] font-semibold transition"
                  style={{
                    backgroundColor: pairColors[term]
                      ? pairColors[term]
                      : selectedTerm === term
                      ? "#ddd6fe"
                      : "#ffffff",
                    borderColor: "#e2e8f0",
                    cursor: pairColors[term] ? "not-allowed" : "pointer",
                  }}
                  disabled={!!pairColors[term]}
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="w-[45%] flex flex-col gap-[2%]">
              {shuffledDefs.map((definition) => {
                const matchedTerm = Object.keys(userPairs).find(
                  (t) => userPairs[t] === definition
                );
                return (
                  <button
                    key={definition}
                    onClick={() => handleDefinitionSelect(definition)}
                    disabled={!selectedTerm || matchedTerm}
                    className="w-full py-[3%] border-2 rounded-[1.5vh] text-[2.5vh] transition"
                    style={{
                      backgroundColor: matchedTerm
                        ? pairColors[matchedTerm]
                        : "#ffffff",
                      borderColor: "#e2e8f0",
                      cursor:
                        !selectedTerm || matchedTerm ? "not-allowed" : "pointer",
                    }}
                  >
                    {definition}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-[4%]">
            <button
              onClick={checkAnswers}
              disabled={!allPaired}
              className={`px-[5%] py-[2%] rounded-[2vh] text-white font-bold text-[2.5vh] transition ${
                !allPaired
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105"
              }`}
            >
              Check Answers
            </button>
            <button
              onClick={() => handleNext()}
              className="px-[5%] py-[2%] rounded-[2vh] text-white font-bold text-[2.5vh] bg-blue-500 hover:scale-105 transition"
            >
              Next ➡️
            </button>
          </div>
        </div>
      )}

      {showPopup && !isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
            {isCorrect ? (
              <>
                <h2 className="text-3xl font-bold mb-4">You are correct! 🎉</h2>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-lg text-white font-bold bg-green-500 hover:bg-green-600 transition"
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4">Oops, you are wrong! 😔</h2>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleTryAgain}
                    className="px-6 py-3 rounded-lg text-white font-bold bg-red-500 hover:bg-red-600 transition"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-lg text-white font-bold bg-blue-500 hover:bg-blue-600 transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Match;