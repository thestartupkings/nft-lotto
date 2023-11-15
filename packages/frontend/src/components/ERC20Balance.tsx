import { Address, formatUnits } from "viem";

import { useGetERC20Info } from "@/hooks";

export function ERC20Balance({
  address,
  amount,
}: {
  address: Address;
  amount: bigint;
}) {
  const { symbol, decimals, isLoading } = useGetERC20Info({ address });

  return (
    <div>
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          {parseFloat(formatUnits(amount, decimals || 18)).toFixed(2)}
          <span className="text-[#ffc700]">{symbol || ""}</span>
        </>
      )}
    </div>
  );
}
