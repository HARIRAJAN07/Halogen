import React, { useEffect, useMemo, useState } from "react";
import socialData from '../data/social.json';

const GRID_SIZE = 9;
const POINTS_PER_CORRECT = 10;
const REQUIRED_TO_UNLOCK = 20;
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
      "You've used both hints for this question. Try the next question or continue with the letters you already have.",
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
    timeoutMsg: "Time's up! You can restart the game to try again.",
    congratsTitle: "Congratulations! 🎉",
    congratsMsg: "You have completed all levels! Good job!",
    finalScore: "Your final score:"
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
      "இந்த கேள்விக்கான இரண்டு குறிப்புகளும் பயன்படுத்தப்பட்டு விட்டன. அடுத்த கேள்வியை முயற்சிக்கவும்.",
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
    timeoutMsg: "நேரம் முடிந்துவிட்டது! மீண்டும் முயற்சி செய்ய விளையாட்டை மீண்டும் தொடங்கலாம்.",
    congratsTitle: "வாழ்த்துக்கள்! 🎉",
    congratsMsg: "அனைத்து நிலைகளையும் முடித்துவிட்டீர்கள்! நல்ல வேலை!",
    finalScore: "உங்கள் இறுதி மதிப்பெண்:"
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
  const [language, setLanguage] = useState("en");
  const T = TRANSLATIONS[language];
  const ALPHABET = language === "en" ? Array.from(ALPHABET_EN) : arrayFromStr(ALPHABET_TA);

  // State for timer
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [timerActive, setTimerActive] = useState(true);

  // Get questions based on selected grade and level
  const getQuestionsForLevel = (levelIndex, lang = language) => {
    const levelKeys = ["easy", "medium", "hard"];
    const levelKey = levelKeys[levelIndex];

    const grade = "grade6";
    if (!socialData[grade] || !socialData[grade][levelKey]) {
      return [];
    }
    const allQuestions = socialData[grade][levelKey];
    const selectedQuestions = [];
    const usedIndices = new Set();
    while (selectedQuestions.length < QUESTIONS_PER_LEVEL && selectedQuestions.length < allQuestions.length) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const questionObj = allQuestions[randomIndex];
        const selectedQuestion = {
          q: questionObj.q[lang] || questionObj.q.en,
          a: questionObj.a[lang] || questionObj.a.en,
          originalQ: questionObj.q.en, // Store original English question
          originalA: questionObj.a.en  // Store original English answer
        };
        selectedQuestions.push(selectedQuestion);
      }
    }
    return selectedQuestions;
  };

  // Store initial questions in English
  const [initialLevels, setInitialLevels] = useState([]);

  useEffect(() => {
    // Only generate new questions when the component first mounts
    if (initialLevels.length === 0) {
      const newLevels = [
        getQuestionsForLevel(0, "en"),
        getQuestionsForLevel(1, "en"),
        getQuestionsForLevel(2, "en")
      ];
      setInitialLevels(newLevels);
    }
  }, []);

  // This will translate the questions when language changes but maintain progress
  const LEVELS = useMemo(() => {
    if (initialLevels.length === 0) return [[], [], []];
    
    return initialLevels.map(level => {
      return level.map(questionObj => {
        // For each question, find its translation in the current language
        const levelKey = level === initialLevels[0] ? "easy" : 
                         level === initialLevels[1] ? "medium" : "hard";
        
        // Find the matching question in the JSON data using the original English text
        const allQuestions = socialData.grade6?.[levelKey] || [];
        const translatedQuestion = allQuestions.find(q => 
          q.q.en === questionObj.originalQ
        );
        
        return {
          q: translatedQuestion?.q[language] || questionObj.q,
          a: translatedQuestion?.a[language] || questionObj.a,
          originalQ: questionObj.originalQ, // Keep reference to original English text
          originalA: questionObj.originalA  // Keep reference to original English answer
        };
      });
    });
  }, [language, initialLevels]);

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
    buildLevelGrid();
    // Don't reset qIndex here - we want to maintain our progress
    setSelectedPositions([]);
    setHintsUsed(0);
    setStatus("playing");
    setFoundAnswers([]);
  }, [levelIndex, language, LEVELS]);

  function posEq(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }

  function isSelected(r, c) {
    return selectedPositions.some((s) => posEq(s, [r, c]));
  }

  function getFoundColor(r, c) {
    const found = foundAnswers.find(ans => ans.path.some(pos => posEq(pos, [r,c])));
    return found ? found.color : "";
  }

  function handleCellTap(r, c) {
    if (status !== "playing") return;
    if (isSelected(r, c)) return; 
    setSelectedPositions((s) => [...s, [r, c]]);
  }

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
    setHintsUsed(0);
    setStatus("playing");
    if (nextQ < levelQuestions.length) {
      setQIndex(nextQ);
    } else {
      const canUnlock = score >= REQUIRED_TO_UNLOCK;
      if (canUnlock && levelIndex + 1 < LEVELS.length) {
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
  }

  function getCellClass(r, c) {
    const base = "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg font-extrabold text-lg md:text-xl cursor-pointer border shadow select-none";
    const selected = isSelected(r, c);
    const inCurrentAnswerPath = currentAnswerPath.some((p) => posEq(p, [r, c])); // Fixed: changed .sense to .some

    if (selected) {
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
        const inCurrentAnswerPath = currentAnswerPath.some((p) => posEq(p, [r, c])); // Fixed: changed .sense to .some
        if (inCurrentAnswerPath) {
          return { backgroundColor: ANSWER_COLORS[foundAnswers.length % ANSWER_COLORS.length], color: "white" };
        }
    }
    if (status === "wrong") {
        const inCurrentAnswerPath = currentAnswerPath.some((p) => posEq(p, [r, c])); // Fixed: changed .sense to .some
        if (inCurrentAnswerPath) {
            return { backgroundColor: "#FCA5A5", color: "white" };
        }
    }
    return {};
  }
  
  function restartAll() {
    setLevelIndex(0);
    setQIndex(0);
    setScore(0);
    setUnlocked([true, false, false]);
    setShowFinalModal(false);
    setShowTimeoutModal(false);
    setShowFinalCompletionModal(false);
    setStatus("playing");
    setSelectedPositions([]);
    setHintsUsed(0);
    setTimeLeft(TIMER_DURATION);
    setTimerActive(true);
    setFoundAnswers([]);
    setInitialLevels([]); // Reset initial levels to get new questions
  }

  return (
    <div className="min-h-screen p-4 bg-[#BCA5D4] text-slate-900 flex flex-col items-center relative">
      {/* language toggle top-left */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setLanguage((l) => (l === "en" ? "ta" : "en"))}
          className="px-3 py-1 bg-[#EFE2FA] text-black rounded-lg"
        >
          {language === "en" ? "தமிழ்" : "English"}
        </button>
      </div>

      {/* Score and Timer top-right */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
        <div className="bg-[#EFE2FA] text-black px-4 py-2 rounded-md shadow-lg font-semibold">
          {T.score}: {score}
        </div>
        <div className="bg-[#EFE2FA] text-black px-4 py-2 rounded-md shadow-lg font-semibold">
          {T.time}: {formatTime(timeLeft)}
        </div>
      </div>

      {/* header & level selector */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
        <div className="text-white text-2xl font-bold">{T.title} — {T.level} {levelIndex + 1}</div>
        <div className="flex gap-2">
          {LEVELS.map((_, i) => (
            <button
              key={i}
              onClick={() => chooseLevel(i)}
              disabled={!unlocked[i]}
              className={`px-3 py-1 rounded-lg font-semibold ${unlocked[i] ? "bg-[#EFE2FA] text-black" : "bg-[#EFE2FA] text-black/40 cursor-not-allowed"}`}
            >
              {T.level} {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* question card */}
      <div className="w-full max-w-4xl bg-[#EFE2FA]/80 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-gray-600 mb-4">
        <div className="text-black/90 text-lg md:text-xl font-semibold">{T.question} {qIndex + 1} / {levelQuestions.length}</div>
        <div className="text-xl md:text-2xl text-black font-bold mt-2">{currentObj?.q}</div>
      </div>

      {/* grid */}
      <div className="bg-[#EFE2FA]/50 p-4 rounded-xl shadow-lg mb-4">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
          {grid.map((row, r) => row.map((ch, c) => (
            <div key={`${r}-${c}`} onClick={() => handleCellTap(r, c)} className={getCellClass(r, c)} style={getCellStyle(r, c)}>
              <span className="flex items-center justify-center h-full">{ch}</span>
            </div>
          )))}
        </div>
      </div>

      {/* answer preview + controls */}
      <div className="flex flex-wrap items-center gap-3 mt-2 justify-center">
        <div className="bg-gray-700 text-white rounded-lg px-4 py-2 font-mono text-xl min-h-[3rem] flex items-center">
          {selectedPositions.map(([r,c]) => grid[r][c]).join("")}
        </div>

        <button onClick={handleHint} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow">
          {T.hint} ({2 - hintsUsed})
        </button>

        {status === "playing" ? (
          <button onClick={handleSubmit} className="px-5 py-2 rounded-lg bg-green-500 text-white font-bold shadow"> {T.submit} </button>
        ) : (
          <button onClick={handleNext} className="px-5 py-2 rounded-lg bg-yellow-400 text-black font-bold shadow animate-bounce"> {T.next} </button>
        )}

        <button onClick={() => { setSelectedPositions([]); }} className="px-4 py-2 rounded-lg bg-gray-600 text-white">{T.clear}</button>
      </div>

      {/* hint over modal */}
      {showHintOverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">{T.hintsOver}</h3>
            <p className="mb-4 text-slate-700">{T.hintsMsg}</p>
            <button onClick={() => setShowHintOverModal(false)} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold">{T.ok}</button>
          </div>
        </div>
      )}
      
      {/* timeout modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">{T.timeUp}</h3>
            <p className="mb-4 text-slate-700">{T.timeoutMsg}</p>
            <button onClick={restartAll} className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold">{T.restartGame}</button>
          </div>
        </div>
      )}

      {/* level complete modal */}
      {showLevelCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl p-6 w-[92%] max-w-lg text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">{T.levelComplete}</h2>
            <p className="mb-4">{T.currentScore} <span className="font-mono">{score}</span></p>
            <p className="mb-4 text-sm text-gray-700">{score >= REQUIRED_TO_UNLOCK ? "Next level unlocked!" : T.notEnough}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setShowLevelCompleteModal(false); if (score >= REQUIRED_TO_UNLOCK && levelIndex + 1 < LEVELS.length) { handleNext(); } }} className="px-5 py-2 bg-yellow-400 rounded-lg font-bold"> {T.next} </button>
              <button onClick={() => setShowLevelCompleteModal(false)} className="px-5 py-2 bg-gray-200 rounded-lg">{T.close}</button>
            </div>
          </div>
        </div>
      )}

      {/* final completion modal */}
      {showFinalCompletionModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-2xl p-6 w-[92%] max-w-md text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">{T.congratsTitle}</h2>
            <p className="mb-4 text-lg">{T.congratsMsg}</p>
            <p className="mb-4 text-xl font-semibold">{T.finalScore} <span className="font-mono">{score}</span></p>
            <div className="flex gap-3 justify-center">
              <button onClick={restartAll} className="px-5 py-2 bg-indigo-600 text-white rounded-lg">{T.playAgain}</button>
            </div>
          </div>
        </div>
      )}

      {/* final modal (old one for running out of points) */}
      {showFinalModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-2xl p-6 w-[92%] max-w-md text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-2">{T.allComplete}</h2>
            <p className="mb-4 text-lg">{T.finalMotivation}</p>
            <p className="mb-4 text-xl font-semibold">{T.currentScore} <span className="font-mono">{score}</span></p>
            <div className="flex gap-3 justify-center">
              <button onClick={restartAll} className="px-5 py-2 bg-indigo-600 text-white rounded-lg">{T.playAgain}</button>
            </div>
          </div>
        </div>
      )}

      {/* confetti */}
      <Confetti running={confettiRunning} />
    </div>
  );
}