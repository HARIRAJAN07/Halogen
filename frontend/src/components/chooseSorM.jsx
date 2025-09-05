import React, { useState } from "react";
import bg from "../assets/bg.jpg";
import single from "../assets/single.png";
import multi from "../assets/multi.png";

const FlipCard = ({ frontText, backText ,image}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative"
      style={{
        width: "25%",
        height: "55%",
        margin: "2%",
      }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700`}
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-lg text-white cursor-pointer"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #8F9FE4, #BACBFE)",
            fontSize: "4vh",
            fontWeight:"700",
            height:"40vh"
          }}
        >
          {frontText}
          <img src={image} alt="" style={{width:"30%",height:"30%",margin:"6% 0% 0% 0%"}}/>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-lg text-white p-4"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #BCA5D4, #EFE2FA)",
            transform: "rotateY(180deg)",
            fontSize: "2vh",
          }}
        >
          <p className="mb-[10%] text-center font-bold text-[2.5vh]">{backText}</p>
          <button
            className="px-[10%] py-[5%] rounded-xl shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7164B4, #8F9FE4)",
              fontSize: "2.2vh",
              fontWeight:"700"
            }}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

const ChooseSorM = () => {
  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div
        className="flex justify-center items-center"
        style={{ width: "80%", height: "70%",gap:"10%" }}
      >
        <FlipCard
          frontText="Single Player"
          backText="Challenge yourself, beat the clock, and celebrate victory with fun confetti"
          image={single}
        />
        <FlipCard
          frontText="Multi Player"
          backText="Compete with friends, race through questions, and enjoy exciting celebrations together."
          image={multi}  
        />
      </div>
    </div>
  );
};

export default ChooseSorM;
