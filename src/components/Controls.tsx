// src/components/Controls.tsx
import React from 'react';
import ScreenShare from './ScreenShare';
import FileShare from './FileShare';

interface ControlsProps {
  room: string;
  username: string;
}

const Controls: React.FC<ControlsProps> = ({ room, username }) => {
  return (
    <div className="controls">
      <ScreenShare room={room} username={username} />
      <FileShare room={room} username={username} />
    </div>
  );
};

export default Controls;
