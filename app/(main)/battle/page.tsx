"use client";

import { useState } from "react";

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}
import { ethers } from "ethers";

// Replace with your deployed smart contract address
const CONTRACT_ADDRESS = "0x2B6Ffc759e1c90b2D15E42B2439e155184c99BB8";
const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "joinGame",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "isCorrect",
        type: "bool",
      },
    ],
    name: "submitSolution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default function Battle() {
  const [selectedMode, setSelectedMode] = useState<"Ranked" | "Practice" | null>(null); // Selected game mode
  const [selectedMatchType, setSelectedMatchType] = useState<"Solo" | "Duo" | "Trio" | "Squad">("Solo");

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0];
    } else {
      alert("Please install MetaMask!");
    }
  };

  const joinGame = async () => {
    const account = await connectWallet();
    if (!account) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      const tx = await contract.joinGame({
        value: ethers.utils.parseEther("0.001"),
      });
      await tx.wait(); // Wait for transaction to be confirmed
    } catch (error) {
      console.error("Payment failed: ", error);
    }
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col items-center justify-center">
      {/* Match Type Selection (Solo, Duo, etc.) */}
      <div className="mb-8">
        <div className="flex space-x-4 text-lg font-semibold">
          {["Solo", "Duo", "Trio", "Squad"].map((matchType) => (
            <button
              key={matchType}
              onClick={() => setSelectedMatchType(matchType as "Solo" | "Duo" | "Trio" | "Squad")}
              className={`px-4 py-2 rounded-lg border-2 transition ${
                selectedMatchType === matchType ? "border-green-500" : "border-gray-500"
              }`}
            >
              {matchType}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selection Cards */}
      {!selectedMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Ranked Mode Card */}
          <div
            onClick={() => setSelectedMode("Ranked")}
            className="cursor-pointer bg-gray-800 p-8 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <img
                src="/battle.svg"
                alt="Ranked Mode"
                className="w-32 mb-4"
              />
              <h3 className="text-2xl font-bold text-green-400">Ranked</h3>
              <p className="text-gray-400 text-center mt-2">
                Earn experience points and compete in ranked matches.
              </p>
            </div>
          </div>

          {/* Practice Mode Card */}
          <div
            onClick={() => setSelectedMode("Practice")}
            className="cursor-pointer bg-gray-800 p-8 rounded-lg shadow-lg transition transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <img
                src="/battle.svg"
                alt="Practice Mode"
                className="w-32 mb-4"
              />
              <h3 className="text-2xl font-bold text-blue-400">Practice</h3>
              <p className="text-gray-400 text-center mt-2">
                Compete without affecting your ranking or experience.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl mb-6">{selectedMode} Mode</h2>
          <button
            onClick={joinGame}
            className="bg-blue-500 px-6 py-3 rounded-lg text-white hover:bg-blue-600 transition"
          >
            {selectedMode === "Ranked" ? "Join Ranked Game" : "Start Practice"}
          </button>
        </div>
      )}
    </div>
  );
}
