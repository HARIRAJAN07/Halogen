import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SmallProgress({ value = 0, max = 100 }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg,#a855f7,#d8b4fe)",
          boxShadow: "0 4px 14px rgba(168,85,247,0.18)",
        }}
      />
    </div>
  );
}

function Badge({ title, subtitle, icon }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="flex flex-col items-center gap-1 p-2 bg-white/90 rounded-xl shadow-md w-20"
    >
      <div className="text-xl">{icon}</div>
      <div className="text-xs font-semibold text-slate-800 text-center">{title}</div>
      <div className="text-[10px] text-slate-500 text-center">{subtitle}</div>
    </motion.div>
  );
}

export default function ScienceProfile({ profile = null }) {
  const demo = {
    name: "Aanya R.",
    school: "St. Mary's",
    gender: "Female",
    points: 1420,
    level: 4,
    rank: 12,
    nextLevelTarget: 2000,
    quizzesCompleted: 18,
    timeMinutes: 420,
    badges: [
      { id: 1, title: "Lab Master", subtitle: "5 quizzes", icon: "🧪" },
      { id: 2, title: "Atom Ace", subtitle: "Accuracy 92%", icon: "⚛️" },
      { id: 3, title: "Top 10%", subtitle: "Leaderboard", icon: "🏅" },
    ],
  };

  const data = profile || demo;

  const [fact, setFact] = useState("");
  const [mood, setMood] = useState("🙂");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const facts = [
      "A single teaspoon of honey represents the life's work of 12 bees.",
      "Water can boil and freeze at the same time — called the triple point.",
      "There are more trees on Earth than stars in the Milky Way.",
      "Venus spins backwards — the Sun rises in the west there.",
      "DNA was first photographed by Rosalind Franklin.",
      "Bananas are slightly radioactive thanks to potassium-40.",
    ];
    setFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  useEffect(() => {
    if (data.points > 1500) setMood("🤩");
    else if (data.points > 900) setMood("😄");
    else setMood("🙂");
  }, [data.points]);

  const minutesToHrs = (m) => {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m`;
  };

  const progressPct = Math.round((data.points / data.nextLevelTarget) * 100);
  const floating = ["🦠", "🤖", "🔬", "🧪", "🧫", "🔍", "🧲", "🧬"];

  return (
    <div
      className="min-h-screen flex items-center justify-center relative p-6 overflow-hidden"
      style={{
        backgroundImage: `url('/upscalemedia-transformed.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0"></div>

      {/* Unique Bottom Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-10 px-5 py-3 bg-white/10 backdrop-blur-lg rounded-full shadow-lg">
        {/* Leaderboard */}
        <div className="relative group cursor-pointer">
          <div
            onClick={() => console.log("Go to Leaderboard")}
            className="w-10 h-10 rounded-full border-2 border-purple-400 flex items-center justify-center bg-gradient-to-tr from-purple-500 to-purple-600 shadow-md hover:scale-110 transition-transform"
          >
            <span className="text-white font-bold">L</span>
            <motion.div
              className="absolute w-14 h-14 rounded-full border border-purple-300 opacity-40"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[9px] font-semibold text-purple-600">
            Leaderboard
          </div>
        </div>

        {/* Profile (current page) */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-700 to-purple-900 flex items-center justify-center shadow-lg border-2 border-purple-400 animate-pulse">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[9px] font-semibold text-white">
            Profile
          </div>
        </div>

        {/* Game */}
        <div className="relative group cursor-pointer">
          <div
            onClick={() => console.log("Go to Game Page")}
            className="w-10 h-10 rounded-full border-2 border-pink-400 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-pink-600 shadow-md hover:scale-110 transition-transform"
          >
            <span className="text-white font-bold">G</span>
            <motion.div
              className="absolute w-14 h-14 rounded-full border border-pink-300 opacity-40"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[9px] font-semibold text-pink-600">
            Game
          </div>
        </div>
      </div>

      {/* Floating emojis */}
      {Array.from({ length: 40 }).map((_, i) => {
        const cols = 10;
        const rows = 4;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const baseLeft = (col / cols) * 100;
        const baseTop = (row / rows) * 100;
        const left = baseLeft + (Math.random() * 6 - 3);
        const top = baseTop + (Math.random() * 6 - 3);
        const size = 0.8 + Math.random() * 1.4;
        const opacity = 0.05 + Math.random() * 0.15;
        const emoji = floating[i % floating.length];

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ duration: 0.8, delay: Math.random() * 1.2 }}
            className="absolute pointer-events-none select-none z-0"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}rem`,
              transform: `translate(-50%,-50%)`,
              filter: "drop-shadow(0 6px 18px rgba(139,92,246,0.06))",
            }}
          >
            <motion.span
              animate={{ y: [0, -6, 0], rotate: [0, 4, -4, 0] }}
              transition={{ repeat: Infinity, duration: 6 + Math.random() * 6, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              {emoji}
            </motion.span>
          </motion.div>
        );
      })}

      {/* Main Grid */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6 justify-center items-center">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="col-span-1 rounded-xl bg-gradient-to-br from-purple-200 to-purple-300 p-6 shadow-xl border border-purple-300 flex flex-col justify-between h-[70vh]"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center text-4xl shadow-md"
              >
                <span role="img" aria-label="avatar">👩‍🔬</span>
              </motion.div>
              <div className="absolute -bottom-2 -right-2">
                <motion.div
                  animate={{ scale: [0.9, 1.08, 0.9] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md text-lg"
                >
                  {mood}
                </motion.div>
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {data.name}
              </div>
              <div className="text-sm text-purple-700 font-semibold">{data.school}</div>
              <div className="mt-2 inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                Gender:
                <span className="px-2 py-0.5 rounded-md bg-white shadow-sm text-slate-700">{data.gender}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-sm text-purple-700">Points</div>
                <div className="text-3xl font-extrabold text-purple-700">{data.points}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-700">Level</div>
                <div className="text-xl font-bold" style={{ color: "#7c3aed", fontFamily: "'Orbitron', sans-serif" }}>
                  {data.level}
                </div>
                <div className="text-[11px] text-purple-600">Rank #{data.rank}</div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1 text-xs text-purple-600">
                <div>Progress</div>
                <div>{progressPct}%</div>
              </div>
              <SmallProgress value={data.points} max={data.nextLevelTarget} />
            </div>
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-sm shadow"
              >
                View Achievements
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 1200);
                }}
                className="px-4 py-2 rounded-lg border border-purple-300 bg-white font-semibold text-purple-700 text-sm"
              >
                Celebrate
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Middle Section */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-xl bg-gradient-to-br from-purple-200 to-purple-300 p-6 shadow-xl border border-purple-300 flex flex-col justify-between h-[70vh]"
        >
          <div>
            <div className="text-xs text-purple-700">Badges</div>
            <div className="text-xl font-extrabold" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Earned
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {data.badges.map((b) => (
                <Badge key={b.id} {...b} />
              ))}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-xl border border-dashed border-purple-400 p-4 bg-white/60 text-xs text-purple-500"
                >
                  Locked
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 text-sm">
              <div className="text-purple-600">Quizzes</div>
              <div className="text-xl font-bold">{data.quizzesCompleted}</div>
              <div className="text-purple-500">Completed</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 text-sm">
              <div className="text-purple-600">Time</div>
              <div className="text-xl font-bold">{minutesToHrs(data.timeMinutes)}</div>
              <div className="text-purple-500">Learning time</div>
            </div>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-xl bg-gradient-to-br from-purple-200 to-purple-300 p-6 shadow-xl border border-purple-300 flex flex-col justify-between h-[70vh]"
        >
          <div>
            <div className="text-xs text-purple-700">Science Fact of the Day</div>
            <div className="text-lg font-extrabold mt-2">{fact}</div>
          </div>
          <div className="mt-6">
            <div className="text-xs text-purple-700 mb-3">Recent Activity</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold">Q</div>
                <div>
                  <div className="font-semibold">Completed: Quiz 12</div>
                  <div className="text-purple-500 text-xs">Scored 92%</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 font-bold">B</div>
                <div>
                  <div className="font-semibold">Badge Earned: Lab Master</div>
                  <div className="text-pink-500 text-xs">+250 points</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="mt-6 text-xs text-purple-600">
            Tip: Complete quizzes to level up faster!
          </div>
        </motion.div>
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-30"
          >
            {Array.from({ length: 30 }).map((_, i) => {
              const left = Math.random() * 100;
              const top = Math.random() * 40 + 10;
              const size = Math.random() * 12 + 6;
              const bg = ["#7c3aed", "#a855f7", "#d8b4fe", "#f472b6"][i % 4];
              return (
                <motion.div
                  key={i}
                  initial={{ y: -20, scale: 0.4, opacity: 0 }}
                  animate={{ y: 380 + Math.random() * 100, scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 + Math.random() * 0.6, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `${top}%`,
                    width: size,
                    height: size,
                    background: bg,
                    borderRadius: 6,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
