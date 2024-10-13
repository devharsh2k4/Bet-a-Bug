"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MonacoEditor from "@monaco-editor/react";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Button } from "@/components/ui/button";


declare global {
  interface Window {
    ethereum: any;
  }
}


const CONTRACT_ADDRESS = "0x5658f10fE45b021D578a1cbDaD4eD11e8868D0Cb";
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

export default function CodingBattle() {
  const [selectedMode, setSelectedMode] = useState<"Ranked" | "Practice" | null>(null);
  const [selectedMatchType, setSelectedMatchType] = useState<
    "1v1" | "TagTeam" | "TripleThreat" | "FatalFourWay" | "RoyalRumble" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [code, setCode] = useState<string>(""); 
  const [timeLeft, setTimeLeft] = useState<number>(300); 
  const [result, setResult] = useState<string | null>(null); 
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const matchTypes = [
    { type: "1v1", image: "/onevone.webp", description: "Classic 1v1 battle." },
    {
      type: "Tag Team",
      image: "/tagteam.webp",
      description: "Team up with a partner for a duo showdown.",
    },
    {
      type: "Triple Threat",
      image: "/tripleThreat.webp",
      description: "Three players, one winner. All vs all.",
    },
    {
      type: "Fatal Four Way",
      image: "/fatal4way.webp",
      description: "Four players face off in a brutal contest.",
    },
    {
      type: "Royal Rumble",
      image: "/royalrumble.webp",
      description: "A battle royale-style match with multiple players.",
    },
  ];

  useEffect(() => {
    if (selectedMode) {
      generateQuestion(); 
    }
  }, [selectedMode]);

  useEffect(() => {
    if (selectedMode === "Ranked" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmit(); 
    }
  }, [timeLeft]);

  // Connect wallet using MetaMask
  const connectWallet = async (): Promise<void> => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setWalletAddress(accounts[0]);
  };

 
  const joinGame = async () => {
    if (!walletAddress) await connectWallet();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      setLoading(true);
      const tx = await contract.joinGame({
        value: ethers.utils.parseEther("0.0001"),
      });
      await tx.wait();
      alert("Successfully joined the game!");
    } catch (error) {
      console.error("Error joining game:", error);
    } finally {
      setLoading(false);
    }
  };


  const startPractice = () => {
    setSelectedMode("Practice");
  };

 
  const generateQuestion = () => {
    setQuestion("Write a function `add(a, b)` that returns the sum of two numbers.");
    setCode(`function add(a, b) {\n  // Your code here\n}`);
  };

 
  const handleSubmit = () => {
 
    try {
      const isCorrect = eval(code + "; add(2, 3) === 5");
      if (isCorrect) {
        alert("Correct answer submitted!");
        setShowConfetti(true);
        setResult("You won!");
        if (selectedMode === "Ranked") {
       
          submitSolution(true);
        }
      } else {
        alert("Incorrect solution. Please try again.");
        if (selectedMode === "Ranked") {
          submitSolution(false);
        }
      }
    } catch (error) {
      console.error("Error compiling code:", error);
      alert("There is an error in your code.");
    }
  };


  const submitSolution = async (isCorrect: boolean) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      const tx = await contract.submitSolution(isCorrect);
      await tx.wait();
    } catch (error) {
      console.error("Error submitting solution:", error);
    }
  };


  const { width, height } = useWindowSize();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-black p-6">
      {showConfetti && <Confetti width={width} height={height} />}
      {!selectedMatchType ? (
        <>
         
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {matchTypes.map(({ type, image, description }) => (
              <div
                key={type}
                className={`border-2 rounded-lg p-6 cursor-pointer shadow-lg hover:shadow-xl transition transform hover:scale-105 ${
                  selectedMatchType === type ? "border-green-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedMatchType(type as any)}
              >
                <img src={image} alt={type} className="h-24 w-full object-cover mb-4 rounded" />
                <h3 className="text-xl font-semibold text-center">{type}</h3>
                <p className="text-sm text-center text-gray-500 mt-2">{description}</p>
              </div>
            ))}
          </div>
        </>
      ) : !selectedMode ? (
        <>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center items-center">
            <div
              onClick={() => setSelectedMode("Ranked")}
              className="cursor-pointer bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition border-2 border-blue-500 flex flex-col items-center"
            >
              <h3 className="text-2xl font-bold text-center text-blue-500">Ranked</h3>
              <Image src={require("/public/battle.svg")} alt="Ranked" width={100} height={100} />
              <p className="text-gray-500 text-center mt-2">Compete and win ETH in ranked mode.</p>
            </div>

            <div
              onClick={startPractice}
              className="cursor-pointer bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition border-2 border-green-500 flex flex-col items-center"
            >
              <h3 className="text-2xl font-bold text-center text-green-500">Practice</h3>
              <Image src={require("/public/battle.svg")} alt="Practice" width={100} height={100} />
              <p className="text-gray-500 text-center mt-2">Try challenges for free in practice mode.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center w-full max-w-4xl">
          <h2 className="text-3xl mb-6 font-bold">
            {selectedMode === "Ranked" ? "Ranked Battle" : "Practice Mode"}
          </h2>
          <div className="bg-zinc-600 p-6 rounded-lg shadow-lg">
           
            <div className="mb-4 flex justify-between items-start">
              <div>
                <p className="text-left font-bold text-white">Problem:</p>
                <p className="text-white">{question}</p>
              </div>
              <Button
                className="ml-4 px-8 py-2"
                variant="primary"
                onClick={handleSubmit}
              >
                Submit Solution
              </Button>
            </div>

            <MonacoEditor
              height="400px" 
              language="javascript"
              value={code}
              options={{
                theme: "gray-dark",
                minimap: { enabled: false },
                fontSize: 16,
              }}
              onChange={(value) => setCode(value || "")}
            />
          </div>

          {timeLeft > 0 && selectedMode === "Ranked" && (
            <p className="mt-4 text-red-500 text-lg font-semibold">Time Left: {timeLeft} seconds</p>
          )}

          {result && <p className="mt-6 text-2xl font-bold text-green-500">{result}</p>}
        </div>
      )}
    </div>
  );
}
