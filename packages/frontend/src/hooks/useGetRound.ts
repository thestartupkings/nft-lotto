import { useContractRead } from "wagmi";

import { LotteryContract } from "@/config";

export function useGetRound({ index }: { index: number }) {
  const { data, isLoading } = useContractRead({
    ...LotteryContract,
    functionName: "roundByIndex",
    args: [BigInt(index)],
  });

  return { data, isLoading };
}
