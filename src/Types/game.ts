// src/types/game.ts
export interface Position {
  r: number;
  c: number;
}

export interface Move {
  id: string;
  piece: string;
  from: Position;
  to: Position;
  captured?: string;
  moveNumber: number;
  playedBy: {
    _id: string;
    username: string;
  };
  color: 'red' | 'black';
  createdAt: string;
}

export interface GameState {
  roomId: string;
  status: 'waiting' | 'active' | 'finished';
  board: string[][];
  turn: 'red' | 'black';
  players: {
    red?: {
      _id: string;
      username: string;
    };
    black?: {
      _id: string;
      username: string;
    };
  };
  winner?: 'red' | 'black';
  resultReason?: string;
}

export interface ChatMessage {
  id: string;
  user: {
    _id: string;
    username: string;
  };
  message: string;
  timestamp: string;
}