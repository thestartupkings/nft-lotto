import React from "react";
import { FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";
import Footer from "./Footer";
import { Ball, BallWithNumber } from "@/svgs";

export default function AllHistoryCard() {
  return (
    <div className="w-full md:w-[756px] bg-white border border-[#e7e3eb] shadow-xl rounded-3xl">
      <div className="p-6 rounded-t-3xl border-b border-[#e7e3eb]">
        <div className="flex justify-between">
          <div className="flex items-end gap-3">
            <h5 className="text-[#280d5f] text-xl font-semibold">Round</h5>
            <span>#1100</span>
          </div>

          <div className="flex items-center gap-3 text-[#280d5f]">
            <button className="">
              <FaAngleLeft size={24} />
            </button>
            <button className="">
              <FaAngleRight size={24} />
            </button>
            <button className="">
              <FaAngleDoubleRight size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-[#e7e3eb]">
        <div className="flex justify-between">
          <h5 className="text-[#280d5f] text-xl font-semibold">
            Winning NFT Number
          </h5>

          <div>
            <BallWithNumber color="#D750B2" number="9" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
