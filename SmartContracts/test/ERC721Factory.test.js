const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("ERC721Factory", function () {
  const NAME = "Test Collection";
  const SYMBOL = "TST";
  const BASE_URI = "ipfs://some-base-uri/";
  const MAX_SUPPLY = 100;
  const INITIAL_FEE = ethers.parseEther("0.00027");

  let factory;
  let owner, user, other;

  beforeEach(async function () {
    [owner, user, other] = await ethers.getSigners();

    const ERC721Factory = await ethers.getContractFactory("ERC721Factory");
    factory = await ERC721Factory.deploy();
    await factory.waitForDeployment();
  });

  describe("Deployment", function () {
    it("sets the correct owner", async function () {
      expect(await factory.owner()).to.equal(owner.address);
    });

    it("sets the initial fee to 0.00027 ether", async function () {
      expect(await factory.fee()).to.equal(INITIAL_FEE);
    });
  });

  describe("createCollection()", function () {
    it("creates a new NFT collection", async function () {
      const tx = await factory
        .connect(user)
        .createCollection(NAME, SYMBOL, BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE });
      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);

      const all = await factory.getAllCollections();
      expect(all.length).to.equal(1);

      const code = await ethers.provider.getCode(all[0]);
      expect(code).to.not.equal("0x");
    });

    it("emits CollectionCreated", async function () {
      await expect(
        factory
          .connect(user)
          .createCollection(NAME, SYMBOL, BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE })
      )
        .to.emit(factory, "CollectionCreated")
        .withArgs(anyValue, NAME, SYMBOL, user.address);
    });

    it("stores the collection in collections()", async function () {
      await factory
        .connect(user)
        .createCollection(NAME, SYMBOL, BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE });

      const stored = await factory.collections(0);
      const all = await factory.getAllCollections();
      expect(stored).to.equal(all[0]);
    });

    it("stores the collection in collectionsByUser()", async function () {
      await factory
        .connect(user)
        .createCollection(NAME, SYMBOL, BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE });

      const userCollections = await factory.getCollectionsByUser(user.address);
      expect(userCollections.length).to.equal(1);

      const storedByIndex = await factory.collectionsByUser(user.address, 0);
      expect(storedByIndex).to.equal(userCollections[0]);
    });

    it("deploys a collection with the correct name, symbol, creator and maxSupply", async function () {
      const tx = await factory
        .connect(user)
        .createCollection(NAME, SYMBOL, BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE });
      const receipt = await tx.wait();

      const event = receipt.logs
        .map(log => {
          try {
            return factory.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(e => e && e.name === "CollectionCreated");

      const token = await ethers.getContractAt("ERC721Token", event.args.collectionAddress);

      expect(await token.name()).to.equal(NAME);
      expect(await token.symbol()).to.equal(SYMBOL);
      expect(await token.creator()).to.equal(user.address);
      expect(await token.maxSupply()).to.equal(MAX_SUPPLY);
    });

    it("reverts if payment is insufficient", async function () {
      const tooLittle = INITIAL_FEE - 1n;
      await expect(
        factory
          .connect(user)
          .createCollection(NAME, SYMBOL, BASE_URI, MAX_SUPPLY, { value: tooLittle })
      ).to.be.revertedWithCustomError(factory, "InsufficientPayment");
    });

    it("reverts if name is empty", async function () {
      await expect(
        factory
          .connect(user)
          .createCollection("", SYMBOL, BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE })
      ).to.be.revertedWithCustomError(factory, "InvalidNameOrSymbol");
    });

    it("reverts if symbol is empty", async function () {
      await expect(
        factory
          .connect(user)
          .createCollection(NAME, "", BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE })
      ).to.be.revertedWithCustomError(factory, "InvalidNameOrSymbol");
    });

    it("reverts if baseURI is empty", async function () {
      await expect(
        factory
          .connect(user)
          .createCollection(NAME, SYMBOL, "", MAX_SUPPLY, { value: INITIAL_FEE })
      ).to.be.revertedWithCustomError(factory, "InvalidBaseURI");
    });

    it("reverts if maxSupply is 0", async function () {
      // NOTE: the current contract has no explicit check for _maxSupply == 0,
      // so this test will fail until that validation is added to createCollection().
      await expect(
        factory
          .connect(user)
          .createCollection(NAME, SYMBOL, BASE_URI, 0, { value: INITIAL_FEE })
      ).to.be.reverted;
    });
  });

  describe("setFee()", function () {
    const NEW_FEE = ethers.parseEther("0.0005");

    it("allows the owner to change the fee", async function () {
      await factory.connect(owner).setFee(NEW_FEE);
      expect(await factory.fee()).to.equal(NEW_FEE);
    });

    it("reverts if called by a non-owner", async function () {
      await expect(
        factory.connect(user).setFee(NEW_FEE)
      ).to.be.revertedWithCustomError(factory, "Unauthorized");
    });

    it("emits FeeChanged", async function () {
      await expect(factory.connect(owner).setFee(NEW_FEE))
        .to.emit(factory, "FeeChanged")
        .withArgs(INITIAL_FEE, NEW_FEE);
    });
  });

  describe("withdrawFees()", function () {
    beforeEach(async function () {
      // Fund the factory with a fee payment so there's a balance to withdraw.
      await factory
        .connect(user)
        .createCollection(NAME, SYMBOL, BASE_URI, MAX_SUPPLY, { value: INITIAL_FEE });
    });

    it("allows the owner to withdraw", async function () {
      const factoryBalanceBefore = await ethers.provider.getBalance(await factory.getAddress());
      expect(factoryBalanceBefore).to.equal(INITIAL_FEE);

      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);

      const tx = await factory.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      const factoryBalanceAfter = await ethers.provider.getBalance(await factory.getAddress());

      expect(factoryBalanceAfter).to.equal(0n);
      expect(ownerBalanceAfter).to.equal(
        ownerBalanceBefore + factoryBalanceBefore - gasUsed
      );
    });

    it("reverts if called by a non-owner", async function () {
      await expect(
        factory.connect(user).withdrawFees()
      ).to.be.revertedWithCustomError(factory, "Unauthorized");
    });
  });
});