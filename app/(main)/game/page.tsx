"use client";

import React, { useState, useEffect } from "react";
import GameCanvas from "@/components/GameCanvas"; // Your custom game component
import CodeEditor from "@/components/CodeEditor"; // Your custom code editor component
import { Button } from "@/components/ui/button"; // Import your button component

const GamePage = () => {
  const [unit, setUnit] = useState<number>(1);
  const [userCode, setUserCode] = useState<string>(""); // Code state for editor
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // Toggle sidebar visibility
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Track if the game is started

  const loadUnitCode = (unitNumber: number): string => {
    switch (unitNumber) {
      case 1:
        return `// Unit 1: Create Platforms and Character
// Platforms and Player are already created in the GameCanvas.
// You can add additional assets or modify existing ones here.`;
      case 2:
        return `// Unit 2: Character Movement
// Add movement controls here.
this.cursors = this.input.keyboard.createCursorKeys();

function update () {
  if (this.cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  }
  else if (this.cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (this.cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}`;
      default:
        return "";
    }
  };

  useEffect(() => {
    const initialCode = loadUnitCode(unit);
    setUserCode(initialCode); // Set the default code based on unit
  }, [unit]);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-black p-6">
      {/* Toggle Button to Show/Hide Learning Units */}
      <div className="p-4 flex justify-between w-full max-w-5xl">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? "Hide Learning Units" : "Show Learning Units"}
        </button>

        <Button className="px-8 py-2 bg-green-600 text-white" onClick={startGame}>
          {gameStarted ? "Restart Game" : "Start Game"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row h-full w-full max-w-5xl">
        {/* Conditionally render the Sidebar for Learning Units */}
        {showSidebar && (
          <div className="lg:w-1/5 p-4 bg-gray-100 min-h-[100vh] border-r border-gray-300">
            <h2 className="text-2xl font-bold mb-4">Learning Units</h2>
            <ul>
              <li
                className={`mb-2 cursor-pointer ${unit === 1 ? "font-semibold text-blue-600" : "hover:text-blue-600"}`}
                onClick={() => setUnit(1)}
              >
                Unit 1: Create Platform & Character
              </li>
              <li
                className={`mb-2 cursor-pointer ${unit === 2 ? "font-semibold text-blue-600" : "hover:text-blue-600"}`}
                onClick={() => setUnit(2)}
              >
                Unit 2: Character Movement
              </li>
            </ul>
          </div>
        )}

        {/* Game Canvas */}
        <div className={`${showSidebar ? "lg:w-4/5" : "lg:w-full"} flex flex-col justify-center items-center`}>
          <div className="w-full bg-black flex justify-center items-center rounded-lg mb-4 shadow-lg overflow-hidden">
            {gameStarted ? <GameCanvas userCode={userCode} /> : <p className="text-white p-4">Game will appear here.</p>}
          </div>

          {/* Code Editor */}
          <div className="w-full bg-gray-200 p-4">
            <h2 className="text-xl font-bold mb-4">Code Editor</h2>
            <div className="h-[200px] overflow-auto">
              <CodeEditor code={userCode} setCode={setUserCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
