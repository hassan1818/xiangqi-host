// src/components/XiangqiGame.tsx
import React, { useEffect } from 'react';
import { useSocket } from '../Hooks/useSocket';
import { useXiangqiGame } from '../Hooks/useXiangqiGame';
import XiangqiBoard from './XiangqiBoard';
import GameChat from './GameChat';

interface XiangqiGameProps {
  roomId: string;
  accessToken: string;
  currentUserId: string;
}

const XiangqiGame: React.FC<XiangqiGameProps> = ({
  roomId,
  accessToken,
  currentUserId
}) => {
  const { socket, isConnected, error } = useSocket(
    process.env.REACT_APP_API_URL || 'http://localhost:3000',
    accessToken
  );

  const {
    gameState,
    moves,
    chatMessages,
    playerColor,
    selectedPiece,
    setSelectedPiece,
    joinGameRoom,
    makeMove,
    resignGame,
    sendChatMessage
  } = useXiangqiGame({ socket, roomId });

  useEffect(() => {
    if (socket && isConnected) {
      joinGameRoom();
    }
  }, [socket, isConnected, joinGameRoom]);

  if (error) {
    return <div className="error">Connection Error: {error}</div>;
  }

  if (!isConnected) {
    return <div className="loading">Connecting to game server...</div>;
  }

  if (!gameState) {
    return <div className="loading">Loading game...</div>;
  }

  return (
    <div className="xiangqi-game">
      <div className="game-header">
        <h1>Xiangqi Game - Room: {roomId}</h1>
        <div className="game-actions">
          <button 
            onClick={resignGame}
            disabled={gameState.status !== 'active'}
            className="resign-btn"
          >
            Resign
          </button>
        </div>
      </div>

      <div className="game-content">
        <div className="game-board-section">
          <XiangqiBoard
            gameState={gameState}
            playerColor={playerColor}
            selectedPiece={selectedPiece}
            onPieceSelect={setSelectedPiece}
            onMove={makeMove}
          />
        </div>

        <div className="game-sidebar">
          <GameChat
            messages={chatMessages}
            onSendMessage={sendChatMessage}
            currentUserId={currentUserId}
          />
          
          <div className="moves-history">
            <h3>Moves History</h3>
            <div className="moves-list">
              {moves.map((move, index) => (
                <div key={move.id} className="move-item">
                  {index + 1}. {move.piece} {String.fromCharCode(97 + move.from.c)}{10 - move.from.r} → {String.fromCharCode(97 + move.to.c)}{10 - move.to.r}
                  {move.captured && ` x${move.captured}`}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XiangqiGame;