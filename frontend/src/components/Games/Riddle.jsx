import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import LanguageToggle from "../utils/LanguageToggle";
import riddles from "../../data/riddle.json";
import TablaCelebration from '../utils/Celeb';
import Background from '../utils/FloatingBackground';
import Logo from '../utils/logo'
import BackButton from '../utils/backbutton';
import Footer from '../utils/Footer';
// Helper for translations (remains the same)
const translations = {
  en: {
    title: "Riddle Master",
    level: "Level",
    time: "Time",
    submit: "Submit Answer",
    next: "Next 👉",
    correct: "Correct!",
    incorrect: "Incorrect!",
    tryAgain: "Try Again ",
    quizComplete: "Quiz Completed!",
    yourScore: "Your Score:",
    restart: "Restart Game 🔄",
    hint: "Another hint revealed! 💡",
    placeholder: "Choose your answer",
    theWordWas: "The correct answer was:",
    leaderboard: "Leaderboard 🏆",
  },
  ta: {
    title: "விடுகதை மாஸ்டர்",
    level: "நிலை",
    time: "நேரம்",
    submit: "பதிலைச் சமர்ப்பிக்கவும்",
    next: "அடுத்து 👉",
    correct: "சரி!",
    incorrect: "தவறு!",
    tryAgain: "மீண்டும் முயற்சிக்கவும் ",
    quizComplete: "விடுகதை முடிந்தது!",
    yourScore: "உங்கள் மதிப்பெண்:",
    restart: "விளையாட்டை மீண்டும் தொடங்கு 🔄",
    hint: "மற்றொரு குறிப்பு வெளிப்படுத்தப்பட்டது! 💡",
    placeholder: "உங்கள் பதிலைத் தேர்ந்தெடுக்கவும்",
    theWordWas: "சரியான பதில்:",
    leaderboard: "புள்ளி பட்டியல் 🏆",
  }
};

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

