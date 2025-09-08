import React, { useState, useEffect, useRef } from "react";
import { Paper, Typography, Button } from "@mui/material";

// helper
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

// questions dataset (already in your code)
const questionDataX = [
  { id: 1, en: { q: "What is 2 + 2?", options: ["3", "4", "5"], a: "4" }, ta: { q: "2 + 2 = ?", options: ["3", "4", "5"], a: "4" } },
  { id: 2, en: { q: "Capital of India?", options: ["Delhi", "Mumbai", "Kolkata"], a: "Delhi" }, ta: { q: "இந்தியாவின் தலைநகர்?", options: ["டெல்லி", "மும்பை", "கொல்கத்தா"], a: "டெல்லி" } },
  { id: 3, en: { q: "5 * 2 = ?", options: ["10", "12", "8"], a: "10" }, ta: { q: "5 * 2 = ?", options: ["10", "12", "8"], a: "10" } },
  { id: 4, en: { q: "Color of sky?", options: ["Blue", "Green", "Red"], a: "Blue" }, ta: { q: "வானின் நிறம்?", options: ["நீலம்", "பச்சை", "சிகப்பு"], a: "நீலம்" } },
  { id: 5, en: { q: "Square root of 16?", options: ["2", "4", "8"], a: "4" }, ta: { q: "16ன் வேர்க்கிளை?", options: ["2", "4", "8"], a: "4" } },
  { id: 6, en: { q: "Who wrote Ramayana?", options: ["Valmiki", "Tulsidas", "Kalidasa"], a: "Valmiki" }, ta: { q: "இராமாயணத்தை எழுதியவர்?", options: ["வால்மீகி", "துலசிதாஸ்", "காலிதாசர்"], a: "வால்மீகி" } },
  { id: 7, en: { q: "Largest planet?", options: ["Earth", "Jupiter", "Mars"], a: "Jupiter" }, ta: { q: "அதிகப் பெரிய கோள்?", options: ["பூமி", "வியாழன்", "செவ்வாய்"], a: "வியாழன்" } },
  { id: 8, en: { q: "Which gas we breathe in?", options: ["Oxygen", "Carbon", "Nitrogen"], a: "Oxygen" }, ta: { q: "நாம் சுவாசிப்பது எந்த வாயு?", options: ["ஆக்சிஜன்", "கார்பன்", "நைட்ரஜன்"], a: "ஆக்சிஜன்" } },
  { id: 9, en: { q: "National bird of India?", options: ["Peacock", "Sparrow", "Crow"], a: "Peacock" }, ta: { q: "இந்தியாவின் தேசியப் பறவை?", options: ["மயில்", "சிட்டுக்குருவி", "காகம்"], a: "மயில்" } },
  { id: 10, en: { q: "Opposite of Hot?", options: ["Warm", "Cold", "Cool"], a: "Cold" }, ta: { q: "Hot என்பதற்கு எதிர்சொல்?", options: ["சூடு", "குளிர்", "சூடான"], a: "குளிர்" } },
  { id: 11, en: { q: "What is 12 / 4?", options: ["2", "3", "4"], a: "3" }, ta: { q: "12 / 4 = ?", options: ["2", "3", "4"], a: "3" } },
  { id: 12, en: { q: "First month of the year?", options: ["January", "March", "December"], a: "January" }, ta: { q: "வருடத்தின் முதல் மாதம்?", options: ["ஜனவரி", "மார்ச்", "டிசம்பர்"], a: "ஜனவரி" } },
  { id: 13, en: { q: "Which organ pumps blood?", options: ["Heart", "Lungs", "Brain"], a: "Heart" }, ta: { q: "இரத்தத்தை பாய்ச்சும் உறுப்பு?", options: ["இதயம்", "நுரையீரல்", "மூளை"], a: "இதயம்" } },
  { id: 14, en: { q: "Who invented the light bulb?", options: ["Edison", "Newton", "Tesla"], a: "Edison" }, ta: { q: "மின்விளக்கை கண்டுபிடித்தவர்?", options: ["எடிசன்", "நியூட்டன்", "டெஸ்லா"], a: "எடிசன்" } },
  { id: 15, en: { q: "Smallest unit of life?", options: ["Atom", "Cell", "Molecule"], a: "Cell" }, ta: { q: "வாழ்வின் சிறிய அலகு?", options: ["அணு", "செள்", "அணுக்கூறு"], a: "செல்" } },
  { id: 16, en: { q: "National sport of India?", options: ["Cricket", "Hockey", "Football"], a: "Hockey" }, ta: { q: "இந்தியாவின் தேசிய விளையாட்டு?", options: ["கிரிக்கெட்", "ஹாக்கி", "கால்பந்து"], a: "ஹாக்கி" } },
  { id: 17, en: { q: "Which continent is India in?", options: ["Asia", "Europe", "Africa"], a: "Asia" }, ta: { q: "இந்தியா எந்த கண்டத்தில் உள்ளது?", options: ["ஆசியா", "ஐரோப்பா", "ஆப்ரிக்கா"], a: "ஆசியா" } },
  { id: 18, en: { q: "Fastest land animal?", options: ["Cheetah", "Tiger", "Horse"], a: "Cheetah" }, ta: { q: "வேகமான நில விலங்கு?", options: ["சீட்டா", "புலி", "குதிரை"], a: "சீட்டா" } },
  { id: 19, en: { q: "Color of blood?", options: ["Red", "Blue", "Black"], a: "Red" }, ta: { q: "இரத்தத்தின் நிறம்?", options: ["சிகப்பு", "நீலம்", "கருப்பு"], a: "சிகப்பு" } },
  { id: 20, en: { q: "What is 15 - 6?", options: ["7", "8", "9"], a: "9" }, ta: { q: "15 - 6 = ?", options: ["7", "8", "9"], a: "9" } },
  { id: 21, en: { q: "Largest ocean?", options: ["Atlantic", "Pacific", "Indian"], a: "Pacific" }, ta: { q: "பெரிய பெருங்கடல்?", options: ["அட்லாண்டிக்", "பசிபிக்", "இந்திய"], a: "பசிபிக்" } },
  { id: 22, en: { q: "Which gas is in soda?", options: ["Oxygen", "Carbon dioxide", "Nitrogen"], a: "Carbon dioxide" }, ta: { q: "சோடாவில் இருக்கும் வாயு?", options: ["ஆக்சிஜன்", "கார்பன் டைஆக்சைடு", "நைட்ரஜன்"], a: "கார்பன் டைஆக்சைடு" } },
  { id: 23, en: { q: "Taj Mahal is in?", options: ["Agra", "Delhi", "Jaipur"], a: "Agra" }, ta: { q: "தாஜ்மஹால் எங்கு உள்ளது?", options: ["ஆக்ரா", "டெல்லி", "ஜெய்ப்பூர்"], a: "ஆக்ரா" } },
  { id: 24, en: { q: "Brain of computer?", options: ["CPU", "RAM", "Monitor"], a: "CPU" }, ta: { q: "கணினியின் மூளை?", options: ["CPU", "RAM", "மானிட்டர்"], a: "CPU" } },
  { id: 25, en: { q: "Who discovered gravity?", options: ["Newton", "Einstein", "Edison"], a: "Newton" }, ta: { q: "இருப்பு விசையை கண்டுபிடித்தவர்?", options: ["நியூட்டன்", "ஐன்ஸ்டீன்", "எடிசன்"], a: "நியூட்டன்" } },
  { id: 26, en: { q: "Which festival is of lights?", options: ["Holi", "Diwali", "Pongal"], a: "Diwali" }, ta: { q: "ஒளியின் திருநாள்?", options: ["ஹோலி", "தீபாவளி", "பொங்கல்"], a: "தீபாவளி" } },
  { id: 27, en: { q: "What is 9 * 9?", options: ["81", "72", "99"], a: "81" }, ta: { q: "9 * 9 = ?", options: ["81", "72", "99"], a: "81" } },
  { id: 28, en: { q: "Largest mammal?", options: ["Elephant", "Blue Whale", "Shark"], a: "Blue Whale" }, ta: { q: "அதிகப் பெரிய விலங்கு?", options: ["யானை", "நீலத் திமிங்கலம்", "சுறா"], a: "நீலத் திமிங்கலம்" } },
  { id: 29, en: { q: "Planet known as Red Planet?", options: ["Venus", "Mars", "Mercury"], a: "Mars" }, ta: { q: "சிவப்புக் கோள் என்று அழைக்கப்படுவது?", options: ["சுக்கிரன்", "செவ்வாய்", "புதன்"], a: "செவ்வாய்" } },
  { id: 30, en: { q: "Sun rises in the?", options: ["East", "West", "North"], a: "East" }, ta: { q: "சூரியன் எதில் உதயமாகிறது?", options: ["கிழக்கு", "மேற்கு", "வடக்கு"], a: "கிழக்கு" } }
];

