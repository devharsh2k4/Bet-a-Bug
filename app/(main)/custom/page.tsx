"use client";

import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Button } from "@/components/ui/button"; 
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";


// Dynamically import the GameCanvas component to avoid server-side rendering
// const _GameCanvas = dynamic(() => import('@/components/GameCanvas'), { ssr: false });

const mazeSize = 5; // 5x5 maze grid

// Create an initial maze structure with all problems locked
type MazeCell = {
  solved: boolean;
  question: string;
};

const createMaze = () => {
  const maze: MazeCell[][] = [];
  for (let i = 0; i < mazeSize; i++) {
    maze.push([]);
    for (let j = 0; j < mazeSize; j++) {
      maze[i].push({
        solved: false,
        question: `Solve problem at (${i}, ${j})`,
      });
    }
  }
  // Unlock the starting point
  maze[0][0].solved = true;
  return maze;
};

const MazeCompetitionPage = () => {
  const [maze, setMaze] = useState(createMaze());
  const [currentPosition, setCurrentPosition] = useState([0, 0]); // Starting at [0, 0]
  const [code, setCode] = useState<string>(""); // Code state for editor
  const [problem, setProblem] = useState<string>("Solve problem at (0, 0)");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [timeLeft, _setTimeLeft] = useState<number>(300); // 5-minute timer
  const { width, height } = useWindowSize();

  // Handle problem submission
  const handleSubmit = () => {
    try {
      const isCorrect = eval(code + "; add(2, 3) === 5"); // Example check
      if (isCorrect) {
        alert("Correct solution!");
        unlockAdjacentCells();
        setShowConfetti(true);
      } else {
        alert("Incorrect solution. Try again.");
      }
    } catch (error) {
      console.error("Error in the code:", error);
      alert("There is an error in your code.");
    }
  };

  // Unlock adjacent cells when a problem is solved
  const unlockAdjacentCells = () => {
    const [x, y] = currentPosition;
    const updatedMaze = [...maze];

    // Unlock adjacent cells (up, down, left, right)
    if (x > 0) updatedMaze[x - 1][y].solved = true; // Up
    if (x < mazeSize - 1) updatedMaze[x + 1][y].solved = true; // Down
    if (y > 0) updatedMaze[x][y - 1].solved = true; // Left
    if (y < mazeSize - 1) updatedMaze[x][y + 1].solved = true; // Right

    setMaze(updatedMaze);
  };

  // Change current problem when a user clicks on a maze cell
  const handleCellClick = (x: number, y: number) => {
    if (maze[x][y].solved) {
      setCurrentPosition([x, y]);
      setProblem(`Solve problem at (${x}, ${y})`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-4">
      {showConfetti && <Confetti width={width} height={height} />}
      <motion.h1
        className="text-5xl font-extrabold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Maze Competition
      </motion.h1>

      {/* Maze Map */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {maze.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              className={`h-16 w-16 flex items-center justify-center cursor-pointer rounded-lg shadow-md ${
                cell.solved ? "bg-green-300" : "bg-gray-300"
              }`}
            >
              {i === currentPosition[0] && j === currentPosition[1] ? "Current" : cell.solved ? "Solved" : "Locked"}
            </div>
          ))
        )}
      </div>

      {/* Problem Area */}
      <div className="text-center w-full max-w-4xl mb-6">
        <h2 className="text-3xl mb-4 font-bold">Solve the Problem</h2>
        <p className="text-lg mb-4 text-gray-700">{problem}</p>

        {/* Code Editor */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <MonacoEditor
            height="300px"
            language="javascript"
            value={code}
            options={{ theme: "vs-dark", minimap: { enabled: false }, fontSize: 16 }}
            onChange={(value) => setCode(value || "")}
          />
          <Button className="mt-4" variant="primary" onClick={handleSubmit}>
            Submit Solution
          </Button>
        </div>

        {/* Timer */}
        {timeLeft > 0 && (
          <p className="mt-4 text-red-500 text-lg font-semibold">Time Left: {timeLeft} seconds</p>
        )}
      </div>
    </div>
  );
};

export default MazeCompetitionPage;
