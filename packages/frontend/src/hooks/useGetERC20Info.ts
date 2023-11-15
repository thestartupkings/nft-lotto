import { erc20ABI, Address, useContractReads } from "wagmi";

export function useGetERC20Info({ address }: { address: Address }) {
  const contract = { address, abi: erc20ABI } as const;

  const { data, ...rest } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "symbol",
      },
      {
        ...contract,
        functionName: "decimals",
      },
    ],
  });

  const name = data?.[0].result;
  const symbol = data?.[1].result;
  const decimals = data?.[2].result;

  return {
    name,
    symbol,
    decimals,
    ...rest,
  };
}
