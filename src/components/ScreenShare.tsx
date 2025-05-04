// src/components/ScreenShare.tsx
import React from 'react';
// import socket from '../services/socket';
import { peerConnections } from './VideoGrid'; // Import peerConnections
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001');
interface ScreenShareProps {
  room: string;
  username: string;
}

const ScreenShare: React.FC<ScreenShareProps> = ({ room, username }) => {
  const startScreenShare = async () => {
    try {
      // Get the screen share stream
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      
      const screenTrack = stream.getTracks()[0]; // Capture the screen track

      // Ensure peerConnections.current is not null
      if (peerConnections.current) {
        // Replace the video track in each peer connection
        Object.values(peerConnections.current).forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack); // Replace track with screen share
          }
        });
      }

      // Emit to backend if needed
      socket.emit('screen_share', { room, username });

      // Event listener for when screen sharing ends
      screenTrack.onended = () => {
        console.log('📺 Screen sharing stopped');
      };
    } catch (error) {
      console.error('❌ Error sharing screen:', error);
    }
  };

  return <button onClick={startScreenShare}>Share Screen</button>;
};

export default ScreenShare;
