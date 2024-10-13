// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./CustomERC721.sol";

contract QuestNFT is CustomERC721 {
    // Define rarities
    enum Rarity { Common, Rare, Legendary }
    
    // Track minted counts for each rarity
    mapping(Rarity => uint256) public mintedCount;

    // Maximum NFT limits for each rarity
    uint256 public constant MAX_COMMON = 50;
    uint256 public constant MAX_RARE = 10;
    uint256 public constant MAX_LEGENDARY = 1;

    // Token ID start points
    uint256 public constant COMMON_START_ID = 1;
    uint256 public constant RARE_START_ID = 51;
    uint256 public constant LEGENDARY_START_ID = 61;

    constructor() CustomERC721("QuestNFT", "QNFT") {}

    // Function to mint based on rarity
    function mintQuestNFT(address recipient, Rarity rarity) public {
        require(
            rarity == Rarity.Common || rarity == Rarity.Rare || rarity == Rarity.Legendary,
            "Invalid rarity"
        );

        uint256 tokenId;
        if (rarity == Rarity.Common) {
            require(mintedCount[Rarity.Common] < MAX_COMMON, "Max common NFTs minted");
            tokenId = COMMON_START_ID + mintedCount[Rarity.Common];
            mintedCount[Rarity.Common]++;
        } else if (rarity == Rarity.Rare) {
            require(mintedCount[Rarity.Rare] < MAX_RARE, "Max rare NFTs minted");
            tokenId = RARE_START_ID + mintedCount[Rarity.Rare];
            mintedCount[Rarity.Rare]++;
        } else if (rarity == Rarity.Legendary) {
            require(mintedCount[Rarity.Legendary] < MAX_LEGENDARY, "Max legendary NFTs minted");
            tokenId = LEGENDARY_START_ID + mintedCount[Rarity.Legendary];
        }

        mint(recipient, tokenId);
    }
}
