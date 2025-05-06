import { ethers } from "ethers";

// Import LSP4 Token ABI. LSP4 is inherited by both LSP7 and LSP8.
// LSP4 represents the metadata storage of the token contract and contains the functions to get and set data.
// Since we are only using the `getData(...)` function, we only need the LSP4 ABI.
import LSP4Artifact from "../artifacts/@lukso/lsp4-contracts/contracts/LSP4DigitalAssetMetadata.sol/LSP4DigitalAssetMetadata.json";
import { ERC725YDataKeys } from "@lukso/lsp-smart-contracts";

// Connect provider to LUKSO Testnet
const provider = new ethers.JsonRpcProvider("https://4201.rpc.thirdweb.com");

// Create contract instance
const myAssetContract = new ethers.Contract(
  "0x3205987CC2B5DC2A8ecA1662EdB8623C834238A3", // Provider your contract
  LSP4Artifact.abi,
  provider
);

async function retrieveTokenType() {
  // Retrieve the token type (this will be abi-encoded)
  const tokenTypeEncoded = await myAssetContract.getData(
    ERC725YDataKeys.LSP4.LSP4TokenType
  );

  // Decode from abi-encoded uint256 to a number
  // e.g: 0x0000...0002 -> 2
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  const tokenType = abiCoder.decode(["uint256"], tokenTypeEncoded);
  console.log(Number(tokenType));
  // 0 = Token
  // 1 = NFT
  // 2 = Collection
}

retrieveTokenType();
