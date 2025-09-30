// src/components/GameChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../Types/game';

interface GameChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentUserId?: string;
}

const GameChat: React.FC<GameChatProps> = ({
  messages,
  onSendMessage,
  currentUserId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="game-chat">
      <div className="chat-header">
        <h3>Game Chat</h3>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={message ${msg.user._id === currentUserId ? 'own' : 'other'}}
          >
            <div className="message-user">{msg.user.username}</div>
            <div className="message-text">{msg.message}</div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          maxLength={200}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default GameChat;