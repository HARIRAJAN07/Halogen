import React, { useState, useRef, useEffect } from 'react';
import Board from './Board';
import Questions from './Questions';
import { Typography, Paper } from '@mui/material';
import bluebg from '../../assets/blueBG.jpg';

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
    setMessage(`✅ Player ${player}, place your mark!`);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          stopInterval();
          setTurn(null);
          setCurrentPlayer(null);
          setTimer(0);
          setMessage(`⏱ Player ${player} time expired.`);

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
      setMessage('⚠️ Answer a question first to earn a turn!');
      return;
    }
    if (board[row][col]) {
      setMessage('⚠️ Cell already occupied!');
      return;
    }

    const newBoard = board.map((r) => r.slice());
    newBoard[row][col] = turn;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setMessage(`🎉 Player ${winner} wins!`);
      stopInterval();
      setTurn(null);
      setCurrentPlayer(null);
      setQueue([]);
      setTimer(0);
      setGameOver(true); 
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
      setMessage('Answer a question to continue.');
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
        paddingTop: '2vh'
      }}
    >

      {/* Player X */}
      <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Questions player="X" onCorrectAnswer={handleCorrectAnswer} activeTurn={turn} />
        <Typography
          variant="h6"
          style={{
            marginTop: '2vh',
            fontWeight: 'bold',
            fontSize: '2.2vh',
            color: turn === 'X' ? '#1E88E5' : '#333'
          }}
        >
          {turn === 'X' && `Timer: ${timer}s`}
        </Typography>
      </div>

      {/* Board */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          style={{
            width: '90%',
            marginTop: '12vh',
            padding: '3%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
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
      </div>

      {/* Player O */}
      <div style={{ width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Questions player="O" onCorrectAnswer={handleCorrectAnswer} activeTurn={turn} />
        <Typography
          variant="h6"
          style={{
            marginTop: '2vh',
            fontWeight: 'bold',
            fontSize: '2.2vh',
            color: turn === 'O' ? '#D32F2F' : '#333'
          }}
        >
          {turn === 'O' && `Timer: ${timer}s`}
        </Typography>
      </div>
    </div>
  );
};

export default XO;
