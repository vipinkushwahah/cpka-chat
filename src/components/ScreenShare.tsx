// src/components/ScreenShare.tsx
import React from 'react';
import socket from '../services/socket';

interface ScreenShareProps {
  room: string;
  username: string;
}

const ScreenShare: React.FC<ScreenShareProps> = ({ room }) => {
  const startScreenShare = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      socket.emit('screen_share', { room, stream });
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  return <button onClick={startScreenShare}>Share Screen</button>;
};

export default ScreenShare;
