// src/components/XiangqiBoard.tsx
import React from 'react';
import type { GameState, Position } from '../Types/game';

interface XiangqiBoardProps {
  gameState: GameState;
  playerColor: 'red' | 'black' | null;
  selectedPiece: Position | null;
  onPieceSelect: (position: Position) => void;
  onMove: (piece: string, from: Position, to: Position, captured?: string) => void;
}

const XiangqiBoard: React.FC<XiangqiBoardProps> = ({
  gameState,
  playerColor,
  selectedPiece,
  onPieceSelect,
  onMove
}) => {
  const isMyTurn = gameState.turn === playerColor;

  const handleSquareClick = (row: number, col: number) => {
    if (!isMyTurn) return;

    const position = { r: row, c: col };
    const piece = gameState.board[row][col];

    if (selectedPiece) {
      // Making a move
      if (selectedPiece.r === row && selectedPiece.c === col) {
        // Clicking same piece - deselect
        onPieceSelect(null as any);
      } else {
        // Move piece
        const fromPiece = gameState.board[selectedPiece.r][selectedPiece.c];
        const captured = piece !== '.' ? piece : undefined;
        
        onMove(fromPiece, selectedPiece, position, captured);
      }
    } else {
      // Selecting a piece
      if (piece !== '.') {
        // Check if it's player's piece
        const isRedPiece = piece === piece.toUpperCase();
        const isPlayersPiece = (playerColor === 'red' && isRedPiece) || 
                              (playerColor === 'black' && !isRedPiece);
        
        if (isPlayersPiece) {
          onPieceSelect(position);
        }
      }
    }
  };

  const getPieceSymbol = (piece: string): string => {
    const symbols: { [key: string]: string } = {
      'R': '車', 'r': '車', // Rook/Chariot
      'H': '馬', 'h': '馬', // Horse
      'E': '象', 'e': '象', // Elephant
      'A': '士', 'a': '士', // Advisor
      'G': '將', 'g': '將', // General/King
      'C': '砲', 'c': '砲', // Cannon
      'S': '兵', 's': '卒', // Soldier/Pawn
    };
    return symbols[piece] || piece;
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedPiece?.r === row && selectedPiece.c === col;
  };

  return (
    <div className="xiangqi-board">
      <div className="board-container">
        <div className="board-grid">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((piece, colIndex) => (
                <div
                  key={${rowIndex}-${colIndex}}
                  className={`
                    board-square 
                    ${isSelected(rowIndex, colIndex) ? 'selected' : ''}
                    ${!isMyTurn ? 'disabled' : ''}
                  `}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece !== '.' && (
                    <div className={piece ${piece === piece.toUpperCase() ? 'red' : 'black'}}>
                      {getPieceSymbol(piece)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="game-info">
        <p>Current Turn: {gameState.turn}</p>
        <p>Your Color: {playerColor}</p>
        <p>Status: {gameState.status}</p>
        {gameState.winner && (
          <p>Winner: {gameState.winner} ({gameState.resultReason})</p>
        )}
      </div>
    </div>
  );
};

export default XiangqiBoard;