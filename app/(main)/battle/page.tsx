"use client"; // Client component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Use this for navigation

const CodeBattleLandingPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [opponent, setOpponent] = useState<string>('');
  const router = useRouter(); // Router hook

  const battleList = ['John vs Doe', 'Alice vs Bob', 'Elon vs Jeff'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name) {
      setSubmitted(true);
      setTimeout(() => {
        const randomOpponent = ['John', 'Alice', 'Elon'][Math.floor(Math.random() * 3)];
        setOpponent(randomOpponent);

        // After finding opponent, navigate to code battle page with query params
        setTimeout(() => {
          router.push(`/battle/start?name=${name}&opponent=${randomOpponent}`);
        }, 2000); // Short delay before navigating
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.h1
        className="text-5xl font-extrabold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        1v1 Code Battle
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        {battleList.map((battle, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-xl font-semibold">{battle}</h2>
            <p className="mt-2 text-gray-400">Watch or Join!</p>
          </motion.div>
        ))}
      </motion.div>

      {!submitted ? (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              type="text"
              placeholder="choose a unique game name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 mb-4 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-blue-700"
            >
              Start Battle
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          className="mt-12"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, duration: 1 }}
        >
          <h2 className="text-2xl">Finding an opponent for {name}...</h2>
        </motion.div>
      )}
    </div>
  );
};

export default CodeBattleLandingPage;
