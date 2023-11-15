import {
  time,
  loadFixture,
  mine,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { chooseTokenId } from "@startupkings/nft-lotto-contract";
import { ZeroAddress } from "ethers";

describe("Lotto", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, admin, ali, bob] = await ethers.getSigners();

    const Lotto = await ethers.getContractFactory("Lotto");
    const lotto = await Lotto.deploy(owner.address);
    await lotto.addAdmin(admin);

    const TNFT = await ethers.getContractFactory("TNFT");
    const tNFT = await TNFT.deploy();
    const TRewardToken = await ethers.getContractFactory("TRewardToken");
    const tRewardToken = await TRewardToken.deploy();
    await tRewardToken.mint(ethers.parseEther("1000"));

    return { lotto, tNFT, tRewardToken, owner, admin, ali, bob };
  }

  it("Should deploy contract", async function () {
    await loadFixture(deployFixture);
  });

  describe("CreateRound", () => {
    it("Should owner create a new lottery", async function () {
      const { lotto, tNFT, tRewardToken, owner } =
        await loadFixture(deployFixture);
      const currentBlock = await ethers.provider.getBlockNumber();
      const prize = ethers.parseEther("1");
      const blockHeight = currentBlock + 10;

      await tRewardToken.approve(lotto, prize);
      await lotto.startNewRound(tNFT, 1, 100, blockHeight, tRewardToken, prize);

      const lottery = await lotto.roundByIndex(0);
      expect(lottery.nft).to.equal(await tNFT.getAddress());
      expect(lottery.blockHeight).to.equal(blockHeight);
      expect(lottery.prize).to.equal(prize);
      expect(lottery.winner).to.equal(ZeroAddress);
      expect(await lotto.roundIdByBlockHeight(blockHeight)).to.equal(0);

      const currentRound = await lotto.currentRound();
      expect(currentRound[1]).to.equal(0);

      const round = await lotto.roundByBlockHeight(blockHeight);
      expect(round).to.deep.equal(currentRound[0]);
    });

    it("Should admin create new rounds", async function () {
      const { lotto, tNFT, tRewardToken, admin } =
        await loadFixture(deployFixture);
      const currentBlock = await ethers.provider.getBlockNumber();
      const prize = ethers.parseEther("1");
      const blockHeight = currentBlock + 10;

      await tRewardToken.connect(admin).mint(prize);
      await tRewardToken.connect(admin).approve(lotto, prize);
      await lotto
        .connect(admin)
        .startNewRound(tNFT, 1, 100, blockHeight, tRewardToken, prize);

      const lottery0 = await lotto.roundByIndex(0);
      expect(lottery0.nft).to.equal(await tNFT.getAddress());
      expect(lottery0.blockHeight).to.equal(blockHeight);
      expect(lottery0.prize).to.equal(prize);
      expect(lottery0.winner).to.equal(ZeroAddress);
      expect(await lotto.roundIdByBlockHeight(blockHeight)).to.equal(0);

      const prize1 = ethers.parseEther("2");
      const blockHeight1 = currentBlock + 10;

      await tRewardToken.connect(admin).mint(prize1);
      await tRewardToken.connect(admin).approve(lotto, prize);
      await lotto
        .connect(admin)
        .startNewRound(tNFT, 1, 100, blockHeight1, tRewardToken, prize);

      const lottery1 = await lotto.roundByIndex(1);
      expect(lottery1.nft).to.equal(await tNFT.getAddress());
      expect(lottery1.blockHeight).to.equal(blockHeight1);
      expect(lottery1.prize).to.equal(prize);
      expect(lottery1.winner).to.equal(ZeroAddress);
      expect(await lotto.roundIdByBlockHeight(blockHeight1)).to.equal(1);
    });

    it("Should owner add prize to the exist round", async function () {
      const { lotto, tNFT, tRewardToken, owner } =
        await loadFixture(deployFixture);
      const currentBlock = await ethers.provider.getBlockNumber();
      const prize = ethers.parseEther("1");
      const blockHeight = currentBlock + 10;

      await tRewardToken.approve(lotto, prize);
      await lotto.startNewRound(tNFT, 1, 100, blockHeight, tRewardToken, prize);

      const lottery = await lotto.roundByIndex(0);
      expect(lottery.nft).to.equal(await tNFT.getAddress());
      expect(lottery.blockHeight).to.equal(blockHeight);
      expect(lottery.prize).to.equal(prize);
      expect(lottery.winner).to.equal(ZeroAddress);
      expect(await lotto.roundIdByBlockHeight(blockHeight)).to.equal(0);

      const newPrize = ethers.parseEther("2");
      await tRewardToken.approve(lotto, newPrize);
      await lotto.addPrize(0, newPrize);
    });

    it("Should admin deduct prize from the exist round", async function () {
      const { lotto, tNFT, tRewardToken, admin } =
        await loadFixture(deployFixture);
      const currentBlock = await ethers.provider.getBlockNumber();
      const prize = ethers.parseEther("2");
      const blockHeight = currentBlock + 100;

      await tRewardToken.connect(admin).mint(prize);
      await tRewardToken.connect(admin).approve(lotto, prize);
      await lotto
        .connect(admin)
        .startNewRound(tNFT, 1, 100, blockHeight, tRewardToken, prize);

      const lottery = await lotto.roundByIndex(0);
      expect(lottery.nft).to.equal(await tNFT.getAddress());
      expect(lottery.blockHeight).to.equal(blockHeight);
      expect(lottery.prize).to.equal(prize);
      expect(lottery.winner).to.equal(ZeroAddress);
      expect(await lotto.roundIdByBlockHeight(blockHeight)).to.equal(0);

      const amount = ethers.parseEther("1");

      await lotto.connect(admin).deductPrize(0, amount);
    });
  });

  describe("Claim", () => {
    it("Winner should be able to claim prize", async function () {
      const { lotto, tNFT, tRewardToken, owner, ali, bob } =
        await loadFixture(deployFixture);
      const currentBlock = await ethers.provider.getBlockNumber();
      const prize = ethers.parseEther("1");
      const duration = 10;
      const blockHeight = currentBlock + duration;

      await tRewardToken.approve(lotto, prize);
      await lotto.startNewRound(tNFT, 1, 100, blockHeight, tRewardToken, prize);

      await mine(duration);

      const chosenBlock = await ethers.provider.getBlock(blockHeight);

      expect(chosenBlock).not.null;
      expect(chosenBlock!.hash).not.null;

      const winner = await chooseTokenId(chosenBlock!.hash!, 1, 100);

      await tNFT.connect(ali).mint([winner]);

      // Generate signed message with owner private key
      const message = ethers.solidityPackedKeccak256(
        ["uint256", "uint256"],
        [blockHeight, winner]
      );
      const signature = await owner.signMessage(ethers.getBytes(message));

      await expect(
        lotto.connect(bob).claimPrize(0, winner + 1, signature)
      ).to.revertedWith("Invalid signature");

      await lotto.connect(ali).claimPrize(0, winner, signature);

      await expect(
        lotto.connect(ali).claimPrize(0, winner, signature)
      ).to.revertedWith("Round already claimed");

      const userRoundCnt = await lotto.userWinCount(ali.address);
      expect(userRoundCnt).eq(1);
      const userRound = await lotto.roundOfUserByIndex(ali.address, 0);
      expect(userRound.winner).eq(ali.address);

      // Should able to fetch all user win rounds
      const userRounds = await lotto.roundsOfUser(ali.address, 0, userRoundCnt);
      expect(userRounds.length).eq(2);
      expect(userRounds[0].length).eq(userRoundCnt);
      expect(userRound).to.deep.eq(userRounds[0][0]);

      // Should able to fetch all rounds
      const totalRounds = await lotto.totalRounds();
      const rounds = await lotto.rounds(0, totalRounds);
      expect(rounds.length).eq(totalRounds);
      expect(rounds[0]).to.deep.eq(userRound);
    });
  });

  describe("Admin", () => {
    it("should only owner add admin", async () => {
      const { lotto, admin, ali, bob } = await loadFixture(deployFixture);
      await lotto.addAdmin(admin);
      expect(await lotto.admins(admin)).to.be.true;

      // Revert if caller is not admin
      await expect(lotto.connect(ali).addAdmin(bob)).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should only owner remove admin", async () => {
      const { lotto, admin, ali, bob } = await loadFixture(deployFixture);
      await lotto.removeAdmin(admin);
      expect(await lotto.admins(admin)).to.be.false;

      // Revert if caller is not admin
      await expect(lotto.connect(ali).addAdmin(bob)).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should only onwer set signer", async () => {
      const { lotto, ali } = await loadFixture(deployFixture);
      await lotto.setSigner(ali);
      // @ts-ignore
      expect(await lotto.signer()).eq(ali.address);

      // Revert if caller is not admin
      await expect(lotto.connect(ali).setSigner(ali)).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
    it("should only onwer pause/unpause the contract", async () => {
      const { lotto, ali } = await loadFixture(deployFixture);
      await lotto.pause();

      // Revert if caller is not admin
      await expect(lotto.connect(ali).pause()).to.revertedWith(
        "Ownable: caller is not the owner"
      );

      await lotto.unpause();

      // Revert if caller is not admin
      await expect(lotto.connect(ali).unpause()).to.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
