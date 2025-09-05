import React, { useState } from 'react';
import { Paper, Typography, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';

const Questions = ({ player, onCorrectAnswer, activeTurn }) => {
  const questionsX = [
    { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' },
    { question: 'Capital of India?', options: ['Delhi', 'Mumbai', 'Kolkata'], answer: 'Delhi' },
    { question: '5 * 2 = ?', options: ['10', '12', '8'], answer: '10' },
    { question: 'Color of sky?', options: ['Blue', 'Green', 'Red'], answer: 'Blue' },
    { question: 'Square root of 16?', options: ['2', '4', '8'], answer: '4' }
  ];

  const questionsO = [
    { question: 'What is 3 + 5?', options: ['8', '9', '7'], answer: '8' },
    { question: 'Capital of France?', options: ['Paris', 'Berlin', 'Rome'], answer: 'Paris' },
    { question: '10 / 2 = ?', options: ['2', '5', '10'], answer: '5' },
    { question: 'Primary color?', options: ['Yellow', 'Purple', 'Pink'], answer: 'Yellow' },
    { question: 'Square root of 9?', options: ['1', '3', '9'], answer: '3' }
  ];

  const questions = player === 'X' ? questionsX : questionsO;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [msg, setMsg] = useState('Answer the question to earn your turn!');

  const handleSubmit = () => {
    const correct = selectedOption === questions[currentIndex].answer;

    if (correct) {
      if (!activeTurn) {
        setMsg(`✅ Correct! Player ${player}, your 5s window will start now or after the current move.`);
      } else if (activeTurn === player) {
        setMsg(`ℹ️ You already have the turn. Place your mark on the board.`);
      } else {
        setMsg(`✅ Correct! You're queued. You'll get 5s after ${activeTurn} finishes.`);
      }
      onCorrectAnswer(player);
    } else {
      setMsg('❌ Wrong answer. Try the next question.');
    }

    setSelectedOption('');
    setCurrentIndex((i) => (i + 1 < questions.length ? i + 1 : 0));
  };

  const isYourTurn = activeTurn === player;

  return (
    <Paper
      style={{
        width: '90%',
        padding: '3%',
        marginTop: '20vh',
        background:
          player === 'X'
            ? 'linear-gradient(180deg, #E0F7FA, #B2EBF2)'
            : 'linear-gradient(180deg, #FFF3E0, #FFE0B2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 1vh 2vh rgba(0,0,0,0.25)',
        borderRadius: '2vh'
      }}
    >
      <Typography
        variant="h5"
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '1.5vh',
          fontSize: '2.4vh'
        }}
      >
        Player {player}
      </Typography>

      <Typography
        variant="body1"
        style={{
          fontWeight: 'bold',
          marginBottom: '1.5vh',
          textAlign: 'center',
          fontSize: '2vh'
        }}
      >
        {questions[currentIndex].question}
      </Typography>

      <RadioGroup
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        style={{ width: '100%', alignItems: 'flex-start' }}
      >
        {questions[currentIndex].options.map((option, idx) => (
          <FormControlLabel
            key={idx}
            value={option}
            control={<Radio />}
            label={option}
            style={{
              marginTop: '0.5vh',
              marginBottom: '0.5vh',
              cursor: 'pointer',
              fontSize: '1.8vh'
            }}
          />
        ))}
      </RadioGroup>

      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        disabled={!selectedOption || isYourTurn}
        style={{
          marginTop: '2vh',
          width: '65%',
          fontWeight: 'bold',
          fontSize: '2vh',
          borderRadius: '1.5vh',
          padding: '1.5vh',
          transition: 'transform 0.1s ease-in-out'
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isYourTurn ? 'Place Your Mark' : 'Submit'}
      </Button>

      <Typography
        variant="subtitle1"
        style={{
          marginTop: '2vh',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          fontSize: '1.8vh'
        }}
      >
        {msg}
      </Typography>
    </Paper>
  );
};

export default Questions;
