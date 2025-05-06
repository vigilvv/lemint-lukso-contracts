const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasicNFTCollection", function () {
  let BasicNFTCollection;
  let basicNFTCollection;
  let owner;
  let addr1;
  let addr2;

  const collectionName = "MyNFTCollection";
  const collectionSymbol = "MYNFT";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    BasicNFTCollection = await ethers.getContractFactory("BasicNFTCollection");
    basicNFTCollection = await BasicNFTCollection.deploy(
      collectionName,
      collectionSymbol,
      owner.address
    );

    await basicNFTCollection.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct collection name", async function () {
      expect(await basicNFTCollection.name()).to.equal(collectionName);
    });

    it("Should set the correct collection symbol", async function () {
      expect(await basicNFTCollection.symbol()).to.equal(collectionSymbol);
    });

    it("Should set the correct owner", async function () {
      expect(await basicNFTCollection.owner()).to.equal(owner.address);
    });

    it("Should have the correct token type (Collection)", async function () {
      const lsp4TokenType = await basicNFTCollection.getData(
        "0xeafec4d89fa9619884b6b89135626455000000000000000000000000cafecafe"
      );
      expect(lsp4TokenType).to.equal("0xcafecafe");
    });

    it("Should have the correct tokenId format (Number)", async function () {
      const lsp8TokenIdFormat = await basicNFTCollection.getData(
        "0x715f248956de7ce65e94d9d836bfead479f7e70d69b718d47bfe7b00e05b4fe4"
      );
      expect(lsp8TokenIdFormat).to.equal(
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      );
    });
  });

  describe("Minting", function () {
    const tokenId = ethers.utils.hexZeroPad("0x1", 32);
    const tokenId2 = ethers.utils.hexZeroPad("0x2", 32);

    it("Should allow owner to mint a token", async function () {
      await expect(
        basicNFTCollection
          .connect(owner)
          .mint(addr1.address, tokenId, true, "0x")
      )
        .to.emit(basicNFTCollection, "Transfer")
        .withArgs(owner.address, addr1.address, tokenId, true, "0x");

      expect(await basicNFTCollection.balanceOf(addr1.address)).to.equal(1);
      expect(await basicNFTCollection.tokenOwnerOf(tokenId)).to.equal(
        addr1.address
      );
    });

    it("Should not allow non-owner to mint a token", async function () {
      await expect(
        basicNFTCollection
          .connect(addr1)
          .mint(addr1.address, tokenId, true, "0x")
      ).to.be.revertedWithCustomError(
        basicNFTCollection,
        "OwnableCallerNotTheOwner"
      );
    });

    it("Should not allow minting the same tokenId twice", async function () {
      await basicNFTCollection
        .connect(owner)
        .mint(addr1.address, tokenId, true, "0x");

      await expect(
        basicNFTCollection
          .connect(owner)
          .mint(addr2.address, tokenId, true, "0x")
      ).to.be.revertedWithCustomError(
        basicNFTCollection,
        "LSP8TokenIdAlreadyMinted"
      );
    });

    it("Should allow minting multiple tokens to different addresses", async function () {
      await basicNFTCollection
        .connect(owner)
        .mint(addr1.address, tokenId, true, "0x");
      await basicNFTCollection
        .connect(owner)
        .mint(addr2.address, tokenId2, true, "0x");

      expect(await basicNFTCollection.balanceOf(addr1.address)).to.equal(1);
      expect(await basicNFTCollection.balanceOf(addr2.address)).to.equal(1);
      expect(await basicNFTCollection.tokenOwnerOf(tokenId)).to.equal(
        addr1.address
      );
      expect(await basicNFTCollection.tokenOwnerOf(tokenId2)).to.equal(
        addr2.address
      );
    });
  });

  describe("Transfers", function () {
    const tokenId = ethers.utils.hexZeroPad("0x1", 32);

    beforeEach(async function () {
      await basicNFTCollection
        .connect(owner)
        .mint(addr1.address, tokenId, true, "0x");
    });

    it("Should allow token owner to transfer their token", async function () {
      await basicNFTCollection
        .connect(addr1)
        .transfer(addr1.address, addr2.address, tokenId, true, "0x");

      expect(await basicNFTCollection.tokenOwnerOf(tokenId)).to.equal(
        addr2.address
      );
      expect(await basicNFTCollection.balanceOf(addr1.address)).to.equal(0);
      expect(await basicNFTCollection.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should not allow non-owner to transfer a token", async function () {
      await expect(
        basicNFTCollection
          .connect(addr2)
          .transfer(addr1.address, addr2.address, tokenId, true, "0x")
      ).to.be.revertedWithCustomError(basicNFTCollection, "LSP8NotTokenOwner");
    });
  });

  describe("Metadata", function () {
    it("Should support LSP8 interface", async function () {
      const lsp8InterfaceId = "0x49399145";
      expect(await basicNFTCollection.supportsInterface(lsp8InterfaceId)).to.be
        .true;
    });

    it("Should support LSP4 interface", async function () {
      const lsp4InterfaceId = "0xeafec4d4";
      expect(await basicNFTCollection.supportsInterface(lsp4InterfaceId)).to.be
        .true;
    });
  });
});
