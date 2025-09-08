import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socialData from '../../data/social.json';
import LanguageToggle from "../utils/LanguageToggle";
import Background from "../utils/FloatingBackground";
import Logo from "../utils/logo";
const GRID_SIZE = 8;
const POINTS_PER_CORRECT = 10;
const REQUIRED_TO_UNLOCK = 10;
const QUESTIONS_PER_LEVEL = 3;
const TIMER_DURATION = 180;

const ALPHABET_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHABET_TA = "அஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழளறனஜஷஸஹ";

const TRANSLATIONS = {
  en: {
    title: "Word Search",
    score: "Score",
    level: "Level",
    question: "Question",
    hint: "Hint",
    submit: "Submit",
    next: "Next",
    clear: "Clear",
    hintsOver: "Your hints are over",
    hintsMsg:
      "Out of hints 🔒",
    ok: "OK",
    levelComplete: "Level Complete!",
    currentScore: "Your current score:",
    close: "Close",
    allComplete: "All Levels Completed 🎉",
    finalMotivation: "You're roaring like a tiger! 🐯 Majestic and powerful!",
    playAgain: "Play Again",
    notEnough:
      "Not enough points to unlock next level. Get 20 points to unlock.",
    time: "Time",
    timeUp: "OOPS...Time's up! ⏳",
    restartGame: "Restart Game",
    timeoutMsg: "Time’s up! 🔔You can restart the game to try again.",
    congratsTitle: " 🏆 Congratulations! 🎉",
    congratsMsg: "You have completed all levels! Good job!",
    finalScore: "Your final score:",
    leaderboard: "Leaderboard"
  },
  ta: {
    title: "வார்த்தை தேடல்",
    score: "மதிப்பெண்",
    level: "நிலை",
    question: "கேள்வி",
    hint: "குறிப்பு",
    submit: "சமர்ப்பிக்கவும்",
    next: "அடுத்தது",
    clear: "அழிக்க",
    hintsOver: "உங்கள் குறிப்புகள் முடிந்துவிட்டன",
    hintsMsg:
      "குறிப்புகள் முடிந்தது 🔒",
    ok: "சரி",
    levelComplete: "நிலை முடிந்தது!",
    currentScore: "உங்கள் தற்போதைய மதிப்பெண்:",
    close: "மூடு",
    allComplete: "அனைத்து நிலைகளும் முடிந்துவிட்டன 🎉",
    finalMotivation: "நீங்கள் புலி போல் கர்ஜிக்கிறீர்கள்! 🐯 வலிமையும் திறமையும்!",
    playAgain: "மீண்டும் விளையாடு",
    notEnough: "அடுத்த நிலையை திறக்க போதுமான மதிப்பெண் இல்லை. 20 புள்ளிகள் தேவை.",
    time: "நேரம்",
    timeUp: "ஐயோ... நேரம் முடிந்துவிட்டது! ⏳",
    restartGame: "விளையாட்டை மீண்டும் தொடங்கு",
    timeoutMsg: "நேரம் முடிந்துவிட்டது! ",
    congratsTitle: "🏆 வாழ்த்துக்கள்! 🎉",
    congratsMsg: "அனைத்து நிலைகளையும் முடித்துவிட்டீர்கள்! நல்ல வேலை!",
    finalScore: "உங்கள் இறுதி மதிப்பெண்:",
    leaderboard: "புள்ளி பட்டியல்"
  },
};

const ANSWER_COLORS = ["#EF4444", "#3B82F6", "#22C55E", "#F97316"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function arrayFromStr(s) {
  if (typeof s !== 'string') return [];
  if (/^[A-Za-z0-9]+$/.test(s)) {
    return s.split('');
  }

  const graphemes = [];
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (i > 0 && /[\u0B82\u0BBE-\u0BCD]/.test(char)) {
      graphemes[graphemes.length - 1] += char;
    } else {
      graphemes.push(char);
    }
  }
  return graphemes;
}