const Riddle = ({ isDarkMode = false }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState([true, false, false]);
  const [userSelection, setUserSelection] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [isIncorrectPopupVisible, setIsIncorrectPopupVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(180);
  const [gameOver, setGameOver] = useState(false);
  const [showHintMessage, setShowHintMessage] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [stopCelebration, setStopCelebration] = useState(false);
  const timerRef = useRef(null);

  const [hintButtonHover, setHintButtonHover] = useState([false, false, false]);
  const [optionButtonHover, setOptionButtonHover] = useState({});
  const [submitHover, setSubmitHover] = useState(false);

  const PRIMARY_BLUE = '#2A60A0';
  const SECONDARY_BLUE = '#7FB3E0';
  const CARD_BG_LIGHT = '#DEEBF7';
  const HOVER_LIGHT_BLUE = '#EAF2F9';
  const PAGE_BG_LIGHT = '#F0F7FF';

  const getRandomQuestions = () => {
    const shuffled = [...riddles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const startGame = useCallback(() => {
    setStopCelebration(true);
    const selectedQuestions = getRandomQuestions();
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setRevealedHints([true, false, false]);
    setUserSelection(null);
    setCorrectAnswer(false);
    setIsIncorrectPopupVisible(false);
    setScore(0);
    setTimer(180);
    setGameOver(false);
    setShowHintMessage(false);

    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => setStopCelebration(false), 50);
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
      setUserSelection(null);
      setCorrectAnswer(false);
      setIsIncorrectPopupVisible(false);
    } else {
      setGameOver(true);
      clearInterval(timerRef.current);
    }
  };
  const handleNextFromPopup = () => handleNextQuestion();
  const handleTryAgain = () => {
    setUserSelection(null);
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
    if (!questions[currentQuestionIndex] || userSelection === null) return;
    const correctLanguageAnswer = currentLanguage === 'en'
      ? questions[currentQuestionIndex].answer
      : questions[currentQuestionIndex].ta_answer;
    if (userSelection === correctLanguageAnswer) {
      setCorrectAnswer(true);
      setScore(score + 1);
    } else {
      setIsIncorrectPopupVisible(true);
    }
  };
  const renderStars = () => {
    const totalStars = 3;
    const filledStars = score;
    return '⭐'.repeat(filledStars) + '☆'.repeat(totalStars - filledStars);
  };
  const currentQuestion = useMemo(() => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;
    return {
      hints: currentLanguage === 'en' ? question.hints : question.ta_hints,
      options: currentLanguage === 'en' ? question.options : question.ta_options,
      answer: currentLanguage === 'en' ? question.answer : question.ta_answer,
    };
  }, [questions, currentQuestionIndex, currentLanguage]);

  const getStyles = useCallback(() => ({
    mainContainer: {
      position: 'relative',
      zIndex: 10,
      width: '42vw',
      maxWidth: '42vw',
      padding: '2.5vh',
      background: "linear-gradient(135deg, #BACBFE, #C1DDE8)",
      backdropFilter: 'blur(16px)',
      borderRadius: '1.5vh',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5vh',
      minHeight: '70vh',
      transition: 'all 0.3s',
      border: '1px solid',
      borderColor: isDarkMode ? `rgba(127, 179, 224, 0.3)` : `rgba(127, 179, 224, 0.5)`,
    },
    title: {
      fontSize: '6vh',
      fontWeight: '800',
      color: isDarkMode ? '#FFFFFF' : PRIMARY_BLUE,
      marginBottom: '1vh',
      textAlign: 'center',
    },
    levelAndTimerContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      fontWeight: '800',
      fontSize : '2vh',
      alignItems: 'flex-start',
      gap: '1vh',
    },
    levelBadge: (isActive) => ({
      padding: '0.25vh 0.75vh',
      borderRadius: '9999px',
      fontSize: '1.5vh',
      transition: 'all 0.3s',
      backgroundColor: isActive ? PRIMARY_BLUE : (isDarkMode ? `rgba(127, 179, 224, 0.4)` : `rgba(127, 179, 224, 0.5)`),
      color: '#FFFFFF',
      boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
      transform: isActive ? 'scale(1.1)' : 'none',
      animation: isActive ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
    }),
    timer: {
      fontSize: '2vh',
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : PRIMARY_BLUE,
    },
    hintText: {
      marginBottom: '0.5vh',
      fontStyle: 'italic',
      fontWeight: '600',
      color: isDarkMode ? HOVER_LIGHT_BLUE : PRIMARY_BLUE,
      fontSize: '3vh',
    },
    hintButton: (idx, isUsed) => ({
      flex: '1',
      minWidth: '8vw',
      maxWidth: '12vw',
      padding: '0.5vh 0.75vh',
      borderRadius: '9999px',
      fontWeight: 'bold',
      fontSize: '1.5vh',
      color: '#FFFFFF',
      transition: 'all 0.2s',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      cursor: isUsed ? 'not-allowed' : 'pointer',
      border: 'none',
      backgroundColor: isUsed ? SECONDARY_BLUE : (hintButtonHover[idx] ? SECONDARY_BLUE : PRIMARY_BLUE),
    }),
    optionButton: (isSelected, isHovered, isDisabled) => ({
      width: '100%',
      padding: '0.75vh 1vh',
      borderRadius: '0.75vh',
      border: '2px solid',
      fontSize : '2vh',
      fontWeight: 'bold',
      transition: 'all 0.2s',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.7 : 1,
      transform: isSelected ? 'scale(1.05)' : 'none',
      boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
      backgroundColor: isSelected ? PRIMARY_BLUE : (isHovered ? CARD_BG_LIGHT : HOVER_LIGHT_BLUE),
      color: isSelected ? '#FFFFFF' : PRIMARY_BLUE,
      borderColor: isSelected ? PRIMARY_BLUE : SECONDARY_BLUE,
    }),
    optionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1vh',
        width: '100%',
    },
    submitButton: (isDisabled) => ({
      width: '100%',
      padding: '0.75vh 2vh',
      borderRadius: '0.75vh',
      fontWeight: 'bold',
      color: '#FFFFFF',
      border: 'none',
      backgroundColor: submitHover ? SECONDARY_BLUE : PRIMARY_BLUE,
      fontSize: '2vh',
      opacity: isDisabled ? 0.5 : 1,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s'
    })
  }), [isDarkMode, hintButtonHover, submitHover]);

  const styles = getStyles();

  if (!currentQuestion) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PAGE_BG_LIGHT, color: PRIMARY_BLUE }}>
        <div style={{ padding: '2vh', borderRadius: '0.5vh', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', backgroundColor: CARD_BG_LIGHT, textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '9999px', height: '3vh', width: '3vh', borderBottom: '2px solid', borderColor: PRIMARY_BLUE, margin: '0 auto' }}></div>
          <p style={{ marginTop: '1vh', fontSize: '1.5vh', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>Loading questions...</p>
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
    <Background>
      <Logo />
      <KeyframeStyles />
      <div style={styles.mainContainer}>
        <h1 style={styles.title}>{translations[currentLanguage].title}</h1>
        <div style={styles.levelAndTimerContainer}>
          <div style={{ display: 'flex', gap: '3vh', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[0, 1, 2].map(level => (
              <span key={level} style={styles.levelBadge(currentQuestionIndex === level)}>
                {translations[currentLanguage].level} {level + 1} 🧠
              </span>
            ))}
          </div>
          <div style={styles.timer}>
            {translations[currentLanguage].time}:{" "}
            <span style={{ color: timer <= 10 ? 'red' : 'inherit', animation: timer <= 10 ? 'pulse 1s infinite' : 'none' }}>
              {formatTimer(timer)}
            </span>
          </div>
        </div>
        <div style={{ width: '100%', textAlign: 'center', minHeight: '6vh', marginBottom: '1vh' }}>
          {revealedHints.map((show, idx) =>
            show ? <p key={idx} style={styles.hintText} className="animate-fade-in">"{currentQuestion.hints[idx]}"</p> : null
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1vh', marginBottom: '1.5vh', width: '100%' }}>
          {['Hint 1', 'Hint 2', 'Hint 3'].map((label, idx) => (
            <button
              key={idx}
              onClick={() => handleHintClick(idx)}
              disabled={revealedHints[idx] || correctAnswer || idx === 0}
              style={styles.hintButton(idx, revealedHints[idx] || correctAnswer || idx === 0)}
              onMouseEnter={() => setHintButtonHover(prev => ({ ...prev, [idx]: true }))}
              onMouseLeave={() => setHintButtonHover(prev => ({ ...prev, [idx]: false }))}
            >
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={handleGuess} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vh' }}>
          <div style={styles.optionsGrid}>
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUserSelection(option)}
                disabled={correctAnswer || gameOver}
                style={styles.optionButton(userSelection === option, optionButtonHover[idx], correctAnswer || gameOver)}
                onMouseEnter={() => setOptionButtonHover(prev => ({ ...prev, [idx]: true }))}
                onMouseLeave={() => setOptionButtonHover(prev => ({ ...prev, [idx]: false }))}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={userSelection === null || correctAnswer || gameOver}
            style={styles.submitButton(userSelection === null || correctAnswer || gameOver)}
            onMouseEnter={() => setSubmitHover(true)}
            onMouseLeave={() => setSubmitHover(false)}
          >
            {translations[currentLanguage].submit}
          </button>
        </form>
      </div>
      {correctAnswer && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, padding: '1vh' }}>
          <div style={{ backgroundColor: CARD_BG_LIGHT, padding: '2vh', borderRadius: '1.5vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center', maxWidth: '24vw', width: '90%' }}>
            <div style={{ fontSize: '3.75vh', marginBottom: '1vh', animation: 'bounce 1s infinite' }}>🎉</div>
            <h2 style={{ fontSize: '1.875vh', fontWeight: 'bold', marginBottom: '0.5vh', color: PRIMARY_BLUE }}>{translations[currentLanguage].correct}</h2>
            <p style={{ fontSize: '2vh', color: PRIMARY_BLUE }}>
              {translations[currentLanguage].theWordWas}{" "}
              <span style={{ fontWeight: '600' }}>{currentQuestion.answer}</span>
            </p>
            <button onClick={handleNextFromPopup} style={{ ...styles.submitButton(false), marginTop: '1.5vh' }}>
              {translations[currentLanguage].next}
            </button>
          </div>
        </div>
      )}
      {isIncorrectPopupVisible && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, padding: '1vh' }}>
          <div style={{ backgroundColor: CARD_BG_LIGHT, padding: '2vh', borderRadius: '1.5vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center', maxWidth: '24vw', width: '90%' }}>
            <div style={{ fontSize: '3.75vh', marginBottom: '1vh' }}>❌</div>
            <h2 style={{ fontSize: '1.875vh', fontWeight: 'bold', marginBottom: '0.5vh', color: 'red' }}>{translations[currentLanguage].incorrect}</h2>
            <p style={{ fontSize: '2vh', color: PRIMARY_BLUE }}>{translations[currentLanguage].tryAgain}</p>
            <div style={{ marginTop: '1.5vh', display: 'flex', justifyContent: 'center', gap: '1vh' }}>
              <button onClick={handleTryAgain} style={{ padding: '0.75vh 1.5vh', borderRadius: '0.75vh', fontWeight: 'bold', color: 'white', backgroundColor: SECONDARY_BLUE, border: 'none', fontSize: '1.5vh' }}>
                {translations[currentLanguage].tryAgain.split(' ')[0]} 
              </button>
              <button onClick={handleNextFromPopup} style={{ padding: '0.75vh 1.5vh', borderRadius: '0.75vh', fontWeight: 'bold', color: 'white', backgroundColor: PRIMARY_BLUE, border: 'none', fontSize: '1.5vh' }}>
                {translations[currentLanguage].next}
              </button>
            </div>
          </div>
        </div>
      )}
      {gameOver && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, padding: '1vh' }}>
          <div style={{ backgroundColor: CARD_BG_LIGHT, padding: '2vh', borderRadius: '1.5vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', textAlign: 'center', maxWidth: '24vw', width: '90%' }}>
            <div style={{ fontSize: '3.75vh', marginBottom: '1vh' }}>🏆</div>
            <h2 style={{ fontSize: '1.875vh', fontWeight: 'bold', marginBottom: '0.5vh', color: PRIMARY_BLUE }}>{translations[currentLanguage].quizComplete}</h2>
            <p style={{ fontSize: '2.5vh', marginBottom: '1vh', color: PRIMARY_BLUE }}>{translations[currentLanguage].yourScore} {score}/3</p>
            <div style={{ fontSize: '2.25vh', marginBottom: '1.5vh' }}>{renderStars()}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1vh', flexDirection: 'row' }}>
              <button onClick={startGame} style={{ ...styles.submitButton(false), flex: '1 1 45%', minWidth: '10vw' }}>
                {translations[currentLanguage].restart}
              </button>
              <button onClick={() => window.location.href = '/leaderboard'} style={{ ...styles.submitButton(false), flex: '1 1 45%', minWidth: '10vw' }}>
                {translations[currentLanguage].leaderboard}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
      <BackButton />
      <LanguageToggle currentLanguage={currentLanguage} onPress={handleLanguageToggle} />
    </Background>
  );
};

export default Riddle;