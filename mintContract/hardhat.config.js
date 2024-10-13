require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const API_URL = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [`0x` + PRIVATE_KEY],
    }
  }
};
