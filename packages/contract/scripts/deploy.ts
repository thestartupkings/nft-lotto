import hre, { ethers } from "hardhat";

async function deployAndVerify({ name, args }: { name: string; args: any[] }) {
  const contract = await ethers.deployContract(name, args);

  await contract.waitForDeployment();

  console.log(`${name} contract is deployed to ${contract.target}`);

  if (contract.deploymentTransaction()?.hash) {
    await contract.deploymentTransaction()?.wait(5);
    await hre.run("verify:verify", {
      address: contract.target,
      constructorArguments: args,
    });
  }
}

async function main() {
  const [owner] = await ethers.getSigners();

  const contracts = [
    {
      name: "Lotto",
      args: [owner.address],
    },
    {
      name: "TNFT",
      args: [],
    },
  ];

  for (const contract of contracts) {
    await deployAndVerify(contract);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
