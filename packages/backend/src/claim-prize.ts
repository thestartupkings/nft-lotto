import { config } from "dotenv";
import { ethers } from "ethers";
import {
  Lotto__factory,
  chooseTokenId,
} from "@startupkings/nft-lotto-contract";
config({ path: "../../.env" });

import type { VercelRequest, VercelResponse } from "@vercel/node";

const provider = new ethers.JsonRpcProvider(process.env.VITE_RPC_URL);
const lotto = Lotto__factory.connect(
  process.env.VITE_LOTTO_CONTRACT_ADDRESS!,
  provider
);
const owner = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const { roundId = 0 } = request.body;

    if (roundId === undefined) {
      response.status(400).send("Round ID is required");
      return;
    }

    const roundInfo = await lotto.roundByIndex(roundId);
    const block = await provider.getBlock(roundInfo.blockHeight);

    if (!block || !block.hash) {
      response.status(400).send("Block isn't mined yet");
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
    response.send({ signature, winner, blockHeight: roundInfo.blockHeight });
  } catch (error) {
    console.error(error);

    response.status(500).send({ error: "Internal Server Error" });
  }
}
