import { useContractRead } from "wagmi";

import { LotteryContract } from "@/config";

export function useGetRound({ roundId }: { roundId: number }) {
  return useContractRead({
    ...LotteryContract,
    functionName: "roundByIndex",
    args: [BigInt(roundId)],
  });
}
