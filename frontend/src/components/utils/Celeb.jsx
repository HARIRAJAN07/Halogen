import React, { useState, useEffect, useRef } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Fireworks } from "@fireworks-js/react";
//import tabla from "../../assets/tabla.mp3";

const TablaCelebration = ({ show, stop }) => {
  const audioRef = useRef(null);
  const [active, setActive] = useState(false);
  const [key, setKey] = useState(0);
  const timerRef = useRef(null); // keep reference to timeout

  useEffect(() => {
    if (show) {
      setKey(prev => prev + 1); // force remount
      setActive(true);

      // Play tabla sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }

      // Auto stop after 8 seconds
      timerRef.current = setTimeout(() => {
        setActive(false);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }, 8000);
    }

    return () => clearTimeout(timerRef.current); // clear old timer
  }, [show]);

  useEffect(() => {
    if (stop) {
      // Stop immediately
      setActive(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setKey(prev => prev + 1); // reset fireworks/confetti
      clearTimeout(timerRef.current); // clear any running timer
    }
  }, [stop]);

  if (!active) return null;

  return (
    <div
      key={key}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <audio ref={audioRef} src={tabla} />
      <Fireworks
        key={`fw-${key}`}
        duration={8000}
        options={{
          rocketsPoint: { min: 50, max: 50 },
          hue: { min: 0, max: 360 },
          delay: { min: 30, max: 60 },
          speed: 5,
          acceleration: 1.05,
          friction: 0.95,
          gravity: 1.5,
          particles: 100,
          trace: 3,
          explosion: 6,
        }}
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
      <ConfettiExplosion
        key={`cf-${key}`}
        force={0.7}
        duration={8000}
        particleCount={150}
        width={1200}
        style={{ position: "absolute", zIndex: 10 }}
      />
    </div>
  );
};

export default TablaCelebration;
