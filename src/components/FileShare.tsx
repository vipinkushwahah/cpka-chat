// src/components/FileShare.tsx
import React from 'react';
import socket from '../services/socket';

interface FileShareProps {
  room: string;
  username: string;
}

const FileShare: React.FC<FileShareProps> = ({ room, username }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit('file_share', {
          room,
          file: reader.result,
          filename: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileShare;
