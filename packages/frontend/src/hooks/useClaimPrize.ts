import { useCallback, useEffect, useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  Address,
  useSignMessage,
  useAccount,
} from "wagmi";

import { claimPrize } from "@/api";
import { LotteryContract } from "@/config";

export function useClaimPrize({
  roundId,
  tokenId,
  enabled = true,
}: {
  roundId?: bigint;
  tokenId?: bigint;
  enabled?: boolean;
}) {
  const [signature, setSignature] = useState<Address | undefined>(undefined);

  const { config } = usePrepareContractWrite({
    ...LotteryContract,
    functionName: "claimPrize",
    args: [roundId!, tokenId!, signature!],
    enabled:
      roundId !== undefined &&
      tokenId !== undefined &&
      signature !== undefined &&
      enabled,
  });

  const { data, write } = useContractWrite(config);
  const { isSuccess, isLoading } = useWaitForTransaction({
    hash: data?.hash,
  });
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const claim = useCallback(async () => {
    if (!address || roundId === undefined) return;
    console.log(`claiming...`, address, roundId);

    const addressSingature = await signMessageAsync({ message: address });

    const { signature } = await claimPrize(
      Number(roundId),
      address,
      addressSingature
    );
    setSignature(signature);
  }, [address, roundId, signMessageAsync]);

  useEffect(() => {
    if (!signature) return;
    console.log(`first`);
    write?.();
  }, [signature, write]);

  return { claim, isSuccess, isLoading };
}
