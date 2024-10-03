"use client"; // Client component

import React from 'react';
import { useRouter } from 'next/navigation'; // Use this for navigation
import Image from 'next/image';

const CodeBattleLandingPage: React.FC = () => {
  const router = useRouter(); // Router hook

  const handleStartBattle = () => {
    // Navigate to the battle start page
    router.push(`/battle/start`);
  };

  return (
    <div className="flex flex-col items-center justify-around min-h-screen bg-gradient-to-r text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Battle</h1>
      <Image src="/battle.svg" alt="battle" width={200} height={200} className="mb-8" />
      <button
        onClick={handleStartBattle}
        className="px-8 py-4 bg-slate-600 text-white font-semibold rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-blue-700"
      >
        Start Battle
      </button>
    </div>
  );
};

export default CodeBattleLandingPage;
