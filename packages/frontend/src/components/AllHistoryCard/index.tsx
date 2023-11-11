import { FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

import { BallWithNumber } from "@/svgs";
import { useGetRoundWinner, useGetTotalRounds } from "@/hooks";
import { useState } from "react";

export default function AllHistoryCard() {
  const [currentRound, setCurrentRound] = useState(0);
  const { data: totalRounds } = useGetTotalRounds();

  const { chosenTokenId } = useGetRoundWinner({ roundId: currentRound });

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
          <h5 className="text-[#280d5f] text-xl font-semibold">
            Chosen NFT Number
          </h5>

          <div>
            <BallWithNumber
              color="#D750B2"
              number={(chosenTokenId || BigInt(0)).toString()}
            />
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
