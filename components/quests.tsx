"use client"

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Alchemy, Network } from 'alchemy-sdk';
import QuestNFT from '@/QuestNFT.json'; // Path to your ABI file
import { quests, POINTS_TO_REFILL } from '@/constants';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const CONTRACT_ADDRESS = "0x3DfFcf8AFC8298f4a31eC518D28fA7BB7AF4Cf2C";
const alchemy = new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA
});

interface QuestsProps {
    points: number;
}

export const Quests = ({ points }: QuestsProps) => {
    const [currentAccount, setCurrentAccount] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [completedQuests, setCompletedQuests] = useState<number>(0);

    // Connect user's wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } else {
            console.error("Metamask not found");
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
            const tx = await contract.mintNFT(currentAccount, rarity);
            setTxHash(tx.hash);
            await tx.wait();
            console.log(`NFT Minted! Transaction hash: ${tx.hash}`);
        } catch (error) {
            console.error("Error minting NFT:", error);
        }
    };

    // Determine rarity and mint the appropriate NFT
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

    // Render quests progress and buttons for completing quests
    return (
        <div className="border-2 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between w-full space-y-2">
                <h3 className="font-bold text-lg">Quests</h3>
                <Button onClick={connectWallet}>
                    {currentAccount ? "Wallet Connected" : "Connect Wallet"}
                </Button>
            </div>

            <ul className="w-full">
                {quests.map((quest, index) => {
                    const progress = (points / quest.points) * 100;
                    return (
                        <div key={index} className="flex items-center w-full p-4 gap-x-4 border-t-2">
                            <Image src="/points.svg" alt="points" width={60} height={60} />
                            <div className="flex flex-col gap-y-2 w-full">
                                <p className="text-neutral-700 text-xl font-bold">{quest.title}</p>
                                <Progress value={progress} className="h-3" />
                                <Button onClick={() => handleQuestCompletion(index + 1)}>
                                    Complete Quest
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
        </div>
    );
};


