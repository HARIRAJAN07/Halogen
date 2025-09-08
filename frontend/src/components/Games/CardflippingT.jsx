import React, { useState, useEffect, useCallback } from 'react';
import cardsJSON from "../../data/cardsDataT.json";
import TablaCelebration from '../utils/Celeb';
import { useNavigate } from 'react-router-dom';
import AppBackground from '../utils/AppBackground';
import logo from '../../assets/logo123.png';

const CardflippingT = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameMode, setGameMode] = useState('மொழியியல்');
  const [showAllCardsTemporarily, setShowAllCardsTemporarily] = useState(false);
  const [timer, setTimer] = useState(90);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stopCelebration, setStopCelebration] = useState(false);

  const initializeGame = useCallback(() => {
    setStopCelebration(true);
    setTimeout(() => setStopCelebration(false), 50);

    if (!cardsJSON || !cardsJSON.length) return;

    const gamePairs = cardsJSON.find(data => data.type === gameMode)?.pairs || [];

    const deck = gamePairs.flatMap(pair => [
      { id: Math.random(), word: pair[0], match: pair[1] },
      { id: Math.random(), word: pair[1], match: pair[0] }
    ]);

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

  useEffect(() => {
    // Corrected the condition from 5 to 2 for flippedCards length
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

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setMessage('விளையாட்டு வெற்றி!');
      setIsGameActive(false);
      setShowCelebration(true);
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

  const restartGame = () => {
    initializeGame();
  };

  const goToDashboard = () => {
    navigate('/');
  };

  return (
    <AppBackground>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2vw', fontFamily: 'sans-serif', color: '#4b5563' }}>
        <p style={{ fontSize: '1.5vw', textAlign: 'center', marginBottom: '3vh', marginTop: '3vh' }}>{gameInstructions}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5vh', gap: '2vw' }}>
          <button
            onClick={() => setGameMode('மொழியியல்')}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'மொழியியல்' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'மொழியியல்' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'மொழியியல்' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.2vw'
            }}
          >
            மொழியியல்
          </button>
          <button
            onClick={() => setGameMode('கவிதை_கவிஞர்')}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'கவிதை_கவிஞர்' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'கவிதை_கவிஞர்' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'கவிதை_கவிஞர்' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.2vw'
            }}
          >
            கவிதை_கவிஞர்
          </button>
          <h2 style={{ fontSize: '1.8vw', fontWeight: 'bold' }}>
            காலம் மீதமுள்ளது: <span style={{ color: '#dc2626' }}>{formatTime(timer)}</span>
          </h2>
        </div>

        {message && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)', zIndex: 50 }}>
            <div style={{ backgroundColor: '#ffffff', padding: '5vh 5vw', borderRadius: '1.5vw', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '4px solid #bca5d4', textAlign: 'center', fontSize: '2vw', fontWeight: 'bold', transitionProperty: 'all', transitionDuration: '300ms', transform: 'scale(1.05)', position: 'relative' }}>
              {message}
              <div style={{ marginTop: '3vh', display: 'flex', justifyContent: 'center', gap: '2vw' }}>
                <button
                  onClick={goToDashboard}
                  style={{
                    padding: '1.5vh 3vw',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transitionProperty: 'background-color',
                    transitionDuration: '150ms',
                    backgroundColor: '#7164b4',
                    fontSize: '1.5vw'
                  }}
                >
                  டாஷ்போர்டுக்கு செல்
                </button>
                <button
                  onClick={restartGame}
                  autoFocus
                  style={{
                    padding: '1.5vh 3vw',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transitionProperty: 'background-color',
                    transitionDuration: '150ms',
                    backgroundColor: '#bca5d4',
                    fontSize: '1.5vw'
                  }}
                >
                  மீண்டும் விளையாடு
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2vw', width: '100%', maxWidth: '90vw', padding: '2vw', marginBottom: '5vh', perspective: '1000px' }}>
          {cards.map(card => (
            <div
              key={card.id}
              style={{
                position: 'relative',
                backgroundColor: 'transparent',
                borderRadius: '1vw',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                aspectRatio: '3 / 2',
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                transform: (card.isFlipped || card.isMatched || showAllCardsTemporarily) ? 'rotateY(180deg)' : 'none',
                transition: 'transform 700ms',
                minHeight: '15vh'
              }}
              onClick={() => handleCardClick(card.id)}
            >
              {/* Card back with logo */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                borderRadius: '1vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1vh solid #7164b4',
                color: '#ffffff',
                fontSize: '4vw',
                fontWeight: 'bold',
                backgroundColor: '#7164b4'
              }}>
                <img src={logo} alt="Application Logo" style={{ width: '60%', height: 'auto', opacity: 0.8 }} />
              </div>
              {/* Card front with word */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '1vw',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontWeight: '600',
                  // Reduced font size for the text inside the card
                  fontSize: '1.2vw', 
                  padding: '1vh',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: '#ffffff',
                  color: '#7164b4'
                }}
              >
                {card.word}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={initializeGame}
          style={{
            padding: '1vh 2vw',
            color: '#ffffff',
            fontWeight: 'bold',
            borderRadius: '9999px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transitionProperty: 'background-color',
            transitionDuration: '150ms',
            marginBottom: '2vh',
            backgroundColor: '#7164b4',
            fontSize: '1.2vw'
          }}
        >
          விளையாட்டை மீண்டும் தொடங்கவும்
        </button>

        <TablaCelebration show={showCelebration} stop={stopCelebration} />
      </div>
    </AppBackground>
  );
};

export default CardflippingT;