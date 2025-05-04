// src/components/Chat.tsx
import React, { useEffect, useState } from 'react';
import socket from '../services/socket';

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

const Chat: React.FC<ChatProps> = ({ room }) => {
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
      socket.emit('group_message', { group: room, message: input });
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