// Player O
const questionDataO = [
  { id: 1, en: { q: "What is 3 + 5?", options: ["8", "9", "7"], a: "8" }, ta: { q: "3 + 5 = ?", options: ["8", "9", "7"], a: "8" } },
  { id: 2, en: { q: "Capital of France?", options: ["Paris", "Berlin", "Rome"], a: "Paris" }, ta: { q: "பிரான்ஸ் தலைநகர்?", options: ["பாரிஸ்", "பெர்லின்", "ரோம்"], a: "பாரிஸ்" } },
  { id: 3, en: { q: "10 / 2 = ?", options: ["2", "5", "10"], a: "5" }, ta: { q: "10 / 2 = ?", options: ["2", "5", "10"], a: "5" } },
  { id: 4, en: { q: "Primary color?", options: ["Yellow", "Purple", "Pink"], a: "Yellow" }, ta: { q: "முதன்மை நிறம்?", options: ["மஞ்சள்", "ஊதா", "இளஞ்சிவப்பு"], a: "மஞ்சள்" } },
  { id: 5, en: { q: "Square root of 9?", options: ["1", "3", "9"], a: "3" }, ta: { q: "9ன் வேர்க்கிளை?", options: ["1", "3", "9"], a: "3" } },
  { id: 6, en: { q: "Largest desert?", options: ["Sahara", "Thar", "Gobi"], a: "Sahara" }, ta: { q: "பெரிய பாலைவனம்?", options: ["சஹாரா", "தார்", "கோபி"], a: "சஹாரா" } },
  { id: 7, en: { q: "National animal of India?", options: ["Tiger", "Lion", "Elephant"], a: "Tiger" }, ta: { q: "இந்தியாவின் தேசிய விலங்கு?", options: ["புலி", "சிங்கம்", "யானை"], a: "புலி" } },
  { id: 8, en: { q: "Who wrote Mahabharata?", options: ["Vyasa", "Valmiki", "Kalidasa"], a: "Vyasa" }, ta: { q: "மகாபாரதத்தை எழுதியவர்?", options: ["வியாசர்", "வால்மீகி", "காலிதாசர்"], a: "வியாசர்" } },
  { id: 9, en: { q: "What is H2O?", options: ["Water", "Oxygen", "Hydrogen"], a: "Water" }, ta: { q: "H2O என்ன?", options: ["தண்ணீர்", "ஆக்சிஜன்", "ஹைட்ரஜன்"], a: "தண்ணீர்" } },
  { id: 10, en: { q: "Currency of Japan?", options: ["Yuan", "Yen", "Won"], a: "Yen" }, ta: { q: "ஜப்பான் நாணயம்?", options: ["யுவான்", "யென்", "வோன்"], a: "யென்" } },
  { id: 11, en: { q: "2 * 12 = ?", options: ["22", "24", "26"], a: "24" }, ta: { q: "2 * 12 = ?", options: ["22", "24", "26"], a: "24" } },
  { id: 12, en: { q: "Who discovered America?", options: ["Columbus", "Newton", "Magellan"], a: "Columbus" }, ta: { q: "அமெரிக்காவை கண்டுபிடித்தவர்?", options: ["கொலம்பஸ்", "நியூட்டன்", "மேகலன்"], a: "கொலம்பஸ்" } },
  { id: 13, en: { q: "Fastest bird?", options: ["Eagle", "Falcon", "Owl"], a: "Falcon" }, ta: { q: "வேகமான பறவை?", options: ["கருடன்", "பால்கன்", "ஆந்தை"], a: "பால்கன்" } },
  { id: 14, en: { q: "Which organ helps us breathe?", options: ["Heart", "Lungs", "Kidney"], a: "Lungs" }, ta: { q: "சுவாசத்திற்கு உதவும் உறுப்பு?", options: ["இதயம்", "நுரையீரல்", "சிறுநீரகம்"], a: "நுரையீரல்" } },
  { id: 15, en: { q: "Smallest planet?", options: ["Mercury", "Mars", "Venus"], a: "Mercury" }, ta: { q: "சிறிய கோள்?", options: ["புதன்", "செவ்வாய்", "சுக்கிரன்"], a: "புதன்" } },
  { id: 16, en: { q: "What is 20 - 7?", options: ["11", "12", "13"], a: "13" }, ta: { q: "20 - 7 = ?", options: ["11", "12", "13"], a: "13" } },
  { id: 17, en: { q: "Largest country?", options: ["Russia", "China", "USA"], a: "Russia" }, ta: { q: "அதிகப் பெரிய நாடு?", options: ["ரஷ்யா", "சீனா", "அமெரிக்கா"], a: "ரஷ்யா" } },
  { id: 18, en: { q: "Which gas is needed for fire?", options: ["Oxygen", "Carbon", "Nitrogen"], a: "Oxygen" }, ta: { q: "தீக்குத் தேவையான வாயு?", options: ["ஆக்சிஜன்", "கார்பன்", "நைட்ரஜன்"], a: "ஆக்சிஜன்" } },
  { id: 19, en: { q: "Father of Nation (India)?", options: ["Gandhi", "Nehru", "Bose"], a: "Gandhi" }, ta: { q: "இந்தியத் தந்தை?", options: ["காந்தி", "நேரு", "போஸ்"], a: "காந்தி" } },
  { id: 20, en: { q: "Planet with rings?", options: ["Saturn", "Venus", "Neptune"], a: "Saturn" }, ta: { q: "வளையங்களுடன் உள்ள கோள்?", options: ["சனி", "சுக்கிரன்", "நெப்ட்யூன்"], a: "சனி" } },
  { id: 21, en: { q: "What is 25 / 5?", options: ["4", "5", "6"], a: "5" }, ta: { q: "25 / 5 = ?", options: ["4", "5", "6"], a: "5" } },
  { id: 22, en: { q: "Where is Eiffel Tower?", options: ["Paris", "London", "Rome"], a: "Paris" }, ta: { q: "ஐஃபல் கோபுரம் எங்கு?", options: ["பாரிஸ்", "லண்டன்", "ரோம்"], a: "பாரிஸ்" } },
  { id: 23, en: { q: "National fruit of India?", options: ["Banana", "Mango", "Apple"], a: "Mango" }, ta: { q: "இந்தியாவின் தேசிய பழம்?", options: ["வாழை", "மாம்பழம்", "ஆப்பிள்"], a: "மாம்பழம்" } },
  { id: 24, en: { q: "What is boiling point of water?", options: ["90°C", "100°C", "110°C"], a: "100°C" }, ta: { q: "தண்ணீரின் கொதிநிலை?", options: ["90°C", "100°C", "110°C"], a: "100°C" } },
  { id: 25, en: { q: "Who invented telephone?", options: ["Bell", "Tesla", "Newton"], a: "Bell" }, ta: { q: "தொலைபேசியை கண்டுபிடித்தவர்?", options: ["பெல்", "டெஸ்லா", "நியூட்டன்"], a: "பெல்" } },
  { id: 26, en: { q: "Planet closest to Sun?", options: ["Mercury", "Venus", "Earth"], a: "Mercury" }, ta: { q: "சூரியனுக்கு அருகிலுள்ள கோள்?", options: ["புதன்", "சுக்கிரன்", "பூமி"], a: "புதன்" } },
  { id: 27, en: { q: "How many continents?", options: ["5", "6", "7"], a: "7" }, ta: { q: "கண்டங்களின் எண்ணிக்கை?", options: ["5", "6", "7"], a: "7" } },
  { id: 28, en: { q: "What is 11 * 11?", options: ["111", "121", "101"], a: "121" }, ta: { q: "11 * 11 = ?", options: ["111", "121", "101"], a: "121" } },
  { id: 29, en: { q: "First man on Moon?", options: ["Armstrong", "Yuri", "Aldrin"], a: "Armstrong" }, ta: { q: "முதலாவது சந்திரனில் நடந்தவர்?", options: ["ஆம்ஸ்ட்ராங்", "யூரி", "ஆல்ட்ரின்"], a: "ஆம்ஸ்ட்ராங்" } },
  { id: 30, en: { q: "Which gas do plants release?", options: ["Carbon", "Oxygen", "Nitrogen"], a: "Oxygen" }, ta: { q: "தாவரங்கள் வெளியிடும் வாயு?", options: ["கார்பன்", "ஆக்சிஜன்", "நைட்ரஜன்"], a: "ஆக்சிஜன்" } }
];


