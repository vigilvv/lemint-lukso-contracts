import { ethers } from "hardhat";
import BasicNFTCollectionArtifacts from "../artifacts/contracts/LeMintNFTCollection.sol/BasicNFTCollection.json";
import { ERC725YDataKeys } from "@lukso/lsp-smart-contracts";

async function deploy() {
  const accounts = await ethers.getSigners();
  const deployer = accounts[0];

  const contractFactory = new ethers.ContractFactory(
    BasicNFTCollectionArtifacts.abi,
    BasicNFTCollectionArtifacts.bytecode,
    deployer
  );

  const nftCollection = await contractFactory.deploy(
    "NFT Collection Name", // collection name
    "NFT", // collection symbol
    deployer.address
  );
  const nftCollectionAddress = await nftCollection.getAddress();
  console.log("NFT Collection deployed to:", nftCollectionAddress);
  console.log("Check the block explorer to see the deployed contract");

  //===============

  // Deploy contract
  await nftCollection.waitForDeployment();

  const contract1 = new ethers.Contract(
    nftCollectionAddress,
    BasicNFTCollectionArtifacts.abi,
    deployer
  );

  console.log("Contract deployed at:", nftCollectionAddress);

  // Mint NFT to user's UP address
  const tokenId = ethers.toBeHex(1, 32); // bytes32 representation

  await contract1.mint(await deployer.getAddress(), tokenId, true, "0x");

  console.log("NFT minted");

  // Set metadata
  const metadata = {
    name: "NFT Collection Name", // collection name
    symbol: "NFT", // collection symbol
    description: "A sample NFT collection",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUqh-qnv-yZZcCwiYN_LvsuOucnKh0PsOHrQ&s",
    links: [],
  };

  // const jsonBuffer = Buffer.from(JSON.stringify(metadata));
  // const encodedData = ethers.toUtf8Bytes(jsonBuffer.toString());
  const encodedData = ethers.toUtf8Bytes(JSON.stringify(metadata));

  await contract1.setData(ERC725YDataKeys.LSP4.LSP4Metadata, encodedData);

  console.log("Metadata set");
}

deploy();
