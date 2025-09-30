// src/hooks/useXiangqiGame.ts
import { useState, useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import type { GameState, Move, Position, ChatMessage } from '../Types/game';

interface UseXiangqiGameProps {
  socket: Socket | null;
  roomId?: string;
}

export const useXiangqiGame = ({ socket, roomId }: UseXiangqiGameProps) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [playerColor, setPlayerColor] = useState<'red' | 'black' | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Xiangqi game events
    socket.on('xiangqi_connected', (data) => {
      console.log('Xiangqi connected:', data.message);
    });

    socket.on('joined_game_room', (data) => {
      console.log('Joined game room:', data);
      setGameState(data.game);
      setPlayerColor(data.color);
    });

    socket.on('move_made', (data) => {
      console.log('Move made:', data);
      setMoves(prev => [...prev, data.move]);
      setGameState(prev => prev ? { ...prev, turn: data.turn } : null);
      setSelectedPiece(null);
    });

    socket.on('game_over', (data) => {
      console.log('Game over:', data);
      setGameState(prev => prev ? {
        ...prev,
        status: 'finished',
        winner: data.winner,
        resultReason: data.reason
      } : null);
    });

    socket.on('player_joined', (data) => {
      console.log('Player joined:', data);
      // Update game state when second player joins
    });

    socket.on('player_disconnected', (data) => {
      console.log('Player disconnected:', data);
    });

    // Chat events
    socket.on('chat_message_received', (data) => {
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: data.user,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString()
      }]);
    });

    return () => {
      socket.off('xiangqi_connected');
      socket.off('joined_game_room');
      socket.off('move_made');
      socket.off('game_over');
      socket.off('player_joined');
      socket.off('player_disconnected');
      socket.off('chat_message_received');
    };
  }, [socket]);

  const joinGameRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit('join_game_room', { roomId });
    }
  }, [socket, roomId]);

  const makeMove = useCallback((piece: string, from: Position, to: Position, captured?: string) => {
    if (socket && gameState?.turn === playerColor) {
      socket.emit('make_move', { piece, from, to, captured });
    }
  }, [socket, gameState?.turn, playerColor]);

  const resignGame = useCallback(() => {
    if (socket) {
      socket.emit('resign_game');
    }
  }, [socket]);

  const sendChatMessage = useCallback((message: string) => {
    if (socket && roomId) {
      socket.emit('send_chat_message', { roomId, message });
    }
  }, [socket, roomId]);

  return {
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
  };
};