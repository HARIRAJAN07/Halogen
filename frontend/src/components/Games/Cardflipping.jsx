import React, { useState, useEffect, useCallback } from 'react';
import cardsJSON from "../../data/cardsData.json";
import BgImage from "../../assets/BgImage.png";
import TablaCelebration from '../utils/Celeb'; // Import your celebration component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Cardflipping = () => {
  const navigate = useNavigate(); // Hook for navigation

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameMode, setGameMode] = useState('antonym');
  const [showAllCardsTemporarily, setShowAllCardsTemporarily] = useState(false);
  const [timer, setTimer] = useState(90); 
  const [showCelebration, setShowCelebration] = useState(false); // Celebration state
  const [stopCelebration, setStopCelebration] = useState(false); // Stop celeb on restart

  const initializeGame = useCallback(() => {
    setStopCelebration(true); // stop previous celebration
    setTimeout(() => setStopCelebration(false), 50); // reset stop

    if (!cardsJSON || !cardsJSON.length) return;

    const gamePairs = cardsJSON.find(data => data.type === gameMode).pairs;

    const deck = gamePairs.flatMap(pair => [
      { id: Math.random(), word: pair[0], match: pair[1] },
      { id: Math.random(), word: pair[1], match: pair[0] }
    ]);

    // Shuffle
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
    setShowCelebration(false);

    setShowAllCardsTemporarily(true);
    setTimeout(() => {
      setShowAllCardsTemporarily(false);
    }, 4000);
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
            setMessage("Time's up! Game over.");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [showAllCardsTemporarily, isGameActive]);

  // Handle card flipping and matching
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      const firstCardData = cards.find(card => card.id === firstCard);
      const secondCardData = cards.find(card => card.id === secondCard);

      if (firstCardData.match === secondCardData.word) {
        setMatchedCards(prev => [...prev, firstCard, secondCard]);
        setFlippedCards([]);
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
      setMessage('You have won the game!');
      setIsGameActive(false);
      setShowCelebration(true); // Trigger celebration
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

  const gameInstructions = gameMode === 'antonym'
    ? 'Flip the perfect antonyms together!'
    : 'Flip the perfect synonyms together!';

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // New functions for the buttons
  const restartGame = () => {
    initializeGame();
  };

  const goToDashboard = () => {
    navigate('/'); // Navigates to the dashboard route
  };


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-4 font-sans text-gray-800 bg-cover bg-center"
      style={{
        backgroundImage: `url(${BgImage})`,
      }}
    >
      {/* Mode Buttons */}
      <div className="flex justify-center mb-6 mt-4">
        <button
          onClick={() => setGameMode('antonym')}
          className={`px-4 py-2 mx-2 rounded-full font-bold transition-colors
            ${gameMode === 'antonym' ? 'bg-[#bca5d4] text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
        >
          Antonyms
        </button>
        <button
          onClick={() => setGameMode('synonym')}
          className={`px-4 py-2 mx-2 rounded-full font-bold transition-colors
            ${gameMode === 'synonym' ? 'bg-[#bca5d4] text-white shadow-lg' : 'bg-gray-200 text-gray-700'}`}
        >
          Synonyms
        </button>
      </div>
      
      {/* Timer */}
      <h2 className="text-xl font-bold mb-4">
        Time Remaining: <span className="text-red-600">{formatTime(timer)}</span>
      </h2>

      <p className="text-lg text-center mb-8">{gameInstructions}</p>

      {/* Message Overlay */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white p-12 rounded-xl shadow-lg border-4 text-center text-2xl font-bold transition-all duration-300 transform scale-105 relative" style={{ borderColor: '#bca5d4' }}>
            {message}
            {/* Added buttons for navigation */}
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={goToDashboard}
                className="px-6 py-3 text-white font-bold rounded-full shadow-lg transition-colors"
                style={{ backgroundColor: '#7164b4' }}
              >
                Go to Dashboard
              </button>
              <button
                onClick={restartGame}
                autoFocus
                className="px-6 py-3 text-white font-bold rounded-full shadow-lg transition-colors"
                style={{ backgroundColor: '#bca5d4' }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Grid */}
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
              <i className="fas fa-question"></i>
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

      {/* The original Restart button is redundant now, but you can keep it if you want */}
      <button
        onClick={initializeGame}
        className="px-6 py-3 text-white font-bold rounded-full shadow-lg transition-colors mb-4"
        style={{ backgroundColor: '#7164b4' }}
      >
        Restart Game
      </button>

      {/* Celebration Component */}
      <TablaCelebration show={showCelebration} stop={stopCelebration} />
    </div>
  );
};

export default Cardflipping;