import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

// Check if private key is set
if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY not set in .env file");
}

// const config: HardhatUserConfig = {
//   solidity: "0.8.28",
//   networks: {
//     luksoTestnet: {
//       url: "https://rpc.testnet.lukso.network", // LUKSO Testnet RPC URL
//       // url: "https://4201.rpc.thirdweb.com", // LUKSO Testnet RPC URL
//       chainId: 4201, // LUKSO Testnet chain ID
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [], // Deployer private key
//     },
//   },
// };

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "luksoTestnet",
  networks: {
    luksoTestnet: {
      url: "https://rpc.testnet.lukso.network", // LUKSO RPC
      chainId: 4201,
      accounts: [process.env.PRIVATE_KEY!], // Ensure key is set
    },
  },
};

export default config;