const Questions = ({ player = "X", playerName = "", onCorrectAnswer = () => {}, activeTurn = null }) => {
  const [language, setLanguage] = useState("en");

  // pick correct dataset for X or O
  const dataRef = useRef(player === "X" ? questionDataX : questionDataO);
  useEffect(() => {
    dataRef.current = player === "X" ? questionDataX : questionDataO;
  }, [player]);

  const ids = dataRef.current.map((q) => q.id);
  const [order, setOrder] = useState(() => shuffleArray(ids));
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [msg, setMsg] = useState("");

  const currentId = order[index];
  const currentQ = dataRef.current.find((q) => q.id === currentId);

  const next = () => {
    setAnswered(false);
    setIndex((prev) => {
      const n = prev + 1;
      if (n < order.length) return n;
      const newOrder = shuffleArray(ids);
      setOrder(newOrder);
      return 0;
    });
  };

  const handleAnswer = (choice) => {
    if (!currentQ || answered) return;
    setAnswered(true);

    const disp = currentQ[language];
    const correct = choice === disp.a;

    if (correct) {
      setMsg(language === "ta" ? "✅ சரியான பதில்!" : "✅ Correct!");
      onCorrectAnswer(player);
    } else {
      setMsg(language === "ta" ? "❌ தவறு!" : "❌ Wrong!");
    }
    setTimeout(next, 900);
  };

  if (!currentQ) return null;
  const disp = currentQ[language];
  const isTurn = activeTurn === player;



  return (
    <Paper
      style={{
        width: "95%",
        maxWidth: "80vw",
        padding: "3vh 3vw",
        marginTop: "22vh",
        borderRadius: "2vh",
        background: "linear-gradient(135deg, #BACBFE, #C1DDE8)",
        textAlign: "center",
        background: "linear-gradient(135deg, #BACBFE, #C1DDE8)",
        backdropFilter: "blur(2vh)", 
        borderRadius: "3vh",        
        boxShadow: "0 5vh 10vh -2vh rgba(0, 0, 0, 0.25)", 
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontSize: "2.2vh", marginBottom: "2vh", fontWeight: "bold" }}
      >
        {playerName || (language === "ta" ? `வீரர் ${player}` : `Player ${player}`)}
      </Typography>

      <Typography
        style={{ fontWeight: "bold", marginBottom: "3vh", fontSize: "2vh" }}
      >
        {disp.q}
      </Typography>

      {disp.options.map((opt, i) => (
        <Button
          key={i}
          variant="contained"
          fullWidth
          style={{
            background : "#2A60A0",
            marginBottom: "2vh",
            fontSize: "1.8vh",
            padding: "1.5vh 0",
          }}
          disabled={isTurn || answered}
          onClick={() => handleAnswer(opt)}
        >
          {opt}
        </Button>
      ))}

      {/* Language toggle */}
      <Button
        variant="outlined"
        onClick={() => setLanguage((prev) => (prev === "en" ? "ta" : "en"))}
        style={{
          marginTop: "2.5vh",
          fontSize: "1.8vh",
          padding: "1.5vh 3vw",
        }}
      >
        {language === "en" ? "தமிழ்" : "English"}
      </Button>

      <Typography
        style={{ marginTop: "2vh", fontWeight: "bold", fontSize: "2vh" }}
      >
        {msg}
      </Typography>
    </Paper>
  );
};

export default Questions;