function normalizeForCompare(arr, language) {
  if (language === "en") {
    return arr.join("").toUpperCase().replace(/[^A-Z0-9]/g, "");
  }
  const baseChars = arr.map(char => {
    return char.replace(/[\u0B82\u0BBE-\u0BCD]/g, '');
  });
  return baseChars.join("");
}

function Confetti({ running }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 1,
      dur: 2 + Math.random() * 2,
      rotate: Math.random() * 360,
      bg: ["#FF4D6D", "#FFD166", "#06D6A0", "#118AB2", "#9B5DE5"][
        randInt(0, 4)
      ],
    }));
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden ${running ? "" : "hidden"}`}>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-10%",
            width: 10,
            height: 18,
            background: p.bg,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: 2,
            animation: `fall ${p.dur}s ${p.delay}s linear forwards`,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1 }
          80% { opacity: 1 }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0 }
        }
      `}</style>
    </div>
  );
}

function playTone({ freq = 440, dur = 0.3, type = "sine" } = {}) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  } catch (e) {
  }
}

function playCorrectSound() {
  playTone({ freq: 880, dur: 0.25, type: "triangle" });
  setTimeout(() => playTone({ freq: 660, dur: 0.2 }), 220);
}
function playWrongSound() {
  playTone({ freq: 220, dur: 0.25, type: "sawtooth" });
}
function playLevelCompleteSound() {
  playTone({ freq: 660, dur: 0.35 });
  setTimeout(() => playTone({ freq: 880, dur: 0.2 }), 250);
}
function playVictorySound() {
  playTone({ freq: 523.25, dur: 0.2 }); // C5
  setTimeout(() => playTone({ freq: 659.25, dur: 0.2 }), 150); // E5
  setTimeout(() => playTone({ freq: 783.99, dur: 0.2 }), 300); // G5
  setTimeout(() => playTone({ freq: 1046.5, dur: 0.5 }), 500); // C6
}

