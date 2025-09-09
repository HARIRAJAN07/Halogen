import React, { useState, useEffect, useCallback } from 'react';
import cardsJSON from "../../data/cardsData.json";
import TablaCelebration from '../utils/Celeb';
import { useNavigate } from 'react-router-dom';
import Background from '../utils/FloatingBackground';
import logo from '../../assets/logo.png';
import BackButton from '../utils/backbutton';
import Footer from '../utils/Footer';
import Logo from '../utils/logo';

const Cardflipping = () => {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [message, setMessage] = useState('');
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameMode, setGameMode] = useState('antonym');
  const [showAllCardsTemporarily, setShowAllCardsTemporarily] = useState(false);
  const [timer, setTimer] = useState(90);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stopCelebration, setStopCelebration] = useState(false);
  const [score, setScore] = useState(0); // Added score state

  const initializeGame = useCallback(() => {
    setStopCelebration(true);
    setTimeout(() => setStopCelebration(false), 50);

    if (!cardsJSON || !cardsJSON.length) return;

    const gamePairs = cardsJSON.find(data => data.type === gameMode).pairs;

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
    setScore(0); // Reset score

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
            setMessage("Time's up! Game over.");
            setScore(0); // No score if time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [showAllCardsTemporarily, isGameActive]);

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

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setMessage('You have won the game!');
      setIsGameActive(false);
      setShowCelebration(true);
      setScore(50); // Set score to 50 on complete win
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

  const restartGame = () => {
    initializeGame();
  };

  const goToLeaderBoard = () => {
    navigate('/leaderboard');
  };

  return (
    <Background>
      <Logo />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2vw', fontFamily: 'sans-serif', color: '#4b5563' }}>
        <p style={{ fontSize: '2vw', textAlign: 'center', marginBottom: '3vh', marginTop: '3vh' }}>{gameInstructions}</p>

        {/* The button and time elements are now in the same flex container */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5vh', gap: '2vw' }}>
          <button
            onClick={() => setGameMode('antonym')}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'antonym' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'antonym' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'antonym' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.5vw'
            }}
          >
            Antonyms
          </button>
          <button
            onClick={() => setGameMode('synonym')}
            style={{
              padding: '1vh 2vw',
              borderRadius: '9999px',
              fontWeight: 'bold',
              transitionProperty: 'background-color',
              transitionDuration: '150ms',
              backgroundColor: gameMode === 'synonym' ? '#bca5d4' : '#e5e7eb',
              color: gameMode === 'synonym' ? '#ffffff' : '#4b5563',
              boxShadow: gameMode === 'synonym' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
              fontSize: '1.5vw'
            }}
          >
            Synonyms
          </button>
          <h2 style={{ fontSize: '2vw', fontWeight: 'bold' }}>
            Time: <span style={{ color: '#dc2626' }}>{formatTime(timer)}</span>
          </h2>
        </div>

        {message && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(4px)', zIndex: 50 }}>
            <div style={{ backgroundColor: '#ffffff', padding: '5vh 5vw', borderRadius: '1.5vw', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', border: '4px solid #bca5d4', textAlign: 'center', fontSize: '2.5vw', fontWeight: 'bold', transitionProperty: 'all', transitionDuration: '300ms', transform: 'scale(1.05)', position: 'relative' }}>
              {message}
              <div style={{ marginTop: '3vh', display: 'flex', justifyContent: 'center', gap: '2vw' }}>
                <button
                  onClick={goToLeaderBoard}
                  style={{
                    padding: '1.5vh 3vw',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transitionProperty: 'background-color',
                    transitionDuration: '150ms',
                    backgroundColor: '#7164b4',
                    fontSize: '1.8vw'
                  }}
                >
                  Leaderboard
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
                    fontSize: '1.8vw'
                  }}
                >
                  Play Again
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
                <i className="fas fa-question"></i>
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
                  fontSize: '1.8vw',
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
            fontSize: '1.5vw'
          }}
        >
          Restart Game
        </button>

        <TablaCelebration show={showCelebration} stop={stopCelebration} />
      </div>
      <Footer />
      <BackButton />
    </Background>
  );
};

export default Cardflipping;
