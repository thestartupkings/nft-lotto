import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  Address,
} from "wagmi";

import { LotteryContract } from "@/config";

export function useClaimPrize({
  roundId,
  tokenId,
  signature,
  enabled,
}: {
  roundId: bigint;
  tokenId: bigint;
  signature: Address;
  enabled?: boolean;
}) {
  const { config } = usePrepareContractWrite({
    ...LotteryContract,
    functionName: "claimPrize",
    args: [roundId, tokenId, signature],
    enabled,
  });

  const { data, write, writeAsync } = useContractWrite(config);
  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });

  return { claim: write, claimAsync: writeAsync, isSuccess, isLoading };
}
