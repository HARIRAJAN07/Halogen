import React, { useState, useEffect } from "react";

const floatingEmojis = ["🔬", "🧪", "⚛️", "🤖", "🔭", "🧬", "🌡️", "💡", "📡", "🛰️"];

const Background = ({ children }) => {
  const [emojiData, setEmojiData] = useState([]);

  useEffect(() => {
    const generatedEmojis = Array.from({ length: 120 }).map((_, i) => {
      const emoji = floatingEmojis[i % floatingEmojis.length];

      const columns = 12;
      const rows = 10;
      const row = Math.floor(i / columns);
      const col = i % columns;

      const baseTop = (row / rows) * 100;
      const baseLeft = (col / columns) * 100;

      const top = baseTop + Math.random() * 5;
      const left = baseLeft + Math.random() * 5;

      const size = Math.random() * 2 + 2; // 2rem - 4rem
      const opacity = Math.random() * 0.15 + 0.1;

      return {
        id: i,
        emoji,
        top,
        left,
        size,
        opacity,
      };
    });
    setEmojiData(generatedEmojis);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.floatingLayer}>
        {emojiData.map((data) => (
          <div
            key={data.id}
            className="absolute select-none pointer-events-none"
            style={{
              top: `${data.top}%`,
              left: `${data.left}%`,
              fontSize: `${data.size}rem`,
              opacity: data.opacity,
              position: "absolute",
            }}
          >
            {data.emoji}
          </div>
        ))}
      </div>

      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#e8f9ff",
    padding: "2vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  floatingLayer: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  content: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
};

export default Background;
