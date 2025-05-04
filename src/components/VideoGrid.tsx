// src/components/VideoGrid.tsx
import React, { useEffect, useRef, useState } from 'react';
import socket from '../services/socket';

interface VideoGridProps {
  room: string;
  username: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ room, username }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [peers, setPeers] = useState<{ [key: string]: MediaStream }>({});
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});

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

        socket.on('group_call_offer', async ({ from, offer }) => {
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

        socket.on('group_call_answer', async ({ from, answer }) => {
          const pc = peerConnections.current[from];
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        socket.on('ice_candidate', async ({ from, candidate }) => {
          const pc = peerConnections.current[from];
          if (pc && candidate) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        // Initiate call to other users
        socket.emit('group_call_offer', {
          room,
          offer: await createOffer(stream),
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    const createOffer = async (stream: MediaStream) => {
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

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
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
