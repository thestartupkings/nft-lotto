import React from "react";
import Footer from "./Footer";

export default function AllHistoryCard() {
  return (
    <div className="w-full md:w-[756px] bg-white border border-[#e7e3eb] shadow-xl rounded-3xl">
      <div className="p-6 rounded-t-3xl border-b border-[#e7e3eb]">
        <div className="flex justify-between">
          <h5 className="text-[#280d5f] text-xl font-semibold">Round</h5>
        </div>
      </div>

      <div className="p-6 border-b border-[#e7e3eb]">
        <div className="flex justify-between">
          <h5 className="text-[#280d5f] text-xl font-semibold">
            Winning NFT Number
          </h5>
        </div>
      </div>

      <Footer />
    </div>
  );
}
