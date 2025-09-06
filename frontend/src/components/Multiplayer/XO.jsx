import React, { useState, useRef, useEffect } from 'react';
import Board from './Board';
import Questions from './Questions';
import { Typography, Paper, Button, Card, CardContent } from '@mui/material';
import { Fireworks } from '@fireworks-js/react';
import ConfettiExplosion from 'react-confetti-explosion';
import bluebg from '../../assets/blueBG.jpg';
import cheer from '../../assets/cheer.mp3';

const XO = () => {
  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);

  const [turn, setTurn] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState('Answer a question to start!');
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // celebration
  const [showFireworks, setShowFireworks] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null);

  // language toggle only for XO texts
  const [tamil, setTamil] = useState(false);

  const timerRef = useRef(null);
  const queueRef = useRef(queue);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const checkWinner = (b) => {
    for (let i = 0; i < 3; i++) if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
    for (let j = 0; j < 3; j++) if (b[0][j] && b[0][j] === b[1][j] && b[1][j] === b[2][j]) return b[0][j];
    if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
    if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
    return null;
  };

  const stopInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTurn = (player) => {
    if (gameOver) return;
    stopInterval();

    setTurn(player);
    setCurrentPlayer(player);
    setTimer(5);
    setMessage(tamil ? `✅ வீரர் ${player}, உங்கள் அடையாளத்தை வையுங்கள்!` : `✅ Player ${player}, place your mark!`);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopInterval();
          setTurn(null);
          setCurrentPlayer(null);
          setTimer(0);
          setMessage(tamil ? `⏱ வீரர் ${player} நேரம் முடிந்தது.` : `⏱ Player ${player} time expired.`);

          const q = queueRef.current;
          if (!gameOver && q.length > 0) {
            const [next, ...rest] = q;
            setQueue(rest);
            startTurn(next);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;

    if (!turn) {
      setMessage(tamil ? '⚠️ முதலில் கேள்விக்கு பதில் சொல்லுங்கள்!' : '⚠️ Answer a question first to earn a turn!');
      return;
    }
    if (board[row][col]) {
      setMessage(tamil ? '⚠️ இந்த செல் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது!' : '⚠️ Cell already occupied!');
      return;
    }

    const newBoard = board.map((r) => r.slice());
    newBoard[row][col] = turn;
    setBoard(newBoard);

    const w = checkWinner(newBoard);
    if (w) {
      setWinner(w);
      setMessage(tamil ? `🎉 வீரர் ${w} வெற்றி பெற்றார்!` : `🎉 Player ${w} wins!`);
      stopInterval();
      setTurn(null);
      setCurrentPlayer(null);
      setQueue([]);
      setTimer(0);
      setGameOver(true);

      // trigger celebrations
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setShowFireworks(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowFireworks(false);
        setShowConfetti(false);
      }, 8000);

      return;
    }

    stopInterval();
    setTurn(null);
    setCurrentPlayer(null);
    setTimer(0);

    const q = queueRef.current;
    if (q.length > 0) {
      const [next, ...rest] = q;
      setQueue(rest);
      startTurn(next);
    } else {
      setMessage(tamil ? 'தொடர கேள்விக்கு பதில் சொல்லுங்கள்.' : 'Answer a question to continue.');
    }
  };

  const handleCorrectAnswer = (player) => {
    if (gameOver) return;

    if (!turn && !currentPlayer) {
      startTurn(player);
      return;
    }
    if (turn && turn !== player) {
      setQueue((prev) => (prev.includes(player) ? prev : [...prev, player]));
      return;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: '100vh',
        backgroundColor: '#F0F4F8',
        backgroundImage: `url(${bluebg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: '2vh',
        position: 'relative'
      }}
    >
      {/* Fireworks background */}
      {showFireworks && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Fireworks
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
              explosion: 6
            }}
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0
            }}
          />
        </div>
      )}

      {/* Confetti */}
      {showConfetti && (
        <div style={{ position: 'absolute', zIndex: 10 }}>
          <ConfettiExplosion force={0.7} duration={4500} particleCount={150} width={1200} />
        </div>
      )}

      {/* Hidden sound */}
      <audio ref={audioRef} src={cheer} />

      {/* Winner card */}
      {gameOver && winner && (
        <Card
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)',
            padding: '2vh 4vw',
            zIndex: 20,
            boxShadow: '0 1vh 2vh rgba(0,0,0,0.3)',
            borderRadius: '2vh',
            background: 'linear-gradient(135deg, #FFEB3B, #FF9800)'
          }}
        >
          <CardContent>
            <Typography variant="h4" style={{ fontWeight: 'bold', textAlign: 'center', color: '#000' }}>
              {tamil ? `🎉 வாழ்த்துக்கள்! வீரர் ${winner} வெற்றி பெற்றார்!` : `🎉 Congratulations! Player ${winner} Wins!`}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Player X */}
      <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Questions player="X" onCorrectAnswer={handleCorrectAnswer} activeTurn={turn} />
        {turn === 'X' && (
          <Paper
            style={{
              marginTop: '2vh',
              padding: '1vh 2vw',
              borderRadius: '1vh',
              backgroundColor: '#fff',
              boxShadow: '0 0.5vh 1vh rgba(0,0,0,0.15)'
            }}
          >
            <Typography
              variant="h6"
              style={{
                fontWeight: 'bold',
                fontSize: '2.2vh',
                color: '#1E88E5',
                textAlign: 'center'
              }}
            >
              {tamil ? 'நேரம்' : 'Timer'}: {timer}s
            </Typography>
          </Paper>
        )}
      </div>

      {/* Board */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          style={{
            width: '70%',
            marginTop: '12vh',
            padding: '3%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 1vh 3vh rgba(0,0,0,0.2)',
            borderRadius: '2vh'
          }}
        >
          <Board board={board} onCellClick={handleCellClick} turn={turn} />
          <Typography
            variant="h6"
            style={{
              marginTop: '3vh',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '2.4vh',
              color: '#333'
            }}
          >
            {message}
          </Typography>
        </Paper>

        {/* Language toggle button */}
        <Button
          variant="contained"
          onClick={() => setTamil(!tamil)}
          style={{
            marginTop: '3vh',
            fontWeight: 'bold',
            borderRadius: '1.5vh',
            background: tamil ? '#1E88E5' : '#D32F2F'
          }}
        >
          {tamil ? 'Switch to English' : 'தமிழ்'}
        </Button>
      </div>

      {/* Player O */}
      <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Questions player="O" onCorrectAnswer={handleCorrectAnswer} activeTurn={turn} />
        {turn === 'O' && (
          <Paper
            style={{
              marginTop: '2vh',
              padding: '1vh 2vw',
              borderRadius: '1vh',
              backgroundColor: '#fff',
              boxShadow: '0 0.5vh 1vh rgba(0,0,0,0.15)'
            }}
          >
            <Typography
              variant="h6"
              style={{
                fontWeight: 'bold',
                fontSize: '2.2vh',
                color: '#D32F2F',
                textAlign: 'center'
              }}
            >
              {tamil ? 'நேரம்' : 'Timer'}: {timer}s
            </Typography>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default XO;
