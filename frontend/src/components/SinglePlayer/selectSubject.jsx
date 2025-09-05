import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BgImage from "../../assets/BgImage.png";
import bubble from "../../assets/bubble.png";

const subjects = [
  { name: "Tamil", games: ["Match the Following", "Game 1"] },
  { name: "English", games: ["Match the Following", "Game 2"] },
  { name: "Maths", games: ["Match the Following", "Game 3"] },
  { name: "Science", games: ["Match the Following", "Game 4"] },
  { name: "Social Science", games: ["Match the Following", "Game 5"] },
];

export default function SelectSubject() {
  const [active, setActive] = useState(null);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="grid grid-cols-2 gap-[8vmin] mb-12">
        {subjects.slice(0, 2).map((subject, index) => (
          <motion.div
            key={subject.name}
            className="relative flex items-center justify-center text-center cursor-pointer"
            style={{
              width: "55vmin",
              height: "55vmin",
              backgroundImage: `url(${bubble})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
            onClick={() => setActive(active === index ? null : index)}
          >
            <span
              className="relative z-10 font-extrabold text-blue-900 drop-shadow-lg leading-tight flex items-center justify-center px-[2vmin] text-center"
              style={{
                fontSize: "2.5vmin",
                maxWidth: "80%",
                wordWrap: "break-word",
                lineHeight: "1.3",
              }}
            >
              {subject.name}
            </span>

            <AnimatePresence>
              {active === index && (
                <>
                  {subject.games.map((game, gIndex) => (
                    <motion.div
                      key={game}
                      className="absolute flex items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-lg text-white font-semibold hover:from-blue-400 hover:to-blue-600 transition bg-opacity-90 z-20 text-center"
                      style={{
                        width: "20vmin",
                        height: "20vmin",
                        fontSize: "2.2vmin",
                        padding: "1vmin",
                        lineHeight: "1.2",
                      }}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: 1,
                        x: gIndex === 0 ? "-100%" : "100%",
                        y: "-100%",
                      }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {game}
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-[6vmin]">
        {subjects.slice(2).map((subject, index) => (
          <motion.div
            key={subject.name}
            className="relative flex items-center justify-center text-center cursor-pointer"
            style={{
              width: "55vmin",
              height: "55vmin",
              backgroundImage: `url(${bubble})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
            onClick={() =>
              setActive(active === index + 2 ? null : index + 2)
            }
          >
            <span
              className="relative z-10 font-extrabold text-blue-900 drop-shadow-lg leading-tight flex items-center justify-center px-[2vmin] text-center"
              style={{
                fontSize: "2.5vmin",
                maxWidth: "80%",
                wordWrap: "break-word",
                lineHeight: "1.3",
              }}
            >
              {subject.name}
            </span>

            <AnimatePresence>
              {active === index + 2 && (
                <>
                  {subject.games.map((game, gIndex) => (
                    <motion.div
                      key={game}
                      className="absolute flex items-center justify-center rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-lg text-white font-semibold hover:from-blue-400 hover:to-blue-600 transition bg-opacity-90 z-20 text-center"
                      style={{
                        width: "20vmin",
                        height: "20vmin",
                        fontSize: "2.2vmin",
                        padding: "1vmin",
                        lineHeight: "1.2",
                      }}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: 1,
                        x: gIndex === 0 ? "-100%" : "100%",
                        y: "-100%",
                      }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {game}
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