export default function WordSearchGame() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [language, setLanguage] = useState("en");
  const T = TRANSLATIONS[language];
  const ALPHABET = language === "en" ? Array.from(ALPHABET_EN) : arrayFromStr(ALPHABET_TA);

 const handleLanguage = () => {
    setLanguage((l) => (l === "en" ? "ta" : "en"))
  };
  
  // State for timer
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerActive, setTimerActive] = useState(true);

  // Store original questions with all language data
  const [originalQuestions, setOriginalQuestions] = useState({
    easy: [],
    medium: [],
    hard: []
  });

  // Store initial questions
  const [initialLevels, setInitialLevels] = useState([]);
  const prevLanguageRef = useRef(language);

  // Get questions based on selected grade and level
  const getQuestionsForLevel = (levelIndex, lang = language) => {
    const targetClass = parseInt(classId);
    const questionsGrade = `grade${targetClass}`;
    
    const levelKeys = ["easy", "medium", "hard"];
    const levelKey = levelKeys[levelIndex];

    // Check if the requested grade exists in the data
    if (!socialData[questionsGrade] || !socialData[questionsGrade][levelKey]) {
      console.warn(`No data found for grade ${targetClass} and level ${levelKey}. Using default 'grade6'.`);
      // Fallback to grade6 if the requested grade doesn't exist
      const fallbackGrade = "grade6";
      if (!socialData[fallbackGrade] || !socialData[fallbackGrade][levelKey]) {
        return [];
      }
      
      const allQuestions = socialData[fallbackGrade][levelKey];
      const selectedQuestions = [];
      const usedIndices = new Set();
      
      while (selectedQuestions.length < QUESTIONS_PER_LEVEL && selectedQuestions.length < allQuestions.length) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          const questionObj = allQuestions[randomIndex];
          const selectedQuestion = {
            q: questionObj[lang]?.q || questionObj.en.q,
            a: questionObj[lang]?.a || questionObj.en.a,
            originalQ: questionObj.en.q,
            originalA: questionObj.en.a,
            // Store the full question object for language switching
            fullData: questionObj
          };
          selectedQuestions.push(selectedQuestion);
        }
      }
      return selectedQuestions;
    }

    const allQuestions = socialData[questionsGrade][levelKey];
    const selectedQuestions = [];
    const usedIndices = new Set();
    
    while (selectedQuestions.length < QUESTIONS_PER_LEVEL && selectedQuestions.length < allQuestions.length) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const questionObj = allQuestions[randomIndex];
        const selectedQuestion = {
          q: questionObj[lang]?.q || questionObj.en.q,
          a: questionObj[lang]?.a || questionObj.en.a,
          originalQ: questionObj.en.q,
          originalA: questionObj.en.a,
          // Store the full question object for language switching
          fullData: questionObj
        };
        selectedQuestions.push(selectedQuestion);
      }
    }
    return selectedQuestions;
  };

  // Function to update questions when language changes
  const updateQuestionsForLanguage = (lang) => {
    const updatedLevels = initialLevels.map(level => {
      return level.map(question => {
        return {
          ...question,
          q: question.fullData[lang]?.q || question.fullData.en.q,
          a: question.fullData[lang]?.a || question.fullData.en.a
        };
      });
    });
    
    return updatedLevels;
  };

  useEffect(() => {
    // Only load questions initially or when classId changes
    if (initialLevels.length === 0) {
      const newLevels = [
        getQuestionsForLevel(0, language),
        getQuestionsForLevel(1, language),
        getQuestionsForLevel(2, language)
      ];
      setInitialLevels(newLevels);
    } else if (prevLanguageRef.current !== language) {
      // Update language without changing questions
      const updatedLevels = updateQuestionsForLanguage(language);
      setInitialLevels(updatedLevels);
      prevLanguageRef.current = language;
      
      // Rebuild grid with new language
      buildLevelGrid();
    }
  }, [language, classId]);

  // This will use the initial levels directly
  const LEVELS = useMemo(() => {
    return initialLevels;
  }, [initialLevels]);

  const [levelIndex, setLevelIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [unlocked, setUnlocked] = useState([true, false, false]);
  const [grid, setGrid] = useState([]);
  const [allLevelPaths, setAllLevelPaths] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [foundAnswers, setFoundAnswers] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [status, setStatus] = useState("playing");
  const [score, setScore] = useState(0);
  const [showHintOverModal, setShowHintOverModal] = useState(false);
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showFinalCompletionModal, setShowFinalCompletionModal] = useState(false);
  const [confettiRunning, setConfettiRunning] = useState(false);

  // Dragging states
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef(null); // Stores the starting cell of the drag
  const currentPathRef = useRef([]); // Stores the path of the current drag

  const levelQuestions = LEVELS[levelIndex] || [];
  const currentObj = levelQuestions[qIndex] || null;
  const currentAnswerArr = arrayFromStr(currentObj?.a || "");
  const currentAnswerPath = allLevelPaths[qIndex] || [];

  const DIRS = useMemo(() => [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ], []);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setShowTimeoutModal(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  function tryPlaceWord(gridToModify, wordArr, maxTries = 400) {
    const len = Math.min(wordArr.length, GRID_SIZE);
    for (let t = 0; t < maxTries; t++) {
      const dir = DIRS[randInt(0, DIRS.length - 1)];
      const dr = dir[0],
        dc = dir[1];

      const rMin = dr === -1 ? len - 1 : 0;
      const rMax = dr === 1 ? GRID_SIZE - len : GRID_SIZE - 1;
      const cMin = dc === -1 ? len - 1 : 0;
      const cMax = dc === 1 ? GRID_SIZE - len : GRID_SIZE - 1;

      const r0 = randInt(rMin, rMax);
      const c0 = randInt(cMin, cMax);

      let r = r0,
        c = c0;
      let ok = true;
      let wordChars = [];

      for (let i = 0; i < len; i++) {
        const cell = gridToModify[r][c];
        const target = wordArr[i];
        if (cell && cell !== "" && cell !== target) {
          ok = false;
          break;
        }
        wordChars.push(target);
        r += dr;
        c += dc;
      }
      if (!ok) continue;

      const newPath = [];
      r = r0;
      c = c0;
      for (let i = 0; i < len; i++) {
        gridToModify[r][c] = wordArr[i];
        newPath.push([r, c]);
        r += dr;
        c += dc;
      }
      return { newGrid: gridToModify, newPath };
    }
    return { newGrid: gridToModify, newPath: [] };
  }

  function buildLevelGrid() {
    const levelQuestions = LEVELS[levelIndex];
    if (!levelQuestions || levelQuestions.length === 0) {
      setGrid(Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => ALPHABET[randInt(0, ALPHABET.length - 1)])));
      setAllLevelPaths([]);
      return;
    }

    let initialGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => "")
    );
    let allPaths = [];

    for (let i = 0; i < levelQuestions.length; i++) {
      const answerToPlace = arrayFromStr(levelQuestions[i].a).slice(0, GRID_SIZE);
      const { newGrid, newPath } = tryPlaceWord(initialGrid, answerToPlace);
      initialGrid = newGrid;
      allPaths.push(newPath);
    }

    // Fill empty spots with random letters
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (initialGrid[r][c] === "") {
          initialGrid[r][c] = ALPHABET[randInt(0, ALPHABET.length - 1)];
        }
      }
    }
    setGrid(initialGrid);
    setAllLevelPaths(allPaths);
  }

  // Effect to build the level grid and reset state
  useEffect(() => {
    if (initialLevels.length > 0) {
      buildLevelGrid();
      setSelectedPositions([]);
      setHintsUsed(0);
      setStatus("playing");
      setFoundAnswers([]);
    }
  }, [levelIndex, language, LEVELS]);

  function posEq(a, b) {
    return a && b && a[0] === b[0] && a[1] === b[1];
  }

  function isSelected(r, c) {
    return selectedPositions.some((s) => posEq(s, [r, c])) || currentPathRef.current.some((s) => posEq(s, [r, c]));
  }

  function getFoundColor(r, c) {
    const found = foundAnswers.find(ans => ans.path.some(pos => posEq(pos, [r, c])));
    return found ? found.color : "";
  }

  // Dragging logic
  const handleMouseDown = (r, c) => {
    if (status !== "playing") return;
    setIsDragging(true);
    startPosRef.current = [r, c];
    currentPathRef.current = [[r, c]];
    setSelectedPositions([[r, c]]); // Immediately select the starting cell
  };

  const handleMouseEnter = (r, c) => {
    if (!isDragging || status !== "playing") return;

    const lastPos = currentPathRef.current[currentPathRef.current.length - 1];
    if (posEq(lastPos, [r, c])) return; // Don't re-add the same cell

    // Check if the new cell is adjacent to the last selected cell in a straight line
    const [lastR, lastC] = lastPos;
    const dr = Math.abs(r - lastR);
    const dc = Math.abs(c - lastC);

    // Only allow straight or diagonal lines (dr <=1 and dc <=1, but not both 0)
    if ((dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0)) {
        // Check if it maintains a consistent direction if path length > 1
        if (currentPathRef.current.length > 1) {
            const secondLastPos = currentPathRef.current[currentPathRef.current.length - 2];
            const prevDr = lastR - secondLastPos[0];
            const prevDc = lastC - secondLastPos[1];
            const currentDr = r - lastR;
            const currentDc = c - lastC;

            // Ensure direction is consistent or opposite if reversing
            if (prevDr !== 0 && currentDr !== 0 && Math.sign(prevDr) !== Math.sign(currentDr)) {
                return; // Not a consistent straight line
            }
            if (prevDc !== 0 && currentDc !== 0 && Math.sign(prevDc) !== Math.sign(currentDc)) {
                return; // Not a consistent straight line
            }
            // For diagonal, ensure both dr and dc match sign
            if (prevDr !== 0 && prevDc !== 0 && (Math.sign(prevDr) !== Math.sign(currentDr) || Math.sign(prevDc) !== Math.sign(currentDc))) {
                return;
            }
            // Allow reversing direction
            if (posEq([r, c], secondLastPos)) {
                currentPathRef.current.pop(); // Remove last cell if moving back
                setSelectedPositions(currentPathRef.current);
                return;
            }
        }
        currentPathRef.current = [...currentPathRef.current, [r, c]];
        setSelectedPositions(currentPathRef.current);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    startPosRef.current = null;
  };

  useEffect(() => {
    // Add global event listeners for mouse up to handle cases where drag ends outside the grid
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  function handleHint() {
    if (!currentObj) return;
    if (hintsUsed >= 2) {
      setShowHintOverModal(true);
      return;
    }
    const idx = currentAnswerPath.findIndex((pos) => !selectedPositions.some((s) => posEq(s, pos)));
    if (idx === -1) {
      setHintsUsed((h) => h + 1);
      if (hintsUsed + 1 >= 2) setShowHintOverModal(true);
      return;
    }
    const reveal = currentAnswerPath[idx];
    setSelectedPositions((s) => [...s, reveal]);
    const next = hintsUsed + 1;
    setHintsUsed(next);
    if (next >= 2) setTimeout(() => setShowHintOverModal(true), 200);
  }

  function handleSubmit() {
    if (!currentObj) return;
    const selLettersArr = selectedPositions.map(([r, c]) => grid[r][c]);
    const compareSel = normalizeForCompare(selLettersArr, language);
    const fullAnsCompare = normalizeForCompare(currentAnswerArr, language);

    const isCorrect = compareSel === fullAnsCompare && selLettersArr.length === currentAnswerArr.length;

    if (isCorrect) {
      setStatus("correct");
      playCorrectSound();
      setScore((s) => s + POINTS_PER_CORRECT);
      setConfettiRunning(true);
      setTimeout(() => setConfettiRunning(false), 2500);

      const newFoundAnswer = {
        path: selectedPositions,
        color: ANSWER_COLORS[foundAnswers.length % ANSWER_COLORS.length]
      };
      setFoundAnswers(prev => [...prev, newFoundAnswer]);

      if (qIndex === levelQuestions.length - 1) {
        setTimeout(() => {
          setShowLevelCompleteModal(true);
          playLevelCompleteSound();
        }, 700);
      }
    } else {
      setStatus("wrong");
      playWrongSound();
      if (qIndex === levelQuestions.length - 1) {
        setTimeout(() => {
          setShowLevelCompleteModal(true);
        }, 700);
      }
    }
  }

  function handleNext() {
    const nextQ = qIndex + 1;
    setSelectedPositions([]);
    currentPathRef.current = []; // Clear current drag path
    setHintsUsed(0);
    setStatus("playing");
    if (nextQ < levelQuestions.length) {
      setQIndex(nextQ);
    } else {
      const canUnlock = score >= REQUIRED_TO_UNLOCK;
      if (canUnlock && levelIndex + 1 < LEVELS.length) {
        setQIndex(0); // Reset question index for the new level
        setLevelIndex((l) => l + 1);
        setUnlocked((u) => {
          const n = [...u];
          n[levelIndex + 1] = true;
          return n;
        });
      } else if (levelIndex + 1 >= LEVELS.length && canUnlock) {
        setShowFinalCompletionModal(true);
        setStatus("finished");
        playVictorySound();
        setConfettiRunning(true);
        setTimeout(() => setConfettiRunning(false), 5000);
      } else {
        setShowLevelCompleteModal(true);
      }
    }
  }

  function chooseLevel(i) {
    if (!unlocked[i]) return;
    setLevelIndex(i);
    setQIndex(0); // Reset question index when changing levels
  }

  function getCellClass(r, c) {
    const base = "w-14 h-14 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg font-extrabold text-lg md:text-xl cursor-pointer border shadow select-none";
    const selected = isSelected(r, c);
    const inCurrentAnswerPath = currentAnswerPath.some((p) => posEq(p, [r, c]));

    if (selected && status === "playing") {
        return base + " bg-yellow-300 hover:scale-105 transform transition";
    }

    if (status === "correct" && inCurrentAnswerPath) {
        return base + " text-white scale-105 transform transition";
    }

    if (status === "wrong" && inCurrentAnswerPath) {
        return base + " text-white";
    }

    return base + " bg-white/90 hover:scale-105 transform transition";
  }

  function getCellStyle(r, c) {
    const foundColor = getFoundColor(r, c);
    if (foundColor) {
      return { backgroundColor: foundColor, color: "white" };
    }
    if (status === "correct") {
        const inCurrentAnswerPath = currentAnswerPath.some((p) => posEq(p, [r, c]));
        if (inCurrentAnswerPath) {
          return { backgroundColor: ANSWER_COLORS[foundAnswers.length % ANSWER_COLORS.length], color: "white" };
        }
    }
    if (status === "wrong") {
        const inCurrentAnswerPath = currentAnswerPath.some((p) => posEq(p, [r, c]));
        if (inCurrentAnswerPath) {
            return { backgroundColor: "#FCA5A5", color: "white" };
        }
    }
    return {};
  }

  // Add a loading state
  const [isLoading, setIsLoading] = useState(true);

  // Update the useEffect that loads questions
  useEffect(() => {
    // Only generate new questions when the component first mounts
    if (initialLevels.length === 0) {
      setIsLoading(true);
      const newLevels = [
        getQuestionsForLevel(0, language),
        getQuestionsForLevel(1, language),
        getQuestionsForLevel(2, language)
      ];
      setInitialLevels(newLevels);
      setIsLoading(false);
    }
  }, [initialLevels]);

  // Update the restart function
  function restartAll(goToDashboard = false) {
    setIsLoading(true);
    setLevelIndex(0);
    setQIndex(0);
    setScore(0);
    setUnlocked([true, false, false]);
    setShowFinalModal(false);
    setShowTimeoutModal(false);
    setShowFinalCompletionModal(false);
    setStatus("playing");
    setSelectedPositions([]);
    currentPathRef.current = [];
    setHintsUsed(0);
    setTimeLeft(TIMER_DURATION);
    setTimerActive(true);
    setFoundAnswers([]);
    
    // Reset initial levels to trigger new question generation
    setInitialLevels([]);
    
    if (goToDashboard) {
      navigate("/leaderboard");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#BCA5D4]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

return (
  <Background>
    <Logo />
    <div className="min-h-screen w-full flex flex-col items-center relative text-slate-900">

      {/* Header & Level selector */}
      <div className="w-[90%] max-w-[80vw] flex flex-col sm:flex-row items-center justify-between mb-[3vh] gap-[1vh]">
        <div className="text-black text-[3vh] text-center font-bold w-[35vw]">
          {T.title} — {T.level} {levelIndex + 1}
        </div>
        <div className="flex gap-[1vw] flex-wrap justify-center mt-[2vh]">
          {LEVELS.map((_, i) => (
            <button
              key={i}
              onClick={() => chooseLevel(i)}
              disabled={!unlocked[i]}
              className={`px-[1.5vw] py-[1.5vh] rounded-[1vh] font-bold ${
                unlocked[i]
                  ? "bg-[#7FB3E0] text-black text-[2vh]"
                  : "bg-[#7FB3E0] text-black/40 text-[2vh] cursor-not-allowed"
              }`}
            >
              {T.level} {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Split Screen */}
      <div className="flex flex-row w-full max-w-[90vw] h-[75vh] gap-[2vw]">

        {/* Left side */}
        <div className="w-1/2 flex flex-col justify-center items-center">
          {/* Score & Timer */}
<div className="flex flex-row items-center justify-center gap-[2vw] mb-[2vh]">
  <div className="bg-[#7FB3E0] text-black text-[2vh] px-[3vw] py-[2vh] rounded-[1.5vh] shadow-lg font-bold">
    {T.score}: {score}
  </div>
  <div className="bg-[#7FB3E0] text-black text-[2vh] px-[3vw] py-[2vh] rounded-[1.5vh] shadow-lg font-bold">
    {T.time}: {formatTime(timeLeft)}
  </div>
</div>


          {/* Question card */}
          <div className="w-[90%] bg-[#EFE2FA]/80 backdrop-blur-md rounded-[2vh] p-[3vh] shadow-xl border border-gray-600 text-center" 
          style={{
  background: "linear-gradient(135deg, #BACBFE, #C1DDE8)",
  backdropFilter: "blur(2vh)", // 16px ≈ 2vh
  borderRadius: "3vh",         // 1.5rem ≈ 24px ≈ 3vh
  boxShadow: "0 5vh 10vh -2vh rgba(0, 0, 0, 0.25)", // 25px ≈ 5vh, 50px ≈ 10vh, 12px ≈ 2vh
}}
>
            <div className="text-black/90 text-[2vh] md:text-[2.5vh] font-semibold">
              {T.question} {qIndex + 1} / {levelQuestions.length}
            </div>
            <div className="text-[2.5vh] md:text-[3vh] text-black font-bold mt-[1vh]">
              {currentObj?.q}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-[1vw] mt-[2vh] justify-center">
            <div className="bg-[#7FB3E0] text-white rounded-[1vh] px-[2vw] py-[1vh] font-mono text-[2vh] min-h-[5vh] flex items-center">
              {selectedPositions.map(([r, c]) => grid[r][c]).join("")}
            </div>

            <button
              onClick={handleHint}
              className="px-[2vw] py-[1vh] rounded-[1vh] bg-[#7FB3E0]  text-white font-semibold shadow"
            >
              {T.hint} ({2 - hintsUsed})
            </button>

            {status === "playing" ? (
              <button
                onClick={handleSubmit}
                className="px-[2.5vw] py-[1vh] rounded-[1vh] bg-[#7FB3E0] text-white font-bold shadow"
              >
                {T.submit}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-[2.5vw] py-[1vh] rounded-[1vh] bg-[#7FB3E0] text-black font-bold shadow animate-bounce"
              >
                {T.next}
              </button>
            )}

            <button
              onClick={() => {
                setSelectedPositions([]);
                currentPathRef.current = [];
              }}
              className="px-[2vw] py-[1vh] rounded-[1vh] bg-[#7FB3E0] text-white"
            >
              {T.clear}
            </button>
          </div>
        </div>

        {/* Right side */}
        <div
          className="w-1/2 flex justify-center items-center bg-[#EFE2FA]/50 pl-[3vh] pt-[3vh] pb-[1vh] pr-[1.5vh] rounded-[1vh] shadow-lg h-[80vh]"
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleMouseUp}
          style={{
  background: "linear-gradient(135deg, #BACBFE, #C1DDE8)",
  backdropFilter: "blur(2vh)", // 16px ≈ 2vh
  borderRadius: "3vh",         // 1.5rem ≈ 24px ≈ 3vh
  boxShadow: "0 5vh 10vh -2vh rgba(0, 0, 0, 0.25)", // 25px ≈ 5vh, 50px ≈ 10vh, 12px ≈ 2vh
}}

        >
          <div
            className="grid gap-[0.2vh] aspect-ratio"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              width: "100%",
              height: "100%",
            }}
          >
            {grid.map((row, r) =>
              row.map((ch, c) => (
                <div
                  key={`${r}-${c}`}
                  onMouseDown={() => handleMouseDown(r, c)}
                  onMouseEnter={() => handleMouseEnter(r, c)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleMouseDown(r, c);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    const targetElement = document.elementFromPoint(
                      touch.clientX,
                      touch.clientY
                    );
                    if (
                      targetElement &&
                      targetElement.dataset.row &&
                      targetElement.dataset.col
                    ) {
                      const targetR = parseInt(targetElement.dataset.row);
                      const targetC = parseInt(targetElement.dataset.col);
                      handleMouseEnter(targetR, targetC);
                    }
                  }}
                  className={`${getCellClass(r, c)} flex items-center justify-center border rounded-lg cursor-pointer`}
                  style={{
                    ...getCellStyle(r, c),
                    width: "8vh",
                    height: "8vh",
                    fontSize: "3vh",
                  }}
                  data-row={r}
                  data-col={c}
                >
                  <span>{ch}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* language toggle bottom-right */}
      

      {/* ---- MODALS ---- */}
      {showHintOverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#DEEBF7] rounded-2xl p-6 w-[90%] max-w-md text-center shadow-2xl">
            <h3 className="text-2xl text-[#2A60A0] font-bold mb-2">{T.hintsOver}</h3>
            <p className="mb-4 text-[#2A60A0]">{T.hintsMsg}</p>
            <button
              onClick={() => setShowHintOverModal(false)}
              className="px-5 py-2 bg-[#2A60A0] text-white rounded-lg font-bold"
            >
              {T.ok}
            </button>
          </div>
        </div>
      )}

      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-[#DEEBF7] p-6 rounded-2xl shadow-lg text-center text-xl font-bold ">
            <h3 className="text-[#2A60A0] text-2xl font-bold mb-2">{T.timeUp}</h3>
            <p className="mb-4 text-[#2A60A0]">{T.timeoutMsg}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => restartAll(false)} className="px-5 py-2 bg-[#2A60A0] text-white rounded-lg font-semibold">{T.restartGame}</button>
              <button onClick={() => restartAll(true)} className="px-5 py-2 bg-[#2A60A0] text-white rounded-lg font-semibold">{T.leaderboard}</button>
            </div>
          </div>
        </div>
      )}

      {showLevelCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#DEEBF7] rounded-2xl p-6 w-[92%] max-w-lg text-center shadow-2xl">
            <h2 className="text-3xl text-[#2A60A0] font-bold mb-2">{T.levelComplete}</h2>
            <p className="mb-4 text-[#2A60A0]">{T.currentScore} <span className="font-mono">{score}</span></p>
            <p className="mb-4 text-sm text-[#2A60A0]">{score >= REQUIRED_TO_UNLOCK ? "Next level unlocked!" : T.notEnough}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { 
                setShowLevelCompleteModal(false); 
                if (score >= REQUIRED_TO_UNLOCK && levelIndex + 1 < LEVELS.length) { 
                  handleNext(); 
                } else if (score >= REQUIRED_TO_UNLOCK && levelIndex + 1 >= LEVELS.length) { 
                  setShowFinalCompletionModal(true); 
                  playVictorySound(); 
                  setConfettiRunning(true); 
                  setTimeout(() => setConfettiRunning(false), 5000); 
                } 
              }} className="px-5 py-2 bg-[#2A60A0] rounded-lg font-bold">{T.next}</button>
              <button onClick={() => setShowLevelCompleteModal(false)} className="px-5 py-2 bg-[#2A60A0] rounded-lg">{T.close}</button>
            </div>
          </div>
        </div>
      )}

      {showFinalCompletionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
          <div className="bg-[#DEEBF7] rounded-2xl p-6 w-[92%] max-w-md text-center shadow-2xl">
            <h2 className="text-[#2A60A0] text-3xl font-bold mb-2">{T.congratsTitle}</h2>
            <p className=" text-[#2A60A0] mb-4 text-lg">{T.congratsMsg}</p>
            <p className="mb-4 text-[#2A60A0] text-xl font-semibold">{T.finalScore} <span className="font-mono">{score}</span></p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => restartAll(false)} className="px-5 py-2 bg-[#2A60A0] text-white rounded-lg">{T.playAgain}</button>
              <button onClick={() => restartAll(true)} className="px-5 py-2 bg-[#2A60A0] text-white rounded-lg">{T.leaderboard}</button>
            </div>
          </div>
        </div>
      )}

      {showFinalModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
          <div className="bg-[#DEEBF7] rounded-2xl p-6 w-[92%] max-w-md text-center shadow-2xl">
            <h2 className="text-3xl text-[#2A60A0] font-bold mb-2">{T.allComplete}</h2>
            <p className="mb-4 text-[#2A60A0] text-lg">{T.finalMotivation}</p>
            <p className="mb-4 text-xl text-[#2A60A0] font-semibold">{T.currentScore} <span className="font-mono">{score}</span></p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => restartAll(false)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg">{T.playAgain}</button>
              <button onClick={() => restartAll(true)} className="px-5 py-2 bg-green-600 text-white rounded-lg">{T.leaderboard}</button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti */}
      <Confetti running={confettiRunning} />
    </div>
    <LanguageToggle currentLanguage={language} onPress={handleLanguage}/>
  </Background>
);


}