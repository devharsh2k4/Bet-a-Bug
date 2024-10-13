// Github: https://github.com/alchemyplatform/alchemy-sdk-js
import { Network, Alchemy } from "alchemy-sdk";

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS;
const settings = {
  apiKey: apiKey,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

async function fetchNFTs() {
  // Print owner's wallet address:
  const ownerAddr = ownerAddress;
  console.log("fetching NFTs for address:", ownerAddr);
  console.log("...");

  // Print total NFT count returned in the response:
  const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
  console.log("number of NFTs found:", nftsForOwner.totalCount);
  console.log("...");

  // Print contract address and tokenId for each NFT:
  for (const nft of nftsForOwner.ownedNfts) {
    console.log("===");
    console.log("contract address:", nft.contract.address);
    console.log("token ID:", nft.tokenId);
  }
  console.log("===");

  // Fetch metadata for a particular NFT:
  console.log("fetching metadata for a Crypto Coven NFT...");
  const response = await alchemy.nft.getNftMetadata(
    "0x5180db8F5c931aaE63c74266b211F580155ecac8",
    "1590"
  );

  // Uncomment this line to see the full api response:
  // console.log(response);

  // Print some commonly used fields:
  console.log("NFT name: ", response.title);
  console.log("token type: ", response.tokenType);
  console.log("tokenUri: ", response.tokenUri.gateway);
  console.log("image url: ", response.rawMetadata.image);
  console.log("time last updated: ", response.timeLastUpdated);
  console.log("===");
}

fetchNFTs();