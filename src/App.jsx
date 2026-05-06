import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button 
      className={`square ${value ? value.toLowerCase() : ''} ${isWinningSquare ? 'winning' : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : [];

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    status = <span className="status-winner">Winner: {winner}</span>;
  } else if (squares.every(s => s !== null)) {
    status = "It's a draw!";
  } else {
    status = (
      <>
        Next player: <span className="status-value">{xIsNext ? 'X' : 'O'}</span>
      </>
    );
  }

  return (
    <>
      <div className="status-container">{status}</div>
      <div className="board-grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Square 
            key={i} 
            value={squares[i]} 
            onSquareClick={() => handleClick(i)} 
            isWinningSquare={winningLine.includes(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Tic Tac Toe</h1>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={squares} onPlay={handlePlay} />
      </div>
      <button className="restart-btn" onClick={restartGame}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
