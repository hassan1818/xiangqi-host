// src/hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

export const useSocket = (url: string, token?: string): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Create socket connection
    socketRef.current = io(url, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError(err.message);
      setIsConnected(false);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setError(err.message);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [url, token]);

  return {
    socket: socketRef.current,
    isConnected,
    error
  };
};