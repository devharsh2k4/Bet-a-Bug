"use client";

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import CodeEditor from "@/components/CodeEditor"; // Your custom code editor component
import { Button } from "@/components/ui/button"; // Import your button component

// Dynamically import the GameCanvas component to avoid server-side rendering
const GameCanvas = dynamic(() => import('@/components/GameCanvas'), { ssr: false });

const GamePage = () => {
  const [unit, setUnit] = useState<number>(1);
  const [userCode, setUserCode] = useState<string>(""); // Code state for editor
  const [showSidebar, setShowSidebar] = useState<boolean>(true); // Toggle sidebar visibility
  const [gameStarted, setGameStarted] = useState<boolean>(false); // Track if the game is started

  const unitDescriptions = [
    "Create Platforms and Character",
    "Add Character Movement",
    "Add Gravity to Player",
    "Add Jumping to Player",
    "Add Enemy Movement",
    "Implement a Score System",
    "Create Collectible Items",
    "Game Over Condition",
    "Add Sound Effects",
    "Add Background Music"
  ];

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
      case 3:
        return `// Unit 3: Add Gravity to Player
// Apply gravity to the player, making them fall when not on a platform.
player.setGravityY(300);`;
      case 4:
        return `// Unit 4: Add Jumping to Player
// Implement jumping mechanics for the player.
if (this.cursors.up.isDown && player.body.touching.down) {
  player.setVelocityY(-330); // Jump with velocity
}`;
      case 5:
        return `// Unit 5: Add Enemy Movement
// Create an enemy that moves left and right.
const enemy = this.physics.add.sprite(300, 200, 'enemy');
enemy.setBounce(1);
enemy.setCollideWorldBounds(true);
enemy.setVelocityX(100); // Moves horizontally
`;
      case 6:
        return `// Unit 6: Add Score System
// Display score and update it when the player collects an item.
let score = 0;
const scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

function collectItem(player, item) {
  item.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
}`;
      case 7:
        return `// Unit 7: Create Collectibles
// Add collectible items that disappear when collected.
const items = this.physics.add.group({
  key: 'star',
  repeat: 5,
  setXY: { x: 12, y: 0, stepX: 70 }
});

items.children.iterate(function (child) {
  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
});`;
      case 8:
        return `// Unit 8: Game Over Condition
// Implement game over when the player touches an enemy.
this.physics.add.collider(player, enemy, () => {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
});`;
      case 9:
        return `// Unit 9: Add Sound Effects
// Play sound effects when certain events occur.
const jumpSound = this.sound.add('jump');

function playJumpSound() {
  jumpSound.play();
}

if (this.cursors.up.isDown && player.body.touching.down) {
  playJumpSound();
  player.setVelocityY(-330);
}`;
      case 10:
        return `// Unit 10: Add Background Music
// Loop background music during the game.
const backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
backgroundMusic.play();`;
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
              {unitDescriptions.map((description, unitIndex) => (
                <li
                  key={unitIndex}
                  className={`mb-2 cursor-pointer ${unit === unitIndex + 1 ? "font-semibold text-blue-600" : "hover:text-blue-600"}`}
                  onClick={() => setUnit(unitIndex + 1)}
                >
                  {`Unit ${unitIndex + 1}: ${description}`}
                </li>
              ))}
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
