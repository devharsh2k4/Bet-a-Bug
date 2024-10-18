"use client";

import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import MonacoEditor from "@monaco-editor/react";
import Image from "next/image";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Import useRouter

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
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
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Select Match, Step 2: Select Mode
  const [selectedMatchType, setSelectedMatchType] = useState<"1v1" | "TagTeam" | "TripleThreat" | "FatalFourWay" | "RoyalRumble" | null>(null);
  const [selectedMode, setSelectedMode] = useState<"Ranked" | "Practice" | null>(null);
  const [_loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("function add(a, b) {\n  // Your code here\n}");
  const [timeLeft, setTimeLeft] = useState<number>(0); // Timer initially 0
  const [result, setResult] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // For showing submission animation
  const [matchStarted, setMatchStarted] = useState(false); // Tracks if the match has started
  const router = useRouter(); // Initialize useRouter

  const cameraRef = useRef<HTMLVideoElement | null>(null);
  const { width, height } = useWindowSize();

  const matchTypes = [
    { type: "1v1", image: "/onevone.webp", description: "Classic 1v1 battle." },
    { type: "Tag Team", image: "/tagteam.webp", description: "Team up with a partner for a duo showdown." },
    { type: "Triple Threat", image: "/tripleThreat.webp", description: "Three players, one winner. All vs all." },
    { type: "Fatal Four Way", image: "/fatal4way.webp", description: "Four players face off in a brutal contest." },
    { type: "Royal Rumble", image: "/royalrumble.webp", description: "A battle royale-style match with multiple players." },
  ];

  useEffect(() => {
    if (selectedMode && timeLeft > 0 && matchStarted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedMode === "Ranked" && matchStarted) {
      handleSubmit();
    }
  }, [timeLeft, selectedMode, matchStarted]);

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
      setIsSubmitting(true); // Start submission animation
      const tx = await contract.joinGame({ value: ethers.utils.parseEther("0.0001") });
      await tx.wait();
      alert("Successfully joined the game!");
      setMatchStarted(true); // Start the match here
      setTimeLeft(300); // Start timer only after match starts
      startCamera(); // Start camera when the match starts
    } catch (error) {
      console.error("Error joining game:", error);
    } finally {
      setLoading(false);
      setIsSubmitting(false); // Stop submission animation
    }
  };

  const startPractice = () => {
    setSelectedMode("Practice");
    setMatchStarted(true);
    setTimeLeft(300); // For practice mode, start timer immediately
    startCamera(); // Start camera for practice mode
  };

  const startRanked = async () => {
    setSelectedMode("Ranked");
    await joinGame(); // Start ranked match after ETH submission
  };

  const handleSubmit = () => {
    try {
      const isCorrect = eval(question + "; add(2, 3) === 5");
      if (isCorrect) {
        alert("Correct answer submitted!");
        setShowConfetti(true);
        setResult("You won!");

        if (selectedMode === "Ranked") {
          submitSolution(true);
        }

        // After submitting the correct solution, navigate to the battle page
        setTimeout(() => {
          router.push("/battle");
        }, 2000); // Redirect after 2 seconds to show confetti
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    return () => stopCamera(); // Stop the camera when the component unmounts
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-black p-6">
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Step 1: Select Match Type */}
      {step === 1 && !selectedMatchType && (
        <>
          <h2 className="text-4xl mb-6 font-bold">Select Match Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {matchTypes.map(({ type, image, description }) => (
              <div
                key={type}
                className="border-2 rounded-lg p-6 cursor-pointer shadow-lg hover:shadow-xl transition transform hover:scale-105 border-gray-300"
                onClick={() => {
                  setSelectedMatchType(type as "1v1" | "TagTeam" | "TripleThreat" | "FatalFourWay" | "RoyalRumble");
                  setStep(2); // Move to step 2 after selecting match type
                }}
              >
                <Image
                  src={image}
                  alt={type}
                  height={200}
                  width={200}
                  className="h-32 w-full object-cover mb-4 rounded-lg shadow-md"
                />
                <h3 className="text-xl font-semibold text-center">{type}</h3>
                <p className="text-sm text-center text-gray-500 mt-2">{description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2: Select Mode (Ranked or Practice) */}
      {step === 2 && selectedMatchType && !selectedMode && (
        <>
          <h2 className="text-4xl mb-6 font-bold">Selected Match: {selectedMatchType}</h2>
          <div className="flex space-x-4">
            <Button onClick={startRanked} className="px-8 py-4 bg-blue-500 text-white font-bold rounded-lg shadow-lg">
              Start Ranked
            </Button>
            <Button onClick={startPractice} className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg">
              Start Practice
            </Button>
          </div>
        </>
      )}

      {/* Game Interface: Code Editor */}
      {selectedMode && (
        <div className="text-center w-full max-w-4xl mt-6">
          <h2 className="text-3xl mb-6 font-bold">{selectedMode === "Ranked" ? "Ranked Battle" : "Practice Mode"}</h2>
          <div className="bg-gray-700 p-6 mt-16 rounded-lg shadow-lg relative">
            <div className="mb-4  flex justify-between items-start">
              <div>
                <p className="text-left font-bold text-white">Problem:</p>
                <p className="text-white">{question}</p>
              </div>
              <Button className="ml-4 px-8 py-2" variant="primary" onClick={handleSubmit}>
                Submit Solution
              </Button>
            </div>

            {isSubmitting && (
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                <p className="text-white font-bold mt-4">Submitting Amount...</p>
              </div>
            )}

            <MonacoEditor
              height="300px"
              language="javascript"
              value={question}
              options={{ theme: "vs-dark", minimap: { enabled: false }, fontSize: 16 }}
              onChange={(value) => setQuestion(value || "")}
            />
          </div>

          {timeLeft > 0 && selectedMode === "Ranked" && matchStarted && (
            <p className="mt-4 text-red-500 text-lg font-semibold">Time Left: {timeLeft} seconds</p>
          )}

          {result && <p className="mt-6 text-2xl font-bold text-green-500">{result}</p>}
        </div>
      )}

      {/* Camera feed - Moved to top right and always visible when match starts */}
      {matchStarted && (
        <div className="fixed top-1 right-4 w-52 h-32 border border-white z-50">
          <video ref={cameraRef} autoPlay playsInline className="w-full h-full object-cover"></video>
        </div>
      )}
    </div>
  );
}
