import React, { FC } from 'react';

import CellComponent from './CellComponent';

import { Board } from '../models/Board';
import { Cell } from '../models/Cell';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
}

const BoardComponent: FC<BoardProps> = ({ board, setBoard }) => {
  const [selectedCell, setSelectedCell] = React.useState<Cell | null>(null);

  function clickCell(cell: Cell) {
    if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
      selectedCell.moveFigure(cell);
      setSelectedCell(null);
    } else {
      setSelectedCell(cell);
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
  );
};

export default BoardComponent;
