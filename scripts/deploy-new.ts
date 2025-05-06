import { ethers } from "hardhat";
import BasicNFTCollectionArtifacts from "../artifacts/contracts/LeMintNFTCollection.sol/BasicNFTCollection.json";
import dotenv from "dotenv";
import { JsonRpcProvider } from "ethers";

// Load environment variables
dotenv.config();

// Check if private key is set
if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY not set in .env file");
}

// // Create provider and wallet
// const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
// const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// const contractFactory = new ethers.ContractFactory(
//   BasicNFTCollectionArtifacts.abi,
//   BasicNFTCollectionArtifacts.bytecode,
//   deployer
// );

async function deploy() {
  // Manually create LUKSO provider
  const luksoRpcUrl = "https://rpc.testnet.lukso.network";
  const provider = new JsonRpcProvider(luksoRpcUrl, 4201);

  // Verify connection
  const block = await provider.getBlockNumber();
  console.log("Connected to LUKSO. Current block:", block);

  //   console.log("Network:", (await ethers.provider.getNetwork()).name);

  // Create wallet from private key
  const deployer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  console.log("Deploying with account:", deployer.address);

  // Get contract factory with explicit provider
  const Contract = await ethers.getContractFactory(
    "BasicNFTCollection",
    deployer
  );

  //   const nftCollection = await contractFactory.deploy(
  //     "Sample NFT", // collection name
  //     "SNFT", // collection symbol
  //     deployer.address
  //   );

  // Deploy
  const contract = await Contract.deploy(
    "Sample NFT",
    "SNFT",
    deployer.address
  );

  await contract.waitForDeployment();
  const nftCollectionAddress = await contract.getAddress();

  console.log("NFT Collection deployed to:", nftCollectionAddress);
  console.log("Check the block explorer to see the deployed contract");
}

deploy().catch(console.error);
