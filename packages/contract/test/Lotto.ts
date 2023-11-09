import {
  time,
  loadFixture,
  mine,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { chooseTokenId } from "nft-lotto-contract";

describe("Lotto", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, ali, bob] = await ethers.getSigners();

    const Lotto = await ethers.getContractFactory("Lotto");
    const lotto = await Lotto.deploy(owner.address);
    const TNFT = await ethers.getContractFactory("TNFT");
    const tNFT = await TNFT.deploy();

    return { lotto, tNFT, owner, ali, bob };
  }

  it("Should deploy contract", async function () {
    await loadFixture(deployFixture);
  });

  it("Should owner create a new lottery", async function () {
    const { lotto, tNFT, owner } = await loadFixture(deployFixture);
    const currentBlock = await ethers.provider.getBlockNumber();
    const prize = ethers.parseEther("1");
    const blockHeight = currentBlock + 10;

    await lotto.startNewRound(tNFT, 1, 100, blockHeight, prize, {
      value: prize,
    });

    const lottery = await lotto.roundByIndex(0);
    expect(lottery.nft).to.equal(await tNFT.getAddress());
    expect(lottery.blockHeight).to.equal(blockHeight);
    expect(lottery.prize).to.equal(prize);
    expect(lottery.winner).to.equal(
      "0x0000000000000000000000000000000000000000"
    );
    expect(await lotto.roundIdByBlockHeight(blockHeight)).to.equal(0);
  });

  it("Winner should be able to claim prize", async function () {
    const { lotto, tNFT, owner, ali, bob } = await loadFixture(deployFixture);
    const currentBlock = await ethers.provider.getBlockNumber();
    const prize = ethers.parseEther("1");
    const duration = 10;
    const blockHeight = currentBlock + duration;

    await lotto.startNewRound(tNFT, 1, 100, blockHeight, prize, {
      value: prize,
    });

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
  });
});
