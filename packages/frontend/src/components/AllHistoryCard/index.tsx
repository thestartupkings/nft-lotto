import { useState } from "react";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

import { BallWithNumber } from "@/svgs";
import { useClaimPrize, useGetRoundWinner, useGetTotalRounds } from "@/hooks";

export default function AllHistoryCard() {
  const [currentRound, setCurrentRound] = useState(0);
  const { data: totalRounds } = useGetTotalRounds();

  const { chosenTokenId, isWinner, isLoading, claimedBy } = useGetRoundWinner({
    roundId: currentRound,
  });

  const { claim } = useClaimPrize({
    roundId: BigInt(currentRound),
    tokenId: chosenTokenId,
    enabled: isWinner,
  });

  return (
    <div className="w-full md:w-[756px] bg-white border border-[#e7e3eb] shadow-xl rounded-3xl">
      <div className="p-6 rounded-t-3xl border-b border-[#e7e3eb]">
        <div className="flex justify-between">
          <div className="flex items-end gap-3">
            <h5 className="text-[#280d5f] text-xl font-semibold">Round</h5>
            <span>#{currentRound}</span>
          </div>

          <div className="flex items-center gap-3 text-[#280d5f]">
            <button
              className=""
              onClick={() => setCurrentRound((prev) => prev - 1)}
              disabled={currentRound === 0}
            >
              <FaAngleLeft size={24} />
            </button>
            <button
              className=""
              onClick={() => setCurrentRound((prev) => prev + 1)}
              disabled={currentRound === Number(totalRounds) - 1}
            >
              <FaAngleRight size={24} />
            </button>
            <button
              className=""
              onClick={() => setCurrentRound(Number(totalRounds) - 1)}
              disabled={
                totalRounds === undefined ||
                currentRound === Number(totalRounds) - 1
              }
            >
              <FaAngleDoubleRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 ">
        <div className="flex justify-between">
          <div>
            <h5 className="text-[#280d5f] text-xl font-semibold">
              Chosen NFT Number
            </h5>
            {claimedBy ? (
              <p>Claimed by {claimedBy}</p>
            ) : isWinner ? (
              <button
                onClick={claim}
                className="max-w-[8rem] items-center h-12 bg-[#1fc7d4] px-5 rounded-2xl text-white font-semibold"
                disabled={isLoading}
              >
                Claim Prize
              </button>
            ) : null}
          </div>
          <div>
            {!!chosenTokenId && (
              <BallWithNumber
                color="#D750B2"
                number={isLoading ? "" : chosenTokenId.toString()}
              />
            )}
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
