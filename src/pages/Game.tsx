
import { useState } from 'react';

// Import all piece images
import b_a from '../assets/english-pieces/b_a.png';
import b_b from '../assets/english-pieces/b_b.png';
import b_c from '../assets/english-pieces/b_c.png';
import b_k from '../assets/english-pieces/b_k.png';
import b_n from '../assets/english-pieces/b_n.png';
import b_p from '../assets/english-pieces/b_p.png';
import b_r from '../assets/english-pieces/b_r.png';
import r_a from '../assets/english-pieces/r_a.png';
import r_b from '../assets/english-pieces/r_b.png';
import r_c from '../assets/english-pieces/r_c.png';
import r_k from '../assets/english-pieces/r_k.png';
import r_n from '../assets/english-pieces/r_n.png';
import r_p from '../assets/english-pieces/r_p.png';
import r_r from '../assets/english-pieces/r_r.png';

// Piece types and colors
type PieceType = "r_k" | "r_a" | "r_b" | "r_n" | "r_r" | "r_c" | "r_p" | "b_k" | "b_a" | "b_b" | "b_n" | "b_r" | "b_c" | "b_p";
type PieceColor = "red" | "black";

interface Piece {
  type: PieceType;
  color: PieceColor;
  id: string;
}

// 8 columns x 8 rows
type Board = (Piece | null)[][];

// Initial board setup for 8x8 Board
const createInitialBoard = (): Board => [
  [
    { type: "b_r", color: "black", id: "b_r_0" },
    { type: "b_n", color: "black", id: "b_n_0" },
    { type: "b_b", color: "black", id: "b_b_0" },
    { type: "b_a", color: "black", id: "b_a_0" },
    { type: "b_k", color: "black", id: "b_k_0" },
    { type: "b_b", color: "black", id: "b_b_1" },
    { type: "b_n", color: "black", id: "b_n_1" },
    { type: "b_r", color: "black", id: "b_r_1" },
  ],
  [
    { type: "b_c", color: "black", id: "b_c_0" }, null, 
    { type: "b_p", color: "black", id: "b_p_0" }, null, null, 
    { type: "b_p", color: "black", id: "b_p_1" }, null, 
    { type: "b_c", color: "black", id: "b_c_1" }
  ],
  [
    { type: "b_p", color: "black", id: "b_p_2" }, null, null, null, null, null, null, 
    { type: "b_p", color: "black", id: "b_p_3" }
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: "r_p", color: "red", id: "r_p_0" }, null, null, null, null, null, null, 
    { type: "r_p", color: "red", id: "r_p_1" }
  ],
  [
    { type: "r_c", color: "red", id: "r_c_0" }, null, 
    { type: "r_p", color: "red", id: "r_p_2" }, null, null, 
    { type: "r_p", color: "red", id: "r_p_3" }, null, 
    { type: "r_c", color: "red", id: "r_c_1" }
  ],
  [
    { type: "r_r", color: "red", id: "r_r_0" },
    { type: "r_n", color: "red", id: "r_n_0" },
    { type: "r_b", color: "red", id: "r_b_0" },
    { type: "r_a", color: "red", id: "r_a_0" },
    { type: "r_k", color: "red", id: "r_k_0" },
    { type: "r_b", color: "red", id: "r_b_1" },
    { type: "r_n", color: "red", id: "r_n_1" },
    { type: "r_r", color: "red", id: "r_r_1" },
  ],
  
];

