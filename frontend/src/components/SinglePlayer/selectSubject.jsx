import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { useNavigate, useParams } from "react-router-dom";
import FloatingBackground from '../utils/FloatingBackground';

import scienceGif from "../../assets/science.gif";
import mathGif from "../../assets/math.gif";
import socialGif from "../../assets/social.gif";
import tamilGif from "../../assets/tamil.gif";
import englishGif from "../../assets/english.gif";

const subjects = [
  { en: "Science", ta: "அறிவியல்", gif: scienceGif, color: "bg-[#BCA5D4]" },
  { en: "Math", ta: "கணிதம்", gif: mathGif, color: "bg-[#BCA5D4]" },
  { en: "Social Studies", ta: "சமூக அறிவியல்", gif: socialGif, color: "bg-[#BCA5D4]" },
  { en: "Tamil", ta: "தமிழ்", gif: tamilGif, color: "bg-[#BCA5D4]" },
  { en: "English", ta: "ஆங்கிலம்", gif: englishGif, color: "bg-[#BCA5D4]" }
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring', stiffness: 300, damping: 30 };

const SubjectSelection = () => {
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const { classId, displayName } = useParams();

  const autoplay = true;
  const autoplayDelay = 3000;
  const pauseOnHover = true;
  const loop = true;
  const baseWidth = 300;

  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...subjects, subjects[0]] : subjects;
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === subjects.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, subjects.length, carouselItems.length, pauseOnHover]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === subjects.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex(prev => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(subjects.length - 1);
      } else {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop ? {} : {
    dragConstraints: {
      left: -trackItemOffset * (carouselItems.length - 1),
      right: 0
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-transparent flex flex-col items-center justify-center">
      <FloatingBackground />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-transparent">
        {/* Language Toggle Button */}
        <button
          onClick={() => setLanguage(language === "en" ? "ta" : "en")}
          className="absolute top-6 left-6 px-6 py-3 text-lg rounded-lg bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition z-20"
        >
          {language === "en" ? "தமிழ்" : "English"}
        </button>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-black mb-2 sm:mb-4 drop-shadow-sm">
          {language === "en" ? "Choose Your Subject" : "உங்கள் பாடத்தைத் தேர்வு செய்யுங்கள்"}
        </h1>
        <p className="text-md sm:text-xl text-gray-700 text-center mb-8 sm:mb-12">
          {language === "en"
            ? "Scroll or drag to view subjects. Click any card to begin!"
            : "பாடங்களை காண ஸ்க்ரோல் செய்யவும் அல்லது இழுக்கவும். தொடங்க எந்த கார்டையும் கிளிக் செய்யவும்!"}
        </p>
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{
            width: `${baseWidth}px`,
            height: '400px'
          }}
        >
          <motion.div
            className="flex h-full w-full"
            drag="x"
            {...dragProps}
            style={{
              width: itemWidth,
              gap: `${GAP}px`,
              perspective: 1000,
              perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
              x
            }}
            onDragEnd={handleDragEnd}
            animate={{ x: -(currentIndex * trackItemOffset) }}
            transition={effectiveTransition}
            onAnimationComplete={handleAnimationComplete}
          >
            {carouselItems.map((item, index) => {
              const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
              const outputRange = [90, 0, -90];
              const rotateY = useTransform(x, range, outputRange, { clamp: false });

              return (
                <motion.div
                  key={index}
                  className="relative shrink-0 flex flex-col items-center justify-center bg-gray-200 border border-gray-200 rounded-[12px] overflow-hidden cursor-pointer active:cursor-grabbing"
                  style={{
                    width: itemWidth,
                    height: '100%',
                    rotateY: rotateY,
                  }}
                  transition={effectiveTransition}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/single/${classId}/${displayName}/${item.en.toLowerCase()}`);
                  }}
                >
                  <div
                    className={`${item.color} absolute inset-0 rounded-3xl shadow-xl flex flex-col items-center justify-center p-4 sm:p-6`}
                  >
                    <img
                      src={item.gif}
                      alt={item.en}
                      className="w-24 h-24 sm:w-32 sm:h-32 2xl:w-[8vw] 2xl:h-[8vh] mb-2 sm:mb-4 object-contain"
                    />
                    <h2 className="text-2xl sm:text-4xl 2xl:text-5xl text-white font-bold text-center drop-shadow-lg">
                      {item[language]}
                    </h2>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        <div className="flex w-full justify-center">
          <div className="mt-4 flex w-[150px] justify-between px-8">
            {subjects.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                  currentIndex % subjects.length === index
                    ? 'bg-purple-600'
                    : 'bg-gray-400'
                }`}
                animate={{
                  scale: currentIndex % subjects.length === index ? 1.2 : 1
                }}
                onClick={() => setCurrentIndex(index)}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
