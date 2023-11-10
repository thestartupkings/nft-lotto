import path from "node:path";
import { config } from "dotenv";
import express from "express";
import { ethers } from "ethers";
import {
  Lotto__factory,
  chooseTokenId,
} from "@startupkings/nft-lotto-contract";
config({ path: "../../.env" });

const app = express();

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

const provider = new ethers.JsonRpcProvider(process.env.VITE_RPC_URL);
const lotto = Lotto__factory.connect(
  process.env.VITE_LOTTO_CONTRACT_ADDRESS!,
  provider
);
const owner = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);

app.post("/approve-claim", async (req, res) => {
  try {
    const { roundId } = req.body;

    if (!roundId) {
      res.status(400).send("Round ID is required");
      return;
    }

    const roundInfo = await lotto.roundByIndex(roundId);
    const block = await provider.getBlock(roundInfo.blockHeight);

    if (!block || !block.hash) {
      res.status(400).send("Block isn't mined yet");
      return;
    }

    const winner = await chooseTokenId(
      block.hash,
      Number(roundInfo.from),
      Number(roundInfo.to)
    );
    const message = ethers.solidityPackedKeccak256(
      ["uint256", "uint256"],
      [roundInfo.blockHeight, winner]
    );
    const signature = await owner.signMessage(ethers.getBytes(message));
    res.send({ signature });
  } catch (error) {
    console.error(error);

    res.status(500).send({ error: "Internal Server Error" });
  }
});

const PORT = parseInt(process.env.PORT || "3000");

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
