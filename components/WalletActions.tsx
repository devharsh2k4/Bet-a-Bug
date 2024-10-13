"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import QuestNFT from '@/QuestNFT.json'; // Ensure correct path to ABI file

const CONTRACT_ADDRESS = "0x3DfFcf8AFC8298f4a31eC518D28fA7BB7AF4Cf2C";

interface WalletActionsProps {
  quests: Array<{ title: string; points: number }>;
  userProgress: { points: number };
}

const WalletActions = ({ quests, userProgress }: WalletActionsProps) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [completedQuests, setCompletedQuests] = useState<number>(0);
  const [nftMetadata, setNftMetadata] = useState<any>(null); // To store and display minted NFT metadata

  useEffect(() => {
    // Check if wallet is already connected
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Connect user's wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } else {
      console.error("MetaMask not found");
    }
  };

  // Mint NFT based on quest completion
  const mintNFT = async (rarity: number) => {
    if (!currentAccount) {
      console.error("Wallet not connected");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, QuestNFT.abi, signer);

    try {
      // Call the mint function on the contract
      const tx = await contract.mintQuestNFT(currentAccount, rarity);
      setTxHash(tx.hash); // Store the transaction hash for the user to see
      await tx.wait();

      // Fetch the last minted token ID
      const balance = await contract.balanceOf(currentAccount);
      const newTokenId = await contract.tokenOfOwnerByIndex(currentAccount, balance - 1);

      // Get the tokenURI and fetch metadata
      const tokenURI = await contract.tokenURI(newTokenId);
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      setNftMetadata(metadata); // Store the NFT metadata to display

      console.log(`NFT Minted! Token ID: ${newTokenId}, Metadata:`, metadata);
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  // Handle quest completion and mint appropriate NFT
  const handleQuestCompletion = (completed: number) => {
    setCompletedQuests(completed);
    if (completed === 1) {
      mintNFT(0); // Common NFT
    } else if (completed === 2) {
      mintNFT(1); // Rare NFT
    } else if (completed === 3) {
      mintNFT(2); // Legendary NFT
    }
  };

  return (
    <div>
      <Button onClick={connectWallet}>
        {currentAccount ? "Wallet Connected" : "Connect Wallet"}
      </Button>

      <ul className="w-full mt-4">
        {quests.map((quest, index) => {
          const progress = (userProgress.points / quest.points) * 100;

          return (
            <div
              className="flex items-center w-full p-4 gap-x-4 border-t-2"
              key={quest.title}
            >
              <Image src="/points.svg" alt="points" width={60} height={60} />
              <div className="flex flex-col gap-y-2 w-full">
                <p className="text-neutral-700 text-xl font-bold">
                  {quest.title}
                </p>
                <Progress value={progress} className="h-3" />
                <Button onClick={() => handleQuestCompletion(index + 1)}>
                  Complete Quest {index + 1}
                </Button>
              </div>
            </div>
          );
        })}
      </ul>

      {txHash && (
        <p>
          Transaction Hash:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {txHash}
          </a>
        </p>
      )}

      {nftMetadata && (
        <div className="nft-card mt-6">
          <h2 className="text-xl font-bold">Your Minted NFT</h2>
          <Image src={nftMetadata.image} alt={nftMetadata.name} width={300} height={300} />
          <h3>{nftMetadata.name}</h3>
          <p>{nftMetadata.description}</p>
        </div>
      )}
    </div>
  );
};

export default WalletActions;
