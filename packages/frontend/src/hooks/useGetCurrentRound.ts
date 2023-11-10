import { useContractRead } from "wagmi";

import { LotteryContract } from "@/config";

export function useGetCurrentRound() {
  return useContractRead({
    ...LotteryContract,
    functionName: "currentRound",
  });
}
