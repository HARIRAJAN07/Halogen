import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import matchData from "../../data/match.json";
import AppBackground from "../utils/AppBackground";

const KeyframeStyles = () => (
  <style>
    {`
      @keyframes pulse {
        50% { opacity: .5; }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); }
        50% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .animate-fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
    `}
  </style>
);

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: undefined });
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
};

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
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerRunning, setTimerRunning] = useState(true);
  const timerRef = useRef(null);
  const { width } = useWindowSize();
  const isSmallScreen = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const PRIMARY_BLUE = '#2A60A0';
  const SECONDARY_BLUE = '#7FB3E0';
  const CARD_BG_LIGHT = '#DEEBF7';
  const HOVER_LIGHT_BLUE = '#EAF2F9';
  const PAGE_BG_LIGHT = '#F0F7FF';
  const DARK_MODE_TEXT = '#FFFFFF';

  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);
  const pickRandom = (arr, n) => shuffleArray(arr).slice(0, Math.min(n, arr.length));

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
    const medium = pickRandom(filtered.filter((q) => q.difficulty === "medium"), 2);
    const hard = pickRandom(filtered.filter((q) => q.difficulty === "hard"), 1);
    let selected = [...easy, ...medium, ...hard];
    if (selected.length < 5) {
      const remaining = filtered.filter((q) => !selected.includes(q));
      const fill = pickRandom(remaining, 5 - selected.length);
      selected = [...selected, ...fill];
    }
    setQuestions(shuffleArray(selected));
  }, [classId, subject, topic]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentMatches = questions[currentQ].matches;
      setShuffledDefs(shuffleArray(currentMatches.map((m) => m.definition)));
    }
  }, [questions, currentQ]);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      setShowPopup(true);
      setIsCorrect(false);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timeLeft]);

  const handleTermSelect = (term) => {
    if (userPairs[term]) return;
    setSelectedTerm(term);
  };

  const handleDefinitionSelect = (definition) => {
    if (!selectedTerm || Object.values(userPairs).includes(definition)) return;
    const newColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 70%)`;
    const newPair = { [selectedTerm]: definition };
    setUserPairs((prev) => ({ ...prev, ...newPair }));
    setPairColors((prev) => ({ ...prev, [selectedTerm]: newColor }));
    setSelectedTerm(null);
  };

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

  const advanceToNextQuestion = useCallback(() => {
    const nextQ = currentQ + 1;
    if (nextQ < questions.length) {
      setCurrentQ(nextQ);
      setUserPairs({});
      setPairColors({});
      setSelectedTerm(null);
    } else {
      setShowPopup(true);
      setIsCorrect(true);
      setTimerRunning(false);
    }
  }, [currentQ, questions.length]);

  const handleNext = useCallback(() => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }
    setShowPopup(false);
    setTimerRunning(true);
    advanceToNextQuestion();
  }, [isCorrect, advanceToNextQuestion]);

  const handleTryAgain = useCallback(() => {
    setShowPopup(false);
    setTimerRunning(true);
    setUserPairs({});
    setPairColors({});
    setSelectedTerm(null);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setCurrentQ(0);
    setCorrectCount(0);
    setUserPairs({});
    setPairColors({});
    setSelectedTerm(null);
    setTimeLeft(180);
    setTimerRunning(true);
    setShowPopup(false);
    setIsCorrect(false);
  }, []);

  const handleGoToLeaderBoard = useCallback(() => {
    navigate("/leaderboard");
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getMatchContainerStyles = useCallback(() => ({
    position: 'relative',
    zIndex: 10,
    width: isSmallScreen ? '95%' : (isTablet ? '80%' : '70%'),
    maxWidth: '50rem',
    padding: isSmallScreen ? '1.5rem' : '2.5rem',
    background: "linear-gradient(135deg, #BACBFE, #C1DDE8)",
    backdropFilter: 'blur(16px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: isSmallScreen ? '1rem' : '1.5rem',
    minHeight: '80vh',
    transition: 'all 0.3s',
    border: '1px solid',
    borderColor: `rgba(127, 179, 224, 0.5)`,
  }), [isSmallScreen, isTablet]);

  const getPopupStyles = useCallback(() => ({
    overlay: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
      zIndex: 50,
      padding: '1rem',
    },
    card: {
      backgroundColor: CARD_BG_LIGHT,
      padding: isSmallScreen ? '1.5rem' : '2rem',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      textAlign: 'center',
      maxWidth: '28rem',
      width: '90%',
    },
    title: {
      fontSize: isSmallScreen ? '1.5rem' : '1.875rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: PRIMARY_BLUE,
    },
    message: {
      fontSize: isSmallScreen ? '1rem' : '1.125rem',
      color: PRIMARY_BLUE,
      marginBottom: '1rem',
    },
    score: {
      fontSize: isSmallScreen ? '1.125rem' : '1.25rem',
      marginBottom: '1rem',
      color: PRIMARY_BLUE,
    },
    button: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.75rem',
      fontWeight: 'bold',
      color: '#FFFFFF',
      border: 'none',
      fontSize: isSmallScreen ? '0.875rem' : '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    correctButton: {
      backgroundColor: '#4CAF50',
    },
    tryAgainButton: {
      backgroundColor: '#f44336',
    },
    nextButton: {
      backgroundColor: PRIMARY_BLUE,
    },
    playAgainButton: {
      backgroundColor: PRIMARY_BLUE,
    },
    dashboardButton: {
      backgroundColor: '#607D8B',
    }
  }), [isSmallScreen, PRIMARY_BLUE, CARD_BG_LIGHT]);

  const matchContainerStyles = getMatchContainerStyles();
  const popupStyles = getPopupStyles();

  if (questions.length === 0) {
    return (
      <AppBackground>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PAGE_BG_LIGHT, color: PRIMARY_BLUE }}>
          <div style={{ padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', backgroundColor: CARD_BG_LIGHT, textAlign: 'center' }}>
            <div style={{ animation: 'spin 1s linear infinite', borderRadius: '9999px', height: '3rem', width: '3rem', borderBottom: '2px solid', borderColor: PRIMARY_BLUE, margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', fontSize: '1.125rem', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Loading questions...</p>
          </div>
        </div>
      </AppBackground>
    );
  }

  const currentQuestion = questions[currentQ];
  const terms = currentQuestion.matches.map((m) => m.term);
  const allPaired = Object.keys(userPairs).length === terms.length;
  const isGameOverScreen = currentQ === questions.length - 1 && showPopup && isCorrect;

  return (
    <AppBackground>
      <KeyframeStyles />
      <div style={matchContainerStyles}>
        <div style={{ position: 'absolute', top: '2%', right: '5%', fontSize: isSmallScreen ? '1rem' : '2rem', color: DARK_MODE_TEXT, fontWeight: 'bold' }}>
          Timer: {formatTime(timeLeft)}
        </div>

        {isGameOverScreen ? (
          <div style={popupStyles.overlay}>
            <div style={popupStyles.card}>
              <h2 style={popupStyles.title}>Game Over!</h2>
              <p style={popupStyles.score}>
                You got {correctCount} out of {questions.length} questions correct.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  onClick={handleGoToLeaderBoard}
                  style={{ ...popupStyles.button, ...popupStyles.dashboardButton }}
                >
                  Leaderboard
                </button>
                <button
                  onClick={handlePlayAgain}
                  style={{ ...popupStyles.button, ...popupStyles.playAgainButton }}
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: isSmallScreen ? '2rem' : '2.5rem', color: PRIMARY_BLUE, fontWeight: 'extrabold', marginBottom: '1%' }}>
              {currentQuestion.question}
            </h1>
            <p style={{ fontSize: isSmallScreen ? '1rem' : '1.125rem', color: PRIMARY_BLUE, fontWeight: '600', marginBottom: '2%', textAlign: 'center' }}>
              Difficulty:{" "}
              <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: SECONDARY_BLUE }}>
                {currentQuestion.difficulty}
              </span>{" "}
              | Q {currentQ + 1}/{questions.length}
            </p>

            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '5%' }}>
              <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '2%' }}>
                {terms.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTermSelect(term)}
                    disabled={!!pairColors[term]}
                    style={{
                      backgroundColor: pairColors[term]
                        ? pairColors[term]
                        : selectedTerm === term
                        ? HOVER_LIGHT_BLUE
                        : '#ffffff',
                      borderColor: '#e2e8f0',
                      cursor: pairColors[term] ? "not-allowed" : "pointer",
                      padding: isSmallScreen ? '2vw 4vw' : '1.5vw 2vw',
                      borderRadius: '0.75rem',
                      border: '0.2vw solid',
                      fontSize: isSmallScreen ? '2.5vw' : '1.5vw',
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                      color: PRIMARY_BLUE,
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '2%' }}>
                {shuffledDefs.map((definition) => {
                  const matchedTerm = Object.keys(userPairs).find(
                    (t) => userPairs[t] === definition
                  );
                  return (
                    <button
                      key={definition}
                      onClick={() => handleDefinitionSelect(definition)}
                      disabled={!selectedTerm || matchedTerm}
                      style={{
                        backgroundColor: matchedTerm
                          ? pairColors[matchedTerm]
                          : '#ffffff',
                        borderColor: '#e2e8f0',
                        cursor:
                          !selectedTerm || matchedTerm ? "not-allowed" : "pointer",
                        padding: isSmallScreen ? '2vw 4vw' : '1.5vw 2vw',
                        borderRadius: '0.75rem',
                        border: '0.2vw solid',
                        fontSize: isSmallScreen ? '2.5vw' : '1.5vw',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                        color: PRIMARY_BLUE,
                      }}
                    >
                      {definition}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '4%' }}>
              <button
                onClick={checkAnswers}
                disabled={!allPaired}
                style={{
                  padding: isSmallScreen ? '2vw 4vw' : '1.5vw 2vw',
                  borderRadius: '0.75rem',
                  fontSize: isSmallScreen ? '3vw' : '1.75vw',
                  fontWeight: 'bold',
                  cursor: !allPaired ? 'not-allowed' : 'pointer',
                  opacity: !allPaired ? 0.5 : 1,
                  background: `linear-gradient(to right, ${PRIMARY_BLUE}, ${SECONDARY_BLUE})`,
                  color: '#FFFFFF'
                }}
              >
                Check Answers
              </button>
              <button
                onClick={() => {
                  if (showPopup) {
                    handleNext();
                  } else {
                    // This block handles the case where the user clicks Next before checking answers
                    // It can be a simple advance or a more complex check.
                    advanceToNextQuestion();
                  }
                }}
                style={{
                  padding: isSmallScreen ? '2vw 4vw' : '1.5vw 2vw',
                  borderRadius: '0.75rem',
                  fontSize: isSmallScreen ? '3vw' : '1.75vw',
                  fontWeight: 'bold',
                  backgroundColor: SECONDARY_BLUE,
                  color: '#FFFFFF',
                }}
              >
                Next ➡️
              </button>
            </div>
          </>
        )}
        {showPopup && !isGameOverScreen && (
          <div style={popupStyles.overlay}>
            <div style={popupStyles.card}>
              {isCorrect ? (
                <>
                  <div style={{ fontSize: isSmallScreen ? '8vw' : '4vw', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>🎉</div>
                  <h2 style={popupStyles.title}>You are correct!</h2>
                  <p style={popupStyles.message}>Great job!</p>
                  <button
                    onClick={handleNext}
                    style={{ ...popupStyles.button, ...popupStyles.correctButton, marginTop: '2vw' }}
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: isSmallScreen ? '8vw' : '4vw', marginBottom: '1rem' }}>😔</div>
                  <h2 style={popupStyles.title}>Oops, you are wrong!</h2>
                  <p style={popupStyles.message}>Try to match the terms and definitions carefully.</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2vw' }}>
                    <button
                      onClick={handleTryAgain}
                      style={{ ...popupStyles.button, ...popupStyles.tryAgainButton }}
                    >
                      Try Again 🧐
                    </button>
                    <button
                      onClick={handleNext}
                      style={{ ...popupStyles.button, ...popupStyles.nextButton }}
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
    </AppBackground>
  );
};

export default Match;