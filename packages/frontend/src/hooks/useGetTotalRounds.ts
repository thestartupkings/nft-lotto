import { useContractRead } from "wagmi";

import { LotteryContract } from "@/config";

export function useGetTotalRounds() {
  return useContractRead({
    ...LotteryContract,
    functionName: "totalRounds",
  });
}
