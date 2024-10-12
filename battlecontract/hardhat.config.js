require("@nomiclabs/hardhat-ethers");


const API_URL = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/HENejHQVvun0Fg8zW-vOU_hdNgle2BLp",
      accounts: ["0x5503263273ef8cb3e920e42d3bbefd8aa0167e9e3a56196046586197334f4b04"],
    },
  },
};
