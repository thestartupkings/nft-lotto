import { useContractRead } from "wagmi";

import { LotteryContract } from "@/config";

export function useGetCurrentRound() {
  const { data, isLoading } = useContractRead({
    ...LotteryContract,
    functionName: "currentRound",
  });

  return { data, isLoading };
}
