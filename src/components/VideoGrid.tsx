// src/components/VideoGrid.tsx
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001');

// Initialize peerConnections without passing arguments to createRef
export const peerConnections = React.createRef<{ [key: string]: RTCPeerConnection }>(); // No initial value passed

interface VideoGridProps {
  room: string;
  username: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ room, username }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [peers, setPeers] = useState<{ [key: string]: MediaStream }>({});

  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Handle incoming group call offer
        socket.on('group_call_offer', async ({ from, offer }) => {
          // Initialize peerConnections.current safely
          if (!peerConnections.current) peerConnections.current = {};

          const pc = new RTCPeerConnection();
          peerConnections.current[from] = pc;

          pc.ontrack = (event) => {
            setPeers((prev) => ({ ...prev, [from]: event.streams[0] }));
          };

          stream.getTracks().forEach((track) => pc.addTrack(track, stream));

          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit('group_call_answer', { to: from, answer });
        });

        // Handle incoming group call answer
        socket.on('group_call_answer', async ({ from, answer }) => {
          const pc = peerConnections.current?.[from];
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        // Handle ICE candidate messages
        socket.on('ice_candidate', async ({ from, candidate }) => {
          const pc = peerConnections.current?.[from];
          if (pc && candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        // Emit a group call offer
        socket.emit('group_call_offer', {
          room,
          offer: await createOffer(stream),
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    const createOffer = async (stream: MediaStream) => {
      if (!peerConnections.current) peerConnections.current = {}; // Initialize if null

      const pc = new RTCPeerConnection();
      peerConnections.current[username] = pc;

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice_candidate', {
            to: room,
            candidate: event.candidate,
          });
        }
      };

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      return offer;
    };

    initLocalStream();

    // Cleanup peer connections on component unmount
    return () => {
      Object.values(peerConnections.current || {}).forEach((pc) => pc.close());
    };
  }, [room, username]);

  return (
    <div className="video-grid">
      <video ref={localVideoRef} autoPlay muted playsInline />
      {Object.entries(peers).map(([peerId, stream]) => (
        <video
          key={peerId}
          autoPlay
          playsInline
          ref={(video) => {
            if (video) video.srcObject = stream;
          }}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
