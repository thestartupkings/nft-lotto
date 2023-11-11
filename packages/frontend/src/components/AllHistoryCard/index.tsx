import { FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

import { BallWithNumber } from "@/svgs";
import { useGetRoundWinner, useGetTotalRounds } from "@/hooks";
import { useState } from "react";

export default function AllHistoryCard() {
  const [currentRound, setCurrentRound] = useState(0);
  const { data: totalRounds } = useGetTotalRounds();

  const { chosenTokenId, winner, isLoading } = useGetRoundWinner({
    roundId: currentRound,
  });

  return (
    <div className="w-full md:w-[756px] bg-[#1c1749] border border-[#e7e3eb] shadow-xl rounded-3xl">
      <div className="p-6 rounded-t-3xl border-b border-[#e7e3eb]">
        <div className="flex justify-between">
          <div className="flex items-end gap-3 text-white">
            <h5 className="text-xl font-semibold">Round</h5>
            <span className="text-gray-300 font-semibold">#{currentRound}</span>
          </div>

          <div className="flex items-center gap-3 text-white">
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
            <h5 className="text-white text-xl font-semibold">
              Chosen NFT Number
            </h5>
            {winner && <p>Claimed by {winner}</p>}
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
