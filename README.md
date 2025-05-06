### Smart Contracts for LeMint

- Contract directory: `contracts`
- LeMint NFT contract: `contracts/LeMintNFTCollection.sol`
- Artifacts directory: `artifacts`
- Sample deploy script: `scripts/deploy.ts` - for testing
  - `npx hardhat run --network luksoTestnet scripts/deploy.ts`

### Installation

- `npm install --save-dev hardhat`
- `npx hardhat`
- `npm i @lukso/lsp-smart-contracts`
- `npx hardhat compile`

### Helpers (Act as Tests to verify the created contract)

- Check the token type of the deployed contract: `helpers/retrieveTokenType.ts`
  - Command: `npm run retrieve-token-type`
- Check the metadata of the NFT: `helpers/getNFTMetadata.ts`
  - Command `npm run get-nft-metadata`



### Other info

- Backend repo: [https://github.com/vigilvv/lemint-backend](https://github.com/vigilvv/lemint-backend)
  - Please check backend repo for sequence diagram and more details
- Frontend repo: https://github.com/vigilvv/lemint-frontend-new
