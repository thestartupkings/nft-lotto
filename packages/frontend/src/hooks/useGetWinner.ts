import { useEffect, useState } from "react";
import { useContractRead, erc721ABI } from "wagmi";
import { chooseTokenId } from "@startupkings/nft-lotto-contract";

import { useGetRound } from "./useGetRound";
import { useGetBlockHash } from "./useGetBlockHash";
import { useGetCurrentRound } from "./useGetCurrentRound";

export function useGetCurrentRoundWinner() {
  const [chosenTokenId, setChosenTokenId] = useState<bigint | undefined>();

  const { data: round } = useGetCurrentRound();
  const { blockHash } = useGetBlockHash({ height: round?.blockHeight });

  useEffect(() => {
    if (!blockHash || !round) return;
    (async () => {
      const tokenId = await chooseTokenId(
        blockHash,
        Number(round.from),
        Number(round.to)
      );
      setChosenTokenId(BigInt(tokenId));
    })();
  }, [blockHash, round]);

  const { data: winner } = useContractRead({
    address: round!.nft,
    abi: erc721ABI,
    functionName: "ownerOf",
    args: [chosenTokenId!],
    enabled: !!chosenTokenId && !!round,
  });

  return { winner, chosenTokenId };
}

export function useGetRoundWinner({ roundId }: { roundId: number }) {
  const [chosenTokenId, setChosenTokenId] = useState<bigint | undefined>();

  const { data: round } = useGetRound({ roundId });
  const { blockHash } = useGetBlockHash({ height: round?.[3] });

  useEffect(() => {
    if (!blockHash || !round) return;
    (async () => {
      const tokenId = await chooseTokenId(
        blockHash,
        Number(round[1]),
        Number(round[2])
      );
      setChosenTokenId(BigInt(tokenId));
    })();
  }, [blockHash, round]);

  const { data: winner } = useContractRead({
    address: round![0],
    abi: erc721ABI,
    functionName: "ownerOf",
    args: [chosenTokenId!],
    enabled: !!chosenTokenId && !!round,
  });

  return { winner, chosenTokenId };
}
