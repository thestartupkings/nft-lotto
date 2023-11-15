import { formatEther, Address } from "viem";
import { useGetUserRounds } from "@/hooks";
import { ERC20Balance } from "..";

interface Round {
  nft: Address;
  from: bigint;
  to: bigint;
  blockHeight: bigint;
  prize: bigint;
  winner: Address;
  token: Address;
}

function RoundComponent({ roundId, round }: { round: Round; roundId: bigint }) {
  return (
    <div className="text-xl text-white flex flex-row justify-around p-2">
      <div className="">Round #{roundId.toString()} </div>
      <div className="text-[#ffc700] font-semibold">
        {formatEther(round.prize)} BONE
        <ERC20Balance address={round.token} amount={round.prize} />
      </div>
    </div>
  );
}

export default function YourHistoryCard() {
  const { data: rounds, isLoading } = useGetUserRounds();

  return (
    <div className="w-full md:w-[756px] bg-[#1c1749] border border-[#e7e3eb] shadow-xl rounded-3xl flex flex-col gap-4">
      {isLoading ? (
        <>Loading...</>
      ) : (rounds?.[0].length || 0) > 0 ? (
        <>
          {rounds?.[0].map((round, index) => (
            <RoundComponent
              round={round}
              roundId={rounds?.[1].at(index) || BigInt(0)}
            />
          ))}
        </>
      ) : (
        <div className="text-white p-4 text-center">
          You don't have win rounds.
        </div>
      )}
    </div>
  );
}
