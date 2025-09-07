import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import LanguageToggle from "../utils/LanguageToggle";
import riddles from "../../data/riddle.json";
import BgImage from "../../assets/BgImage.png";

const translations = {
  en: {
    title: "Riddle Master",
    level: "Level",
    time: "Time",
    submit: "Submit Answer",
    next: "Next 👉",
    correct: "Correct!",
    incorrect: "Incorrect!",
    tryAgain: "Try Again 🧐",
    quizComplete: "Quiz Completed!",
    yourScore: "Your Score:",
    restart: "Restart Game 🔄",
    hint: "Another hint revealed! 💡",
    placeholder: "Type your answer here",
    theWordWas: "The word was:",
  },
  ta: {
    title: "விடுகதை மாஸ்டர்",
    level: "நிலை",
    time: "நேரம்",
    submit: "பதிலைச் சமர்ப்பிக்கவும்",
    next: "அடுத்து 👉",
    correct: "சரி!",
    incorrect: "தவறு!",
    tryAgain: "மீண்டும் முயற்சிக்கவும் 🧐",
    quizComplete: "விடுகதை முடிந்தது!",
    yourScore: "உங்கள் மதிப்பெண்:",
    restart: "விளையாட்டை மீண்டும் தொடங்கு 🔄",
    hint: "மற்றொரு குறிப்பு வெளிப்படுத்தப்பட்டது! 💡",
    placeholder: "உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும்",
    theWordWas: "வார்த்தை:",
  }
};

