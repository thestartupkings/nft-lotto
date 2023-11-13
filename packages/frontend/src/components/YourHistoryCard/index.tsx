import { formatEther } from "viem";
import { useGetUserRounds } from "@/hooks";

interface Round {
  nft: `0x${string}`;
  from: bigint;
  to: bigint;
  blockHeight: bigint;
  prize: bigint;
  winner: `0x${string}`;
}

function RoundComponent({ roundId, round }: { round: Round; roundId: bigint }) {
  return (
    <div className="text-xl text-white flex flex-row justify-around p-2">
      <div className="">Round #{roundId.toString()} </div>
      <div className="text-[#ffc700] font-semibold">
        {formatEther(round.prize)} BONE
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
        <>You don't have win rounds.</>
      )}
    </div>
  );
}
