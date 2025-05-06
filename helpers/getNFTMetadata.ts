// Add the necessary imports to your JS file
import { ethers } from "ethers";
import lsp8Artifact from "../artifacts/@lukso/lsp8-contracts/contracts/LSP8IdentifiableDigitalAsset.sol/LSP8IdentifiableDigitalAsset.json";
import { ERC725YDataKeys } from "@lukso/lsp-smart-contracts";
import { ERC725 } from "@erc725/erc725.js";
import lsp4Schema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";

const provider = new ethers.JsonRpcProvider("https://4201.rpc.thirdweb.com");

// Create contract instance
const myAssetContract = new ethers.Contract(
  "0x3205987CC2B5DC2A8ecA1662EdB8623C834238A3",
  lsp8Artifact.abi,
  provider
);

async function getNFTMetadata() {
  // Get the global token ID format
  let tokenIdFormat = parseInt(
    await myAssetContract.getData(ERC725YDataKeys.LSP8["LSP8TokenIdFormat"]),
    16
  );

  console.log(tokenIdFormat); // 0 - uint256

  //=============== Retrieve metadata from the contract ==============================
  const tokenID = 42;
  // Sample token ID (1) parsed according to LSP8TokenIDFormat
  const byte32TokenId =
    "0x000000000000000000000000000000000000000000000000000000000000002a"; // Number 42 in hex bytes32

  // Get the encoded asset metadata
  const tokenIdMetadata = await myAssetContract.getDataForTokenId(
    byte32TokenId,
    ERC725YDataKeys.LSP4["LSP4Metadata"]
  );

  const erc725js = new ERC725(lsp4Schema);

  // Decode the metadata
  const decodedMetadata = erc725js.decodeData([
    {
      keyName: "LSP4Metadata",
      value: tokenIdMetadata,
    },
  ]);
  console.log(decodedMetadata);
}

getNFTMetadata();
