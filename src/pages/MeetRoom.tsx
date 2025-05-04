// src/pages/MeetRoom.tsx
import React, { useState } from 'react';
// import socket from '../services/socket';
import VideoGrid from '../components/VideoGrid';
import Chat from '../components/Chat';
import Controls from '../components/Controls';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001');
const MeetRoom: React.FC = () => {
  const [room, setRoom] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [joined, setJoined] = useState<boolean>(false);

  const handleJoin = () => {
    if (username && room) {
      socket.emit('register', username);
      socket.emit('join_group', room);
      setJoined(true);
    }
  };

  return (
    <div className="meet-container">
      {!joined ? (
        <div className="join-box">
          <input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Enter Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={handleJoin}>Join Meet</button>
        </div>
      ) : (
        <>
          <VideoGrid room={room} username={username} />
          <Chat room={room} username={username} />
          <Controls room={room} username={username} />
        </>
      )}
    </div>
  );
};

export default MeetRoom;
