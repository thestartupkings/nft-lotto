import { useContractRead } from "wagmi";
import { Lotto__factory } from "nft-lotto-contract";

const LotteryContract = {
  address: import.meta.env.VITE_LOTTO_CONTRACT_ADDRESS,
  abi: Lotto__factory.abi,
} as const;

export function useGetCurrentRound({}) {
  const { data, isLoading } = useContractRead({
    ...LotteryContract,
    functionName: "currentRound",
  });

  return { data, isLoading };
}
