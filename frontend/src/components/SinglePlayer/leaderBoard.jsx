import React, { useState } from "react";
import { motion } from "framer-motion";
import BackButton from "../utils/backbutton";
import Footer from "../utils/Footer";

// Add this in index.html inside <head>
// <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&display=swap" rel="stylesheet">

function ProgressBar({ value, max = 100 }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="w-40 bg-slate-800/10 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg,#7c3aed,#6366f1)",
        }}
      />
    </div>
  );
}

export default function Leaderboard() {
  const [studentLeaders] = useState([
    { id: 1, name: "Monica", school: "XYZ School", score: 980 },
    { id: 2, name: "Joey", school: "ABC School", score: 940 },
    { id: 3, name: "Chandler", school: "LMN School", score: 920 },
  ]);

  const [schoolLeaders] = useState([
    { school: "XYZ School", points: 3520 },
    { school: "ABC School", points: 2980 },
    { school: "LMN School", points: 2710 },
  ]);

  const maxSchoolPoints = Math.max(...schoolLeaders.map((s) => s.points), 1000);

  const floatingEmojis = ["🦠", "🤖", "🔬", "🧪", "🧫", "🔍", "🧲", "🧬"];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-100 via-sky-50 to-white relative overflow-hidden">
      {/* Floating Emojis evenly distributed with random offset */}
      {Array.from({ length: 120 }).map((_, i) => {
        const emoji = floatingEmojis[i % floatingEmojis.length];

        // Create a grid (e.g., 12 columns x 10 rows)
        const columns = 12;
        const rows = 10;

        const row = Math.floor(i / columns);
        const col = i % columns;

        // Base position from grid
        const baseTop = (row / rows) * 100;
        const baseLeft = (col / columns) * 100;

        // Add a small random offset for natural look
        const top = baseTop + Math.random() * 5; // ± 5%
        const left = baseLeft + Math.random() * 5;

        const size = Math.random() * 2 + 2; // 2rem to 4rem
        const opacity = Math.random() * 0.15 + 0.1;

        return (
          <motion.div
            key={i}
            className="absolute select-none pointer-events-none"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              fontSize: `${size}rem`,
              opacity: opacity,
            }}
            animate={{
              x: [0, 20, -20, 0],
              y: [0, 15, -15, 0],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.div>
        );
      })}

      {/* Leaderboard Only */}
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 rounded-3xl bg-white/80 border border-slate-100 shadow-2xl"
        >
          <div>
            <h2
              className="text-3xl font-extrabold text-purple-700"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              Leaderboards
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Top students & schools — climb the ranks
            </p>
          </div>

          {/* Student Rankings */}
          <div className="space-y-4">
            <div className="rounded-2xl p-4 bg-purple-50 border border-purple-100 shadow-sm">
              <h3 className="font-semibold text-purple-700 mb-2">Top Students</h3>
              <ol className="space-y-2">
                {studentLeaders.map((s, idx) => (
                  <motion.li
                    key={s.id}
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center justify-between p-2 rounded-lg bg-white shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center font-semibold text-slate-800">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.school}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-indigo-600">{s.score}</div>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* School Rankings */}
            <div className="rounded-2xl p-4 bg-purple-50 border border-purple-100 shadow-sm">
              <h3 className="font-semibold text-purple-700 mb-2">School Rankings</h3>
              <div className="grid gap-3">
                {schoolLeaders.map((sch) => (
                  <div
                    key={sch.school}
                    className="flex items-center justify-between p-3 rounded-lg bg-white shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-sm font-semibold">
                        {sch.school.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <div className="font-bold">{sch.school}</div>
                        <div className="text-xs text-slate-500">
                          Points: {sch.points}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={sch.points} max={maxSchoolPoints} />
                      <div className="text-sm font-semibold">{sch.points}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
      <BackButton />
    </div>
  );
}
