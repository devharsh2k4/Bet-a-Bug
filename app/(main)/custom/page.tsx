"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import MonacoEditor from "@monaco-editor/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Image from "next/image";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

const socket = io("http://localhost:3001");

const _CONTRACT_ADDRESS = "0x5658f10fE45b021D578a1cbDaD4eD11e8868D0Cb";
const _CONTRACT_ABI = [
  // Contract ABI structure here...
];

const CustomBattlePage: React.FC = () => {
  const [roomID, setRoomID] = useState<string>("");
  const [_isHost, setIsHost] = useState<boolean>(false);
  const [_isRoomFull, setIsRoomFull] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [_selectedMode, _setSelectedMode] = useState<"Ranked" | "Practice" | null>(null);
  const [selectedMatchType, setSelectedMatchType] = useState<string | null>(null);
  const [_walletAddress, setWalletAddress] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [timeLeft, _setTimeLeft] = useState<number>(300);
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const router = useRouter();
  const { width, height } = useWindowSize();

  const matchTypes = [
    { type: "1v1", image: "/onevone.webp", description: "Classic 1v1 battle." },
    { type: "Tag Team", image: "/tagteam.webp", description: "Team up with a partner for a duo showdown." },
    { type: "Triple Threat", image: "/tripleThreat.webp", description: "Three players, one winner. All vs all." },
    { type: "Fatal Four Way", image: "/fatal4way.webp", description: "Four players face off in a brutal contest." },
    { type: "Royal Rumble", image: "/royalrumble.webp", description: "A battle royale-style match with multiple players." },
  ];

  useEffect(() => {
    socket.on("roomCreated", (id: string) => {
      setRoomID(id);
      setIsHost(true);
    });

    socket.on("roomJoined", (id: string) => {
      setRoomID(id);
      setIsRoomFull(false);
    });

    socket.on("startBattle", () => {
      router.push("/battle/start?name=Host&opponent=Player");
    });

    socket.on("error", (message: string) => {
      setErrorMessage(message);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("startBattle");
      socket.off("error");
    };
  }, [router]);

  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWalletAddress(accounts[0]);
  };

  const _handleCreateRoom = () => {
    const roomID = Math.random().toString(36).substring(2, 9);
    socket.emit("createRoom", roomID);
    setIsRoomFull(true);
  };

  const _handleJoinRoom = () => {
    if (roomID) {
      socket.emit("joinRoom", roomID);
      setIsRoomFull(true);
    } else {
      setErrorMessage("Please enter a valid Room ID");
    }
  };

  const handleSubmit = () => {
    try {
      const isCorrect = eval(code + "; add(2, 3) === 5");
      if (isCorrect) {
        alert("Correct answer submitted!");
        setShowConfetti(true);
        setResult("You won!");
      } else {
        alert("Incorrect solution. Please try again.");
      }
    } catch (error) {
      console.error("Error compiling code:", error);
      alert("There is an error in your code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-4">
      {showConfetti && <Confetti width={width} height={height} />}

      <motion.h1
        className="text-5xl font-extrabold mb-8 font-nagato"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Custom 1v1 Battle
      </motion.h1>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      {!selectedMatchType ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {matchTypes.map(({ type, image, description }) => (
            <div
              key={type}
              className="border-2 rounded-lg p-6 cursor-pointer shadow-lg hover:shadow-xl transition transform hover:scale-105 border-gray-300"
              onClick={() => setSelectedMatchType(type)}
            >
              <Image src={image} alt={type} height={200} width={200} className="h-32 w-full object-cover mb-4 rounded-lg shadow-md" />
              <h3 className="text-xl font-semibold text-center">{type}</h3>
              <p className="text-sm text-center text-gray-500 mt-2">{description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center w-full max-w-4xl">
          <h2 className="text-3xl mb-6 font-bold">Practice Mode</h2>
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
            <div className="mb-4 flex justify-between items-start">
              <p className="text-left font-bold text-white">Problem: Write a function `add(a, b)` that returns the sum of two numbers.</p>
              <Button className="ml-4 px-8 py-2" variant="primary" onClick={handleSubmit}>
                Submit Solution
              </Button>
            </div>
            <MonacoEditor
              height="400px"
              language="javascript"
              value={code}
              options={{ theme: "vs-dark", minimap: { enabled: false }, fontSize: 16 }}
              onChange={(value) => setCode(value || "")}
            />
          </div>

          {timeLeft > 0 && (
            <p className="mt-4 text-red-500 text-lg font-semibold">Time Left: {timeLeft} seconds</p>
          )}

          {result && <p className="mt-6 text-2xl font-bold text-green-500">{result}</p>}
        </div>
      )}

      <Button onClick={connectWallet} className="mt-6 bg-blue-500 px-6 py-3 text-white font-bold rounded-lg shadow-lg">
        Connect Wallet
      </Button>
    </div>
  );
};

export default CustomBattlePage;
