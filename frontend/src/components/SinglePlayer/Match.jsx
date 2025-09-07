import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import matchData from "../../data/match.json"; // adjust path as needed

const Match = () => {
  const { classId, subject, topic } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [shuffledDefs, setShuffledDefs] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const [termColors, setTermColors] = useState({});
  const [score, setScore] = useState(0);

  // helper: shuffle array
  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // pick N random items
  const pickRandom = (arr, n) =>
    shuffleArray(arr).slice(0, Math.min(n, arr.length));

  useEffect(() => {
    if (!classId || !subject || !topic) return;

    // filter relevant questions
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

    // if less than 5, fill with random from remaining pool
    if (selected.length < 5) {
      const remaining = filtered.filter((q) => !selected.includes(q));
      const fill = pickRandom(remaining, 5 - selected.length);
      selected = [...selected, ...fill];
    }

    // final shuffle to avoid fixed order
    setQuestions(shuffleArray(selected));
  }, [classId, subject, topic]);

  // shuffle definitions only when a new question is loaded
  useEffect(() => {
    if (questions.length > 0) {
      const currentMatches = questions[currentQ].matches;
      setShuffledDefs(shuffleArray(currentMatches.map((m) => m.definition)));
    }
  }, [questions, currentQ]);

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

  const handleTermSelect = (term) => {
    setSelectedTerm(term);
  };

  const handleDefinitionSelect = (definition) => {
    if (!selectedTerm) return;

    const correctPair = currentQuestion.matches.find(
      (m) =>
        m.term.toLowerCase() === selectedTerm.toLowerCase() &&
        m.definition.toLowerCase() === definition.toLowerCase()
    );

    const color =
      termColors[selectedTerm] ||
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;

    if (correctPair) {
      setUserMatches((prev) => ({
        ...prev,
        [selectedTerm]: definition,
      }));
      setTermColors((prev) => ({ ...prev, [selectedTerm]: color }));
      setScore((prev) => prev + 100);
    }

    setSelectedTerm(null);
  };

  const allMatched =
    Object.keys(userMatches).length === currentQuestion.matches.length;

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedTerm(null);
      setUserMatches({});
      setTermColors({});
    } else {
      alert(`🎉 Finished! Your score: ${score}`);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-[5%]">
      {/* Question Card */}
      <div className="bg-white shadow-xl rounded-[2vh] p-[3%] w-full max-w-[80%]">
        {/* Header */}
        <h1 className="text-[4vh] font-extrabold mb-[1%] text-center">
          {currentQuestion.question}
        </h1>
        <p className="text-[2vh] text-gray-600 text-center mb-[2%]">
          Difficulty:{" "}
          <span className="font-bold capitalize">
            {currentQuestion.difficulty}
          </span>{" "}
          | Score: {score} | Q {currentQ + 1}/{questions.length}
        </p>

        {/* Match container */}
        <div className="flex w-full justify-between gap-[5%]">
          {/* Terms */}
          <div className="w-[45%] flex flex-col gap-[2%]">
            {terms.map((term) => (
              <button
                key={term}
                onClick={() => handleTermSelect(term)}
                className="w-full py-[3%] border-2 rounded-[1.5vh] text-[2.5vh] font-semibold transition"
                style={{
                  backgroundColor: termColors[term]
                    ? termColors[term]
                    : selectedTerm === term
                    ? "#ddd6fe"
                    : "#ffffff",
                  borderColor: "#e2e8f0",
                }}
              >
                {term}
              </button>
            ))}
          </div>

          {/* Definitions */}
          <div className="w-[45%] flex flex-col gap-[2%]">
            {shuffledDefs.map((definition) => {
              const matchedTerm = Object.keys(userMatches).find(
                (t) => userMatches[t] === definition
              );
              return (
                <button
                  key={definition}
                  onClick={() => handleDefinitionSelect(definition)}
                  disabled={!selectedTerm}
                  className="w-full py-[3%] border-2 rounded-[1.5vh] text-[2.5vh] transition"
                  style={{
                    backgroundColor: matchedTerm
                      ? termColors[matchedTerm]
                      : "#ffffff",
                    borderColor: "#e2e8f0",
                  }}
                >
                  {definition}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        {allMatched && (
          <div className="flex justify-center">
            <button
              onClick={nextQuestion}
              className="mt-[4%] px-[5%] py-[2%] rounded-[2vh] text-white font-bold text-[2.5vh] bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition"
            >
              Next Question ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Match;
