// src/components/Chat.tsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001');

interface ChatProps {
  room: string;
  username: string;
}

interface Message {
  from: string;
  message: string;
  type: string;
  group: string;
}

const Chat: React.FC<ChatProps> = ({ room, username }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
  
    useEffect(() => {
      socket.on('receive_message', (msg: Message) => {
        setMessages((prev) => [...prev, msg]);
      });
  
      return () => {
        socket.off('receive_message');
      };
    }, []);
  
    const sendMessage = () => {
      if (input.trim()) {
        // Here, we include 'username' in the message being sent
        socket.emit('group_message', { group: room, message: input, from: username });
        setInput('');
      }
    };
  
    return (
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <strong>{msg.from}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    );
  };
  
export default Chat;
