import React from 'react';

const Board = ({ board, onCellClick, turn }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        
        width: '100%',
        height: '100%',
        padding: '1vw',
        background: 'white',
        borderRadius: '1vw',
        boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
      }}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row' }}>
          {row.map((cell, colIndex) => {
            const isEmpty = !cell;
            const highlight = turn && isEmpty;
            return (
              <div
                key={colIndex}
                onClick={() => onCellClick(rowIndex, colIndex)}
                style={{
                  width: '8vw',
                  height: '8vw',
                  border: '0.5vw solid black',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '4vw',
                  cursor: isEmpty ? 'pointer' : 'not-allowed',
                  userSelect: 'none',
                  backgroundColor: highlight ? '#FFF59D' : '#FFFFFF',
                  transition: 'all 0.3s ease',
                  margin: '0.5vw',
                  boxShadow: highlight
                    ? '0 4px 12px rgba(255,235,59,0.5)'
                    : '0 4px 6px rgba(0,0,0,0.1)',
                  borderRadius: '0.5vw'
                }}
                onMouseEnter={(e) => {
                  if (isEmpty) e.currentTarget.style.backgroundColor = '#FFF176';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = highlight ? '#FFF59D' : '#FFFFFF';
                }}
              >
                {cell}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
