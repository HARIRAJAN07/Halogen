import React, { useState, useRef, useEffect } from "react";
import bgImage from "../../assets/bg.jpg"; // your background image
import adjectives from "../../data/alliterations.json"; // ✅ import alliterations
import { useNavigate } from "react-router-dom";

const classOptions = [
  { value: "", label: "Choose class" },
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

  // Close dropdown when clicking outside
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

export default function Input() {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [displayName, setDisplayName] = useState(""); // ✅ actual display name with alliteration
  const [avatar, setAvatar] = useState("");
  const [className, setClassName] = useState("");
const navigate = useNavigate(); 

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // ✅ Generate nickname with alliteration
  const generateAlliteration = (name) => {
    if (!name) return "";
    const firstLetter = name.charAt(0).toUpperCase();
    const wordList = adjectives[firstLetter] || [];
    if (wordList.length === 0) return name;

    const adjective = wordList[Math.floor(Math.random() * wordList.length)];
    return `${adjective} ${name}`;
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Background image */}
      <img
        src={bgImage}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Card container */}
      <div
        className="absolute backdrop-blur-lg bg-gradient-to-br from-[#e3e2f7]/80 to-[#cbcdda]/80 p-8 rounded-3xl shadow-2xl flex flex-col justify-between"
        style={{
          width: "44%",
          height: "50%",
          top: "20%",
          left: "28%"
        }}
      >
        {/* Step indicators */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full ${
                step === s ? "bg-[#9083D2]" : "bg-[#d1c9fa]"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="flex-grow flex flex-col justify-center">
          {step === 1 && (
            <div className="text-center flex flex-col items-center">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#351D6B" }}
              >
                What's your nickname?
              </h2>
              <div
                className="w-full flex items-center rounded-full border"
                style={{ borderColor: "#351D6B", borderWidth: 1 }}
              >
                <input
                  type="text"
                  maxLength={10}
                  pattern="^\\S{1,10}$"
                  value={nickname}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\s/g, "");
                    if (raw.length > 0) {
                      const cleanName =
                        raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
                      setNickname(cleanName);
                      setDisplayName(generateAlliteration(cleanName)); // ✅ update alliteration
                    } else {
                      setNickname("");
                      setDisplayName("");
                    }
                  }}
                  placeholder="Enter your nick name"
                  className="flex-grow py-3 px-5 rounded-l-full border-none text-[#351D6B] text-base outline-none"
                />

                <button
                  onClick={nextStep}
                  disabled={!nickname}
                  className="rounded-r-full px-6 py-3 font-semibold text-lg transition disabled:opacity-50"
                  style={{
                    color: "#351D6B",
                    background:
                      "linear-gradient(90deg, #A18CD1 0%, #FBC2EB 100%)",
                    border: "none"
                  }}
                >
                  Next
                </button>
              </div>
              {/* ✅ Show generated alliteration */}
              {displayName && (
                <div className="text-sm text-[#351D6B] mt-3 font-medium">
                  Suggested: {displayName}
                </div>
              )}
              <div className="text-xs text-[#878B9A] mt-2 text-center">
                Maximum of 10 characters. Space not allowed.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#202345] mb-4">
                Choose your Avatar
              </h2>
              <div className="flex justify-center gap-4">
                {["👨‍🔬", "👩‍🔬", "🧑‍🚀"].map((av) => (
                  <button
                    key={av}
                    onClick={() => setAvatar(av)}
                    className={`text-4xl p-2 rounded-full ${
                      avatar === av ? "bg-[#eceaff]" : "bg-[#f2f1f7]"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
              <button
                onClick={nextStep}
                disabled={!avatar}
                className="w-full mt-8 py-3 rounded-full bg-gradient-to-r from-[#A18CD1] to-[#FBC2EB] text-white font-semibold text-lg transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center flex flex-col items-center">
              <h2 className="text-xl font-bold text-[#202345] mb-4">
                Select your Class
              </h2>
              <CustomClassDropdown value={className} onChange={setClassName} />
             <button
  onClick={() =>
    navigate(`/single/${className}/${displayName}`, {
      state: { nickname: displayName, avatar },
    })
  }
  disabled={!className}
  className="w-full mt-8 py-3 rounded-full bg-gradient-to-r from-[#A18CD1] to-[#FBC2EB] text-white font-semibold text-lg transition disabled:opacity-50"
>
  Finish
</button>

            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-start h-8">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="text-[#878B9A] text-base underline hover:text-[#7C58E5] transition"
              style={{ background: "none", border: "none" }}
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
