import React, { FC } from 'react';

import CellComponent from './CellComponent';

import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Player } from '../models/Player';
import { Colors } from '../models/Colors';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
  restart: () => void;
}

const initialTime: number = 300;

const BoardComponent: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
  restart,
}) => {
  const [selectedCell, setSelectedCell] = React.useState<Cell | null>(null);
  const [startGame, setStartGame] = React.useState(false);

  const [blackTime, setBlackTime] = React.useState(initialTime);
  const [whiteTime, setWhiteTime] = React.useState(initialTime);

  function clickCell(cell: Cell) {
    if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
      selectedCell.moveFigure(cell);
      swapPlayer();
      setSelectedCell(null);
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  function highlightCells() {
    board.highlightCells(selectedCell);
    updateBoard();
  }

  function handleRestart() {
    setBlackTime(initialTime);
    setWhiteTime(initialTime);
    restart();
  }

  const timer = React.useRef<null | ReturnType<typeof setInterval>>(null);

  function startTimer() {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const cb =
      currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
    timer.current = setInterval(cb, 1000);
    setStartGame(true);
  }

  function decrementBlackTimer() {
    setBlackTime(prev => prev - 1);
  }

  function decrementWhiteTimer() {
    setWhiteTime(prev => prev - 1);
  }

  React.useEffect(() => {
    if (blackTime === 0 || whiteTime === 0) {
      alert(`${currentPlayer?.color} lost`);
      if (timer.current) {
        clearInterval(timer.current);
      }
      handleRestart();
      setStartGame(false);
    }
  }, [blackTime, whiteTime]);

  React.useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  React.useEffect(() => {
    if (startGame) startTimer();
  }, [currentPlayer]);

  return (
    <>
      <div style={{ marginRight: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button className="action-btn" onClick={handleRestart} disabled={!startGame}>
            Restart game
          </button>
        </div>
        <h2>Black - {blackTime}s</h2>
        <h2>White - {whiteTime}s</h2>
      </div>
      <div>
        {startGame && (
          <h1 style={{ marginBottom: '20px' }}>Turn: {currentPlayer?.color}</h1>
        )}
        <div className="board">
          {!startGame && (
            <div className="overlay">
              <div>
                <button className="action-btn" onClick={startTimer}>
                  Start game
                </button>
              </div>
            </div>
          )}

          {board.cells.map((row, i) => (
            <React.Fragment key={i}>
              {row.map(cell => (
                <CellComponent
                  key={cell.id}
                  cell={cell}
                  selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                  onClick={clickCell}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default BoardComponent;
