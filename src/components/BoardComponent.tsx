import React, { FC } from 'react';

import CellComponent from './CellComponent';

import { Board } from '../models/Board';
import { Cell } from '../models/Cell';
import { Player } from '../models/Player';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}

const BoardComponent: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
}) => {
  const [selectedCell, setSelectedCell] = React.useState<Cell | null>(null);

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

  function highlightCells() {
    board.highlightCells(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  React.useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  return (
    <div>
      <h3 style={{ marginBottom: '20px' }}>Turn: {currentPlayer?.color}</h3>
      <div className="board">
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
  );
};

export default BoardComponent;