function Game() {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [selectedPiece, setSelectedPiece] = useState<{row: number, col: number} | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("red");
  const [pieceNameInput, setPieceNameInput] = useState("");
  const [coordinatesInput, setCoordinatesInput] = useState("");
  const [gameLog, setGameLog] = useState<string[]>([]);

  // Get piece image path
  const getPieceImage = (piece: Piece): string => {
    const imageMap: Record<PieceType, string> = {
      'b_a': b_a,
      'b_b': b_b,
      'b_c': b_c,
      'b_k': b_k,
      'b_n': b_n,
      'b_p': b_p,
      'b_r': b_r,
      'r_a': r_a,
      'r_b': r_b,
      'r_c': r_c,
      'r_k': r_k,
      'r_n': r_n,
      'r_p': r_p,
      'r_r': r_r,
    };
    
    return imageMap[piece.type] || '';
  };

  // Handle piece click
  const handlePieceClick = (row: number, col: number) => {
    const piece = board[row][col];
    if (piece && piece.color === currentPlayer) {
      setSelectedPiece({row, col});
      setPieceNameInput(piece.type);
      setCoordinatesInput(""); // Clear coordinates when selecting new piece
      setGameLog(prev => [...prev, `Selected ${piece.type} at (${row}, ${col})`]);
    }
  };

  // Handle square click (combines piece selection and destination)
  const handleSquareClick = (row: number, col: number) => {
    const piece = board[row][col];
    
    if (piece && piece.color === currentPlayer) {
      // Clicking on own piece - select it
      handlePieceClick(row, col);
    } else if (selectedPiece && (!piece || piece.color !== currentPlayer)) {
      // Clicking on empty square or enemy piece - set as destination
      setCoordinatesInput(`${row},${col}`);
      setGameLog(prev => [...prev, `Target destination: (${row}, ${col})`]);
    }
  };

  // Execute move
  const executeMove = () => {
    if (!selectedPiece || !pieceNameInput || !coordinatesInput) {
      setGameLog(prev => [...prev, "Please select a piece and destination"]);
      return;
    }

    const coords = coordinatesInput.split(',');
    if (coords.length !== 2) {
      setGameLog(prev => [...prev, "Invalid coordinates format"]);
      return;
    }

    const toRow = parseInt(coords[0]);
    const toCol = parseInt(coords[1]);
    
    if (isNaN(toRow) || isNaN(toCol) || toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
      setGameLog(prev => [...prev, "Invalid coordinates - must be within board bounds"]);
      return;
    }

    const piece = board[selectedPiece.row][selectedPiece.col];
    
    if (!piece || piece.type !== pieceNameInput) {
      setGameLog(prev => [...prev, "Selected piece doesn't match piece name"]);
      return;
    }

    // Basic move validation (can be expanded)
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) {
      setGameLog(prev => [...prev, "Cannot capture your own piece"]);
      return;
    }

    // Create new board with the move
    const newBoard = board.map(row => [...row]);
    newBoard[selectedPiece.row][selectedPiece.col] = null;
    newBoard[toRow][toCol] = piece;

    setBoard(newBoard);
    setSelectedPiece(null);
    setPieceNameInput("");
    setCoordinatesInput("");
    setCurrentPlayer(currentPlayer === "red" ? "black" : "red");
    
    const captureText = targetPiece ? ` capturing ${targetPiece.type}` : "";
    setGameLog(prev => [...prev, `${piece.type} moved to (${toRow}, ${toCol})${captureText}`]);
  };

  // Reset game
  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelectedPiece(null);
    setPieceNameInput("");
    setCoordinatesInput("");
    setCurrentPlayer("red");
    setGameLog(["Game reset"]);
  };

  return (
    <div className="h-screen bg-gradient-to-b flex overflow-hidden">
      <div className="flex gap-8 w-full px-6 py-4">
        {/* Game Board - Left Side */}
        <div className="relative flex-shrink-0">

            {/* Traditional 8x8 Board */}
            <div 
              className="relative rounded-2xl shadow-2xl p-8"
              style={{ 
                width: 'calc(100vh - 4rem)', 
                height: 'calc(100vh - 4rem)',
                backgroundColor: '#f5e8d6',
                border: '4px solid #d4a574'
              }}
            >
              {/* Column Numbers (1-8) at top */}
              <div className="absolute flex justify-between" style={{ left: '8%', width: '84%', top: 8 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={`col-${num}`} className="text-amber-700 font-bold text-xl flex-1 text-center">
                    {num}
                  </div>
                ))}
              </div>

              {/* Column Numbers (1-8) at bottom */}
              <div className="absolute flex justify-between" style={{ left: '8%', width: '84%', bottom: 8 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={`col-bottom-${num}`} className="text-amber-700 font-bold text-xl flex-1 text-center">
                    {num}
                  </div>
                ))}
              </div>

              {/* Game Board Grid */}
              <div 
                className="relative mx-8 my-8"
                style={{ width: 'calc(100% - 4rem)', height: 'calc(100% - 4rem)' }}
              >
                {/* Horizontal Grid Lines */}
                {[...Array(8)].map((_, row) => (
                  <div
                    key={`h-line-${row}`}
                    className="absolute"
                    style={{
                      left: 0,
                      top: `${(row / 7) * 100}%`,
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#ab5e17'
                    }}
                  />
                ))}
                
                {/* Vertical Grid Lines - Full height for columns 0 and 7 */}
                {[0, 7].map((col) => (
                  <div
                    key={`v-line-full-${col}`}
                    className="absolute"
                    style={{
                      top: 0,
                      left: `${(col / 7) * 100}%`,
                      width: '2px',
                      height: '100%',
                      backgroundColor: '#ab5e17'
                    }}
                  />
                ))}
                
                {/* Vertical Grid Lines - Split at river for columns 1-6 */}
                {[1, 2, 3, 4, 5, 6].map((col) => (
                  <div key={`v-line-split-${col}`}>
                    {/* Top half (rows 0-3) */}
                    <div
                      className="absolute"
                      style={{
                        top: 0,
                        left: `${(col / 7) * 100}%`,
                        width: '2px',
                        height: '50%',
                        backgroundColor: '#ab5e17'
                      }}
                    />
                    {/* Bottom half (rows 4-7) */}
                    <div
                      className="absolute"
                      style={{
                        top: '50%',
                        left: `${(col / 7) * 100}%`,
                        width: '2px',
                        height: '50%',
                        backgroundColor: '#ab5e17'
                      }}
                    />
                  </div>
                ))}

                {/* Palace Diagonal Lines - Black Palace (Top) */}
                <svg
                  className="absolute pointer-events-none"
                  style={{ 
                    top: 0, 
                    left: `${(3/7) * 100}%`, 
                    width: `${(2/7) * 100}%`, 
                    height: `${(2/7) * 100}%` 
                  }}
                  viewBox="0 0 100 100"
                >
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#ab5e17" strokeWidth="1" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#ab5e17" strokeWidth="1" />
                </svg>

                {/* Palace Diagonal Lines - Red Palace (Bottom) */}
                <svg
                  className="absolute pointer-events-none"
                  style={{ 
                    bottom: 0, 
                    left: `${(3/7) * 100}%`, 
                    width: `${(2/7) * 100}%`, 
                    height: `${(2/7) * 100}%` 
                  }}
                  viewBox="0 0 100 100"
                >
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#ab5e17" strokeWidth="1" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#ab5e17" strokeWidth="1" />
                </svg>

                {/* River Section Labels */}
                <div
                  className="absolute text-amber-700 font-bold text-2xl tracking-widest select-none"
                  style={{
                    left: '18%',
                    top: '45%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  楚 河
                </div>
                <div
                  className="absolute text-amber-600 font-medium text-base select-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  Xiangqi.com
                </div>
                <div
                  className="absolute text-amber-700 font-bold text-2xl tracking-widest select-none"
                  style={{
                    right: '18%',
                    top: '45%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  漢 界
                </div>

                {/* Intersection Points and Pieces */}
                {board.map((row, rIdx) =>
                  row.map((piece, cIdx) => (
                    <div key={`${rIdx}-${cIdx}`}>
                      {/* Intersection Point Marker */}
                      <div
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          left: `${(cIdx / 7) * 100}%`,
                          top: `${(rIdx / 7) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1,
                          backgroundColor: '#ab5e17'
                        }}
                      />
                      
                      {/* Piece Container */}
                      <div
                        className={`absolute flex items-center justify-center cursor-pointer transition-all duration-200 rounded-full
                          ${selectedPiece?.row === rIdx && selectedPiece?.col === cIdx 
                            ? 'shadow-lg scale-110 border-4' 
                            : piece && piece.color === currentPlayer
                            ? 'hover:bg-amber-100 hover:scale-105'
                            : !piece 
                            ? 'hover:bg-amber-50'
                            : 'hover:bg-red-50'
                          }`}
                        style={{
                          left: `${(cIdx / 7) * 100}%`,
                          top: `${(rIdx / 7) * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          width: 'min(9vh, 9vw)',
                          height: 'min(9vh, 9vw)',
                          zIndex: 2,
                          backgroundColor: selectedPiece?.row === rIdx && selectedPiece?.col === cIdx 
                            ? '#8b5cf6' 
                            : 'transparent',
                          borderColor: selectedPiece?.row === rIdx && selectedPiece?.col === cIdx 
                            ? '#7c3aed' 
                            : 'transparent'
                        }}
                        onClick={() => handleSquareClick(rIdx, cIdx)}
                      >
                        {piece && (
                          <div className="relative w-full h-full">
                            {/* Piece Shadow for depth */}
                            <div 
                              className="absolute bg-black opacity-20 rounded-full blur-sm transform translate-x-0.5 translate-y-1" 
                              style={{
                                width: '90%',
                                height: '90%',
                                left: '5%',
                                top: '5%'
                              }}
                            />
                            
                            {/* Piece Image */}
                            <img
                              src={getPieceImage(piece)}
                              alt={piece.type}
                              className="pointer-events-none relative z-10 drop-shadow-lg"
                              style={{
                                width: '90%',
                                height: '90%',
                                margin: '5%'
                              }}
                              draggable={false}
                            />
                          </div>
                        )}
                        
                        {/* Valid Move Indicator for empty squares */}
                        {!piece && selectedPiece && (
                          <div className="w-3 h-3 bg-green-500 rounded-full opacity-0 hover:opacity-70 transition-opacity" />
                        )}
                        
                        {/* Coordinates Helper */}
                        {!piece && selectedPiece && (
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-amber-700 opacity-0 hover:opacity-100 transition-opacity bg-white px-1 rounded shadow-sm">
                            {rIdx},{cIdx}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
        </div>

        {/* Control Panel - Right Side */}
        <div className="flex-1 max-w-sm space-y-4 overflow-y-auto">
            {/* Player Turn Indicators */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 transition-all ${
                currentPlayer === "red" 
                  ? "bg-red-100 border-red-500 text-red-800 shadow-lg transform scale-105" 
                  : "bg-amber-50 border-amber-300 text-amber-700"
              }`}>
                <div className="text-lg font-bold text-center">紅方 (Red)</div>
                <div className="text-sm text-center">{currentPlayer === "red" ? "Your Turn" : "Waiting"}</div>
              </div>
              
              <div className="text-2xl font-bold text-amber-800 text-center">對戰</div>
              
              <div className={`p-4 rounded-lg border-2 transition-all ${
                currentPlayer === "black" 
                  ? "bg-gray-100 border-gray-600 text-gray-800 shadow-lg transform scale-105" 
                  : "bg-amber-50 border-amber-300 text-amber-700"
              }`}>
                <div className="text-lg font-bold text-center">黑方 (Black)</div>
                <div className="text-sm text-center">{currentPlayer === "black" ? "Your Turn" : "Waiting"}</div>
              </div>
            </div>

            {/* Move Input */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Make a Move</h3>
              <p className="text-sm text-gray-600 mb-3">
                Click a piece to select, then click destination or enter coordinates
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Piece
                  </label>
                  <input
                    type="text"
                    value={pieceNameInput}
                    onChange={(e) => setPieceNameInput(e.target.value)}
                    placeholder="e.g., r_k"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Move To (row,col)
                  </label>
                  <input
                    type="text"
                    value={coordinatesInput}
                    onChange={(e) => setCoordinatesInput(e.target.value)}
                    placeholder="e.g., 5,4"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={executeMove}
                  disabled={!pieceNameInput || !coordinatesInput}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Execute Move
                </button>
              </div>
            </div>

            {/* Selected Piece Info */}
            {selectedPiece && (
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Selected Piece</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Position:</span> ({selectedPiece.row}, {selectedPiece.col})</p>
                  <p><span className="font-medium">Piece:</span> {board[selectedPiece.row][selectedPiece.col]?.type}</p>
                  <p><span className="font-medium">Color:</span> {board[selectedPiece.row][selectedPiece.col]?.color}</p>
                  <p className="text-blue-600 font-medium mt-2">
                    Click on a destination square or enter coordinates
                  </p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white p-4 rounded-lg shadow space-y-2">
              <button
                onClick={resetGame}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Reset Game
              </button>
            </div>

            {/* Game Log */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Game Log</h3>
              <div className="h-40 overflow-y-auto text-sm space-y-1">
                {gameLog.map((entry, index) => (
                  <div key={index} className="text-gray-700">
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Game;