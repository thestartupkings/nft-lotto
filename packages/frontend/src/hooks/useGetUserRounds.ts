import { useContractRead, useAccount } from "wagmi";

import { LotteryContract } from "@/config";

export function useGetUserRounds() {
  const { address } = useAccount();

  const { data: winCount } = useContractRead({
    ...LotteryContract,
    functionName: "userWinCount",
    args: [address!],
    enabled: !!address,
  });

  return useContractRead({
    ...LotteryContract,
    functionName: "userRounds",
    args: [address!, BigInt(0), winCount!],
    enabled: !!address && !!winCount,
  });
}
