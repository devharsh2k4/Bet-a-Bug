"use client";

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

// Replace with your deployed smart contract address
const CONTRACT_ADDRESS = '0x2B6Ffc759e1c90b2D15E42B2439e155184c99BB8';
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "joinGame",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "isCorrect",
        "type": "bool"
      }
    ],
    "name": "submitSolution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWinner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function Battle() {
  const [code, setCode] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(300); // 5 minutes timer (300 seconds)
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false); // Payment status
  const [loadingPayment, setLoadingPayment] = useState(false); // Loading state for payment
  const [selectedMatchType, setSelectedMatchType] = useState<string | null>(null); // Selected match type

  const question = "Write a function that returns the sum of two numbers"; // Example question
  const expectedOutput = 5;

  useEffect(() => {
    if (hasPaid) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [hasPaid]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setConnectedAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const joinGame = async () => {
    if (!connectedAccount) {
      await connectWallet();
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      setLoadingPayment(true); // Start loading state
      const tx = await contract.joinGame({
        value: ethers.utils.parseEther("0.001"),
      });
      await tx.wait(); // Wait for transaction to be confirmed
      setHasPaid(true); // Set payment status to true
    } catch (error) {
      console.error("Payment failed: ", error);
      setHasPaid(false);
    } finally {
      setLoadingPayment(false); // End loading state
    }
  };

  const submitSolution = async () => {
    try {
      const result = eval(code); // In real production, use WebAssembly or a secure sandbox for running user code
      setIsCorrect(result === expectedOutput);
      
      if (!connectedAccount) {
        await connectWallet();
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      await contract.submitSolution(result === expectedOutput);
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error in submitted code: " + err.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const matchTypes = [
    "One vs One",
    "Tag Team",
    "Fatal 4 Way",
    "Tournament"
  ];

  return (
    <div className="flex h-screen">
      {!selectedMatchType ? (
        // Match Selection Grid
        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-3xl font-bold mb-6">Select Match Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {matchTypes.map((matchType, index) => (
              <button
                key={index}
                onClick={() => setSelectedMatchType(matchType)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                {matchType}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Battle Layout
        <div className="flex h-full">
          {/* Left panel with code editor */}
          <div className={`w-2/3 bg-gray-100 p-5 ${!hasPaid ? 'opacity-50 pointer-events-none' : ''}`}>
            <Editor
              height="80vh"
              defaultLanguage="javascript"
              defaultValue="// write your code here"
              onChange={handleEditorChange}
              options={{
                readOnly: !hasPaid,
              }}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={submitSolution}
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${!hasPaid ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={!hasPaid}
              >
                Submit Solution
              </button>
            </div>
          </div>

          {/* Right panel with question and timer */}
          <div className="w-1/3 bg-white p-5">
            <h2 className="text-2xl font-bold mb-4">{selectedMatchType} Battle Mode</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Question:</h3>
              <p>{question}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Timer:</h3>
              <p className="text-red-500 text-xl">{timer} seconds remaining</p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Wallet:</h3>
              <p>{connectedAccount ? `Connected: ${connectedAccount}` : "Not Connected"}</p>
              <button
                onClick={connectWallet}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {connectedAccount ? "Connected" : "Connect Wallet"}
              </button>
            </div>
            <button
              onClick={joinGame}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 ${loadingPayment ? 'opacity-50 pointer-events-none' : ''}`}
              disabled={loadingPayment || hasPaid}
            >
              {loadingPayment ? 'Processing...' : 'Join Game (0.001 Sepolia ETH)'}
            </button>

            {isCorrect !== null && (
              <div className={`mt-6 text-xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isCorrect ? 'Correct Solution!' : 'Wrong Solution, Try Again!'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
