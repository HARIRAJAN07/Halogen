import React, { useState, useEffect, useCallback } from 'react';
import cardsJSON from "../../data/cardsDataT.json"; // Tamil data
import BgImage from "../../assets/BgImage.png";

const CardflippingT= () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameMode, setGameMode] = useState('மொழியியல்');
  const [showAllCardsTemporarily, setShowAllCardsTemporarily] = useState(false);
  const [timer, setTimer] = useState(90);

  const initializeGame = useCallback(() => {
    if (!cardsJSON || !cardsJSON.length) return;

    const gamePairs = cardsJSON.find(data => data.type === gameMode)?.pairs || [];

    const deck = gamePairs.flatMap(pair => [
      { id: Math.random(), word: pair[0], match: pair[1] },
      { id: Math.random(), word: pair[1], match: pair[0] }
    ]);

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck.map(card => ({ ...card, isFlipped: false, isMatched: false })));
    setFlippedCards([]);
    setMatchedCards([]);
    setMessage('');
    setIsGameActive(true);
    setTimer(90);

    setShowAllCardsTemporarily(true);
    setTimeout(() => setShowAllCardsTemporarily(false), 4000);
  }, [gameMode]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer
  useEffect(() => {
    let countdown;
    if (!showAllCardsTemporarily && isGameActive) {
      countdown = setInterval(() => {
        setTimer(prevTime => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            setIsGameActive(false);
            setMessage("நேரம் முடிந்துவிட்டது! விளையாட்டு முடிந்தது.");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [showAllCardsTemporarily, isGameActive]);

  // Handle card flips and matching
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      const firstCardData = cards.find(card => card.id === firstCard);
      const secondCardData = cards.find(card => card.id === secondCard);

      if (firstCardData.match === secondCardData.word) {
        setMatchedCards(prev => [...prev, firstCard, secondCard]);
        setFlippedCards([]);
        setTimeout(() => {
          setMessage('சரி!');
          setTimeout(() => setMessage(''), 2000);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard || card.id === secondCard
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Check for win
  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setMessage('விளையாட்டு வெற்றி!');
      setIsGameActive(false);
    }
  }, [matchedCards, cards]);

  const handleCardClick = (id) => {
    const card = cards.find(c => c.id === id);
    if (!isGameActive || card.isFlipped || flippedCards.length === 2 || showAllCardsTemporarily) return;

    setCards(prevCards =>
      prevCards.map(c => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    setFlippedCards(prev => [...prev, id]);
  };

  const gameInstructions = gameMode === 'மொழியியல்'
    ? 'சரியான பொருத்தங்களை இணைக்கவும்!'
    : 'சரியான கவிதை-கவிஞர் இணைப்புகளை கண்டுபிடிக்கவும்!';

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-4 font-sans text-gray-800 bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      {/* Mode Buttons */}
      <div className="flex justify-center mb-6 mt-4">
        <button
          onClick={() => setGameMode('மொழியியல்')}
          className={`px-4 py-2 mx-2 rounded-full font-bold transition-colors
            ${gameMode === 'மொழியியல்' ? 'bg-[#bca5d4] text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
        >
          மொழியியல்
        </button>
        <button
          onClick={() => setGameMode('கவிதை_கவிஞர்')}
          className={`px-4 py-2 mx-2 rounded-full font-bold transition-colors
            ${gameMode === 'கவிதை_கவிஞர்' ? 'bg-[#bca5d4] text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
        >
          கவிதை_கவிஞர்
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">
        காலம் மீதமுள்ளது: <span className="text-red-600">{formatTime(timer)}</span>
      </h2>

      <p className="text-lg text-center mb-8">{gameInstructions}</p>

      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-12 rounded-xl shadow-lg border-4 text-center text-2xl font-bold transition-all duration-300 transform scale-105 relative" style={{ borderColor: '#bca5d4' }}>
            {message}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6 w-full max-w-4xl p-4 mb-8" style={{ perspective: '1000px' }}>
        {cards.map(card => (
          <div
            key={card.id}
            className={`relative bg-transparent rounded-xl shadow-lg aspect-[3/2] cursor-pointer transform transition-transform duration-700
              ${card.isFlipped || card.isMatched || showAllCardsTemporarily ? 'rotate-y-180' : ''}`}
            style={{ transformStyle: 'preserve-3d', minHeight: '120px' }}
            onClick={() => handleCardClick(card.id)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden rounded-xl flex items-center justify-center border-4 text-white text-3xl font-bold" style={{ backgroundColor: '#7164b4', borderColor: '#7164b4' }}>
              <span className="text-4xl">🃏</span>
            </div>
            {/* Back */}
            <div
              className="absolute inset-0 rounded-xl flex items-center justify-center text-center font-semibold text-xl p-2 backface-hidden rotate-y-180"
              style={{ backgroundColor: '#ffffff', color: '#7164b4' }}
            >
              {card.word}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={initializeGame}
        className="px-6 py-3 text-white font-bold rounded-full shadow-lg transition-colors mb-4"
        style={{ backgroundColor: '#7164b4' }}
      >
        விளையாட்டை மீண்டும் தொடங்கவும்
      </button>
    </div>
  );
};

export default CardflippingT;
