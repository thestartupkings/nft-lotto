import { ethers } from "hardhat";

async function main() {
  const lotto = await ethers.deployContract("Lotto");

  await lotto.waitForDeployment();

  console.log(`Lotto contract is deployed to ${lotto.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
