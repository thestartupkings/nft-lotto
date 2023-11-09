import { ethers } from "ethers";

/**
 * Returns randonmly generated number between from and to by using blockhash as seed.
 * @param blockHash
 * @param from
 * @param to
 */
export async function chooseTokenId(
  blockHash: string,
  from: number,
  to: number
): Promise<number> {
  const hash = ethers.keccak256(
    ethers.toUtf8Bytes(`${blockHash}-${from}-${to}`)
  );
  const hex = hash.substring(2, 10);
  const seed = parseInt(hex, 16);
  const winner = from + (seed % (to - from + 1));
  return winner;
}
