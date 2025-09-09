import React, { useState, useRef, useEffect } from "react";
import adjectives from "../../data/alliterations.json";
import { useNavigate } from "react-router-dom";
import Background from "../utils/FloatingBackground";
import Logo from '../utils/logo';
import avatar1 from '../../assets/Avatar/avatar1.png';
import avatar2 from '../../assets/Avatar/avatar2.png';
import avatar3 from '../../assets/Avatar/avatar3.png';
import avatar4 from '../../assets/Avatar/avatar4.png';
import avatar5 from '../../assets/Avatar/avatar5.png';
import avatar6 from '../../assets/Avatar/avatar6.png';
import BackButton from "../utils/backbutton";

const avatarImages = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

const classOptions = [
// { value: "", label: "Choose class" },
  { value: "6", label: "Class 6" },
  { value: "7", label: "Class 7" },
  { value: "8", label: "Class 8" },
  { value: "9", label: "Class 9" },
  { value: "10", label: "Class 10" },
  { value: "11", label: "Class 11" },
  { value: "12", label: "Class 12" }
];

// Custom dropdown component
function CustomClassDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedLabel =
    classOptions.find((c) => c.value === value)?.label || "Choose class";

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-3 pr-10 rounded-full bg-white text-[#202345] border border-[#C6CBF2] font-medium text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A18CD1] transition"
      >
        {selectedLabel}
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="18" height="18" fill="#202345" viewBox="0 0 20 20">
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </span>
      </button>
      {open && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-[#C6CBF2] rounded-2xl shadow-lg overflow-hidden">
          {classOptions.map((cls) => (
            <li
              key={cls.value}
              onClick={() => {
                onChange(cls.value);
                setOpen(false);
              }}
              className={`px-5 py-3 cursor-pointer transition text-left ${
                value === cls.value
                  ? "bg-gradient-to-r from-[#CBCDDA] to-[#ECEAFF] font-bold text-[#351D6B]"
                  : "hover:bg-[#ECEAFF] text-[#202345]"
              }`}
            >
              {cls.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Player form component
function PlayerForm({ playerNumber, playerData, onUpdate, onNext, isLastPlayer }) {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState(playerData.nickname || "");
  const [displayName, setDisplayName] = useState(playerData.displayName || "");
  const [avatar, setAvatar] = useState(playerData.avatar || "");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [className, setClassName] = useState(playerData.className || "");

  // This useEffect hook will reset the form when the player changes
  useEffect(() => {
    setStep(1);
  }, [playerNumber]);

  const generateAlliteration = (name) => {
    if (!name) return "";
    const firstLetter = name.charAt(0).toUpperCase();
    const wordList = adjectives[firstLetter] || [];
    if (wordList.length === 0) return name;

    const adjective = wordList[Math.floor(Math.random() * wordList.length)];
    return `${adjective} ${name}`;
  };

  const handleNicknameChange = (value) => {
    const cleanName = value.replace(/\s/g, "");
    if (cleanName.length > 0) {
      const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();
      setNickname(formattedName);
      const newDisplayName = generateAlliteration(formattedName);
      setDisplayName(newDisplayName);
      onUpdate(playerNumber, {
        nickname: formattedName,
        displayName: newDisplayName,
        avatar,
        className
      });
    } else {
      setNickname("");
      setDisplayName("");
      onUpdate(playerNumber, {
        nickname: "",
        displayName: "",
        avatar,
        className
      });
    }
  };

  const handleAvatarChange = (value) => {
    setAvatar(value);
    onUpdate(playerNumber, {
      nickname,
      displayName,
      avatar: value,
      className
    });
  };

  const handleClassChange = (value) => {
    setClassName(value);
    onUpdate(playerNumber, {
      nickname,
      displayName,
      avatar,
      className: value
    });
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="text-center flex flex-col items-center">
      <h2 className="text-[4vh] font-bold mb-6" style={{ color: "#351D6B" }}>
        Player {playerNumber} Details
      </h2>
    
      {/* Conditional rendering based on step */}
      {step === 1 && (
        <div className="w-full mb-6">
          <h2 className="text-[3vh] font-bold text-[#202345] mb-4">
            What's your nickname?
          </h2>
          <div className="w-full flex items-center rounded-full border" style={{ borderColor: "#351D6B", borderWidth: 3 ,width: "100%"}}>
            <input
              type="text"
              maxLength={10}
              value={nickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              placeholder={`Enter Player ${playerNumber} nickname`}
             className="flex-grow py-[2vh] px-[2vw] rounded-l-full border-none text-[#351D6B] text-[2.2vh] outline-none" // 👈 increased padding & font size
              style={{ height: "7vh", border: "none" }}
            />
            <button
              onClick={handleNextStep}
              disabled={!nickname}
              className="rounded-r-full px-[2vw] py-[2vh] font-semibold text-lg transition disabled:opacity-50"
              style={{
                height: "7vh", 
                color: "#351D6B",
                background: "linear-gradient(90deg, #A18CD1 0%, #FBC2EB 100%)",
                border: "none"
              }}
            >
              Next
            </button>
          </div>
          {displayName && (
            <div className="text-sm text-[#351D6B] mt-3 font-medium">
              Suggested: {displayName}
            </div>
          )}
          <div className="text-[2vh] text-[#878B9A] mt-2 text-center">
            Maximum of 10 characters. Space not allowed.
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full mb-6">
          <h2 className="text-xl font-bold text-[#202345] mb-4">
            Choose your Avatar
          </h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setAvatarIndex(i => (i === 0 ? avatarImages.length - 1 : i - 1))}
              className="p-2 text-2xl focus:outline-none"
              aria-label="Previous Avatar"
            >
              &#8592;
            </button>
            <img
              src={avatarImages[avatarIndex]}
              alt={`Avatar ${avatarIndex + 1}`}
              className={`w-24 h-24 rounded-full border-4 transition ${avatar !== avatarImages[avatarIndex] ? 'border-[#C6CBF2]' : 'border-[#A18CD1]'}`}
              onClick={() => handleAvatarChange(avatarImages[avatarIndex])}
              style={{ cursor: 'pointer' }}
            />
            <button
              onClick={() => setAvatarIndex(i => (i === avatarImages.length - 1 ? 0 : i + 1))}
              className="p-2 text-2xl focus:outline-none"
              aria-label="Next Avatar"
            >
              &#8594;
            </button>
          </div>
          <button
            onClick={handleNextStep}
            disabled={!avatar}
          className="w-[60%] mx-auto mt-8 py-5 rounded-full bg-gradient-to-r from-[#A18CD1] to-[#FBC2EB] text-white font-semibold text-lg transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="w-full mb-6">
          <h2 className="text-[2vh] font-bold text-[#202345] mb-4">
            Select your Class
          </h2>
          <CustomClassDropdown value={className} onChange={handleClassChange} className="w-full h-[7vh] text-lg" />
          <button
  onClick={handleNextStep}
  disabled={!className}
  className="w-full mt-8 py-[1.5vh] rounded-full bg-gradient-to-r from-[#A18CD1] to-[#FBC2EB] text-white font-semibold text-lg transition disabled:opacity-50"
>
  {isLastPlayer ? "Start Game" : "Next Player"}
</button>

        </div>
      )}

      {/* Navigation Buttons */}
      <div className="w-full flex justify-start mt-4">
        {step > 1 && (
          <button
            onClick={handleBackStep}
            className="text-[#878B9A] text-base underline hover:text-[#7C58E5] transition"
            style={{ background: "none", border: "none" }}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

export default function MultiplayerInput() {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [players, setPlayers] = useState({
    1: { nickname: "", displayName: "", avatar: "", className: "" },
    2: { nickname: "", displayName: "", avatar: "", className: "" }
  });
  const navigate = useNavigate();

  const updatePlayerData = (playerNumber, data) => {
    setPlayers(prev => ({
      ...prev,
      [playerNumber]: data
    }));
  };

  const handleNext = () => {
    if (currentPlayer === 1) {
      setCurrentPlayer(2);
    } else {
      // Both players completed, navigate to XO game
      navigate("/xo", {
        state: {
          player1: {
            name: players[1].displayName || players[1].nickname,
            avatar: players[1].avatar
          },
          player2: {
            name: players[2].displayName || players[2].nickname,
            avatar: players[2].avatar
          }
        }
      });
    }
  };

  return (
    <Background>
      <Logo />
    <div className="relative w-screen h-screen">
      {/* Card container */}
      <div
        className="absolute backdrop-blur-lg bg-gradient-to-br from-[#e3e2f7]/80 to-[#cbcdda]/80 p-8 rounded-3xl shadow-2xl flex flex-col justify-between"
        style={{
         width: "44%",
         minHeight: "40%", 
        top: "20%",
        left: "28%"
        }}
      >
        {/* Step indicators */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-[2vh] w-[12vw] rounded-full ${
                currentPlayer === s ? "bg-[#9083D2]" : "bg-[#d1c9fa]"
              }`}
            />
          ))}
        </div>

        {/* Player form */}
        <div className="flex-grow flex flex-col justify-center">
          <PlayerForm
            playerNumber={currentPlayer}
            playerData={players[currentPlayer]}
            onUpdate={updatePlayerData}
            onNext={handleNext}
            isLastPlayer={currentPlayer === 2}
          />
        </div>
      </div>
    </div>
    <BackButton />
    </Background>
  );
}