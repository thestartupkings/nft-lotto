import { useEffect, useMemo, useState } from "react";
import { useContractRead, erc721ABI, useAccount } from "wagmi";
import { chooseTokenId } from "@startupkings/nft-lotto-contract";

import { useGetRound } from "./useGetRound";
import { useGetBlockHash } from "./useGetBlockHash";
import { useGetCurrentRound } from "./useGetCurrentRound";
import { zeroAddress } from "viem";

export function useGetCurrentRoundWinner() {
  const { data: round } = useGetCurrentRound();
  return useGetRoundWinner({ roundId: Number(round?.[1] || BigInt(0)) });
}

export function useGetRoundWinner({ roundId }: { roundId: number }) {
  const [chosenTokenId, setChosenTokenId] = useState<bigint | undefined>();

  const { data: round, isLoading: isLoadingRound } = useGetRound({ roundId });
  const { blockHash, isLoading: isLoadingBlock } = useGetBlockHash({
    height: BigInt(1677903),
    enabled: !isLoadingRound && round !== undefined,
  });
  const { address } = useAccount();

  const isLoadingWinner = isLoadingRound || isLoadingBlock;

  useEffect(() => {
    if (!blockHash || !round || isLoadingWinner) return;
    (async () => {
      const tokenId = await chooseTokenId(
        blockHash,
        Number(round[1]),
        Number(round[2])
      );
      setChosenTokenId(BigInt(tokenId));
    })();
  }, [blockHash, round, isLoadingWinner]);

  const { data: winner, isLoading: isLoadingOwner } = useContractRead({
    address: round?.[0],
    abi: erc721ABI,
    functionName: "ownerOf",
    args: [chosenTokenId!],
    enabled: !!chosenTokenId && !!round && !isLoadingRound && !isLoadingBlock,
  });

  const isWinner = useMemo(
    () => !!winner && winner === address,
    [address, winner]
  );

  const isLoading = isLoadingWinner || isLoadingOwner;

  return {
    winner,
    isWinner,
    chosenTokenId,
    round,
    claimedBy: round?.[6] && round[6] !== zeroAddress ? round[6] : undefined,
    isLoading,
  };
}
