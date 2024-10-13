const hre = require("hardhat");

async function main() {
  const QuestNFT = await hre.ethers.getContractFactory("QuestNFT");
  const questNFT = await QuestNFT.deploy();

  await questNFT.deployed();
  console.log("QuestNFT deployed to:", questNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
