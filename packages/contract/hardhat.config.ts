import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-solhint";
import "solidity-coverage";
import { config as dotConfig } from "dotenv";

dotConfig({ path: "../../.env" });

const networks = process.env.HARDHAT_GOERLI_RPC_URL
  ? {
      goerli: {
        chainId: 5,
        url: process.env.HARDHAT_GOERLI_RPC_URL!,
        accounts: [process.env.HARDHAT_PRIVATE_KEY!],
      },
    }
  : undefined;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  typechain: {
    outDir: "src/types",
    target: "ethers-v6",
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ["externalArtifacts/*.json"], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
    dontOverrideCompile: false, // defaults to false
  },
  networks,
  etherscan: { apiKey: process.env.HARDHAT_ETHERSCAN_API_KEY },
};

export default config;
