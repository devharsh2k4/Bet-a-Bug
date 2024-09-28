"use client";

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Ensure you import the Nagato font in your global CSS or _app.tsx
// Example: @import url('https://fonts.googleapis.com/css2?family=Nagato&display=swap');

const socket = io('http://localhost:3001');

const CustomBattlePage: React.FC = () => {
  const [roomID, setRoomID] = useState<string>('');
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isRoomFull, setIsRoomFull] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    socket.on('roomCreated', (id: string) => {
      setRoomID(id);
      setIsHost(true);
    });

    socket.on('roomJoined', (id: string) => {
      setRoomID(id);
      setIsRoomFull(false); // Reset room full status
    });

    socket.on('startBattle', () => {
      router.push('/battle/start?name=Host&opponent=Player');
    });

    socket.on('error', (message: string) => {
      setErrorMessage(message);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('startBattle');
      socket.off('error');
    };
  }, [router]);

  const handleCreateRoom = () => {
    const roomID = Math.random().toString(36).substring(2, 9); // Generate random room ID
    socket.emit('createRoom', roomID);
    setIsRoomFull(true); // Indicate that the room is being created
  };

  const handleJoinRoom = () => {
    if (roomID) {
      socket.emit('joinRoom', roomID);
      setIsRoomFull(true); // Indicate that the user is trying to join
    } else {
      setErrorMessage('Please enter a valid Room ID');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-4">
      <motion.h1
        className="text-5xl font-extrabold mb-8 font-nagato" // Use the Nagato font class here
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Custom 1v1 Battle
      </motion.h1>

      {errorMessage && (
        <div className="text-red-500 mb-4">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        {!roomID && (
          <>
            <button
              onClick={handleCreateRoom}
              className="px-6 py-3 bg-blue-700 text-gray-800 font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300"
              aria-label="Create Room"
            >
              Create Room
            </button>

            <div className="flex flex-col items-center w-full">
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
                className="px-4 py-2 mb-4 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                aria-label="Room ID Input"
              />
              <button
                onClick={handleJoinRoom}
                className="px-6 py-3 bg-green-700 text-gray-800 font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:bg-green-800 focus:outline-none focus:ring focus:ring-green-300"
                aria-label="Join Room"
              >
                Join Room
              </button>
            </div>
          </>
        )}

        {roomID && isHost && (
          <div className="text-lg">
            Room ID: <strong>{roomID}</strong>
            <p className="mt-4">Waiting for another player to join...</p>
          </div>
        )}

        {roomID && !isHost && isRoomFull && (
          <div className="text-lg">
            Joining Room: <strong>{roomID}</strong>
          </div>
        )}
      </div>
    </div>
  );
};


export default CustomBattlePage;