const Riddle = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState([true, false, false]);
  const [userInput, setUserInput] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [isIncorrectPopupVisible, setIsIncorrectPopupVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [showHintMessage, setShowHintMessage] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  const timerRef = useRef(null);

  const getRandomQuestions = () => {
    const shuffled = [...riddles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const startGame = useCallback(() => {
    const selectedQuestions = getRandomQuestions();
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setRevealedHints([true, false, false]);
    setUserInput('');
    setCorrectAnswer(false);
    setIsIncorrectPopupVisible(false);
    setScore(0);
    setTimer(90);
    setGameOver(false);
    setShowHintMessage(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (timer > 0 && !gameOver && !correctAnswer && !isIncorrectPopupVisible) {
      timerRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameOver(true);
    }

    return () => clearInterval(timerRef.current);
  }, [timer, gameOver, correctAnswer, isIncorrectPopupVisible]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prevLang => prevLang === "en" ? "ta" : "en");
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < 3) {
      setCurrentQuestionIndex(nextIndex);
      setRevealedHints([true, false, false]);
      setUserInput('');
      setCorrectAnswer(false);
      setIsIncorrectPopupVisible(false);
    } else {
      setGameOver(true);
      clearInterval(timerRef.current);
    }
  };

  const handleNextFromPopup = () => {
    handleNextQuestion();
  };

  const handleTryAgain = () => {
    setUserInput('');
    setIsIncorrectPopupVisible(false);
  };

  const handleHintClick = (hintNumber) => {
    if (hintNumber > 0 && !correctAnswer) {
      const newHints = [...revealedHints];
      newHints[hintNumber] = true;
      setRevealedHints(newHints);
      setShowHintMessage(true);
      setTimeout(() => setShowHintMessage(false), 1500);
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!questions[currentQuestionIndex]) return;

    const correctLanguageAnswer = currentLanguage === 'en' 
      ? questions[currentQuestionIndex].answer 
      : questions[currentQuestionIndex].ta_answer;

    if (userInput.trim().toLowerCase() === correctLanguageAnswer.toLowerCase()) {
      setCorrectAnswer(true);
      setScore(score + 1);
    } else {
      setIsIncorrectPopupVisible(true);
    }
  };

  const renderStars = () => {
    const totalStars = 3;
    const filledStars = score;
    const starEmojis = '⭐'.repeat(filledStars) + '✨'.repeat(totalStars - filledStars);
    return starEmojis;
  };

  const currentQuestion = useMemo(() => {
    const question = questions[currentQuestionIndex];
    if (!question) {
      return null;
    }
    return {
      answer: currentLanguage === 'en' ? question.answer : question.ta_answer,
      hints: currentLanguage === 'en' ? question.hints : question.ta_hints,
    };
  }, [questions, currentQuestionIndex, currentLanguage]);

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#efe2fa] dark:bg-[#7164b4] text-[#7164b4] dark:text-[#efe2fa]">
        <div className="p-8 rounded-lg shadow-lg bg-[#efe2fa] dark:bg-[#8f9fe4] text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7164b4] mx-auto"></div>
          <p className="mt-4 text-lg animate-pulse">Loading questions...</p>
        </div>
      </div>
    );
  }

  const formatTimer = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 font-sans overflow-hidden">
      {/* Language Toggle Button */}
      <LanguageToggle 
        currentLanguage={currentLanguage} 
        onPress={handleLanguageToggle} 
      />
      
      {/* Background Image */}
      <img
        src={BgImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Main Quiz Box */}
      <div className="relative z-10 max-w-2xl w-full p-6 sm:p-8 md:p-10 bg-white/80 dark:bg-black/20 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col items-center gap-4 sm:gap-6 min-h-[500px] transition-all duration-300 border border-white/30 dark:border-white/10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#7164b4] dark:text-[#bca5d4] mb-2 sm:mb-4 text-center">{translations[currentLanguage].title}</h1>

        {/* Levels + Timer */}
        <div className="flex flex-col sm:flex-row justify-between w-full text-base sm:text-lg font-semibold mb-2 sm:mb-4 items-center sm:items-start space-y-2 sm:space-y-0">
          <div className="flex space-x-2">
            {[0, 1, 2].map(level => (
              <span
                key={level}
                className={`py-1 px-3 rounded-full text-xs sm:text-sm md:text-base transition-all duration-300 ${
                  currentQuestionIndex === level
                    ? 'bg-[#8f9fe4] text-[#efe2fa] shadow-md transform scale-110 animate-pulse'
                    : 'bg-[#bca5d4] dark:bg-[#7164b4] text-[#7164b4] dark:text-[#efe2fa]'
                }`}
              >
                {translations[currentLanguage].level} {level + 1} 🧠
              </span>
            ))}
          </div>
          <div className="text-xl sm:text-2xl font-bold">
            {translations[currentLanguage].time}: <span className={`${timer <= 10 ? 'text-red-500 animate-pulse' : 'text-[#7164b4] dark:text-[#efe2fa]'}`}>{formatTimer(timer)}</span>
          </div>
        </div>

        {/* Hints */}
        <div className="w-full text-center min-h-[80px] sm:min-h-[100px] mb-2 sm:mb-4">
          {revealedHints.map((show, idx) =>
            show ? (
              <p key={idx} className="mb-1 sm:mb-2 italic text-[#7164b4] dark:text-[#bca5d4] text-base sm:text-lg">
                "{currentQuestion.hints[idx]}"
              </p>
            ) : null
          )}
        </div>

        {/* Hint buttons */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          {['Hint 1', 'Hint 2', 'Hint 3'].map((label, idx) => (
            <button
              key={idx}
              onClick={() => handleHintClick(idx)}
              disabled={revealedHints[idx] || correctAnswer || idx === 0}
              className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full font-bold text-sm sm:text-base text-white transition-all duration-200 shadow-lg ${
                revealedHints[idx]
                  ? 'hint-used-style'
                  : 'bg-gradient-to-br from-[#8f9fe4] to-[#7164b4] hover:from-[#bca5d4] hover:to-[#8f9fe4]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Answer input */}
        <form onSubmit={handleGuess} className="w-full flex flex-col items-center space-y-2 sm:space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={correctAnswer || gameOver}
            className="w-full px-4 py-2 sm:py-3 rounded-xl border-2 border-[#bca5d4] dark:border-[#8f9fe4] text-center text-base sm:text-lg bg-white/70 dark:bg-black/20 text-[#7164b4] dark:text-[#efe2fa]"
            placeholder={translations[currentLanguage].placeholder}
          />
          <button
            type="submit"
            disabled={correctAnswer || gameOver}
            className="w-full px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold text-white bg-gradient-to-br from-[#7164b4] to-[#8f9fe4] hover:from-[#8f9fe4] hover:to-[#bca5d4] text-base sm:text-lg"
          >
            {translations[currentLanguage].submit}
          </button>
        </form>
      </div>

      {/* Popups + Game Over */}
      {correctAnswer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/90 p-6 sm:p-8 rounded-3xl shadow-2xl text-center max-w-xs w-full">
            <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[#7164b4]">{translations[currentLanguage].correct}</h2>
            <p className="text-base sm:text-lg">{translations[currentLanguage].theWordWas} <span className="font-semibold">{currentQuestion.answer}</span></p>
            <button
              onClick={handleNextFromPopup}
              className="mt-4 sm:mt-6 w-full px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold text-white bg-gradient-to-br from-[#8f9fe4] to-[#7164b4] text-base sm:text-lg"
            >
              {translations[currentLanguage].next}
            </button>
          </div>
        </div>
      )}

      {isIncorrectPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/90 p-6 sm:p-8 rounded-3xl shadow-2xl text-center max-w-xs w-full">
            <div className="text-5xl sm:text-6xl mb-4">❌</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-red-600">{translations[currentLanguage].incorrect}</h2>
            <p className="text-base sm:text-lg">{translations[currentLanguage].tryAgain}</p>
            <div className="mt-4 sm:mt-6 flex justify-center space-x-2 sm:space-x-4">
              <button onClick={handleTryAgain} className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-white bg-[#bca5d4] text-sm sm:text-base">{translations[currentLanguage].tryAgain} 🧐</button>
              <button onClick={handleNextFromPopup} className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold text-white bg-[#8f9fe4] text-sm sm:text-base">{translations[currentLanguage].next} 👉</button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/90 p-6 sm:p-8 rounded-3xl shadow-2xl text-center max-w-xs w-full">
            <div className="text-5xl sm:text-6xl mb-4">🏆</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-[#7164b4]">{translations[currentLanguage].quizComplete}</h2>
            <p className="text-lg sm:text-xl mb-4">{translations[currentLanguage].yourScore} {score}/3</p>
            <div className="text-3xl sm:text-4xl mb-6">{renderStars()}</div>
            <button onClick={startGame} className="w-full px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold text-white bg-[#7164b4] text-base sm:text-lg">{translations[currentLanguage].restart} 🔄</button>
          </div>
        </div>
      )}

      {showHintMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#7164b4] text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm sm:text-base">
          <p>{translations[currentLanguage].hint}</p>
        </div>
      )}
    </div>
  );
};

export default Riddle;
