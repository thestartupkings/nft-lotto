import React from "react";

export default function HistoryTabMenu({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: () => void;
}) {
  return (
    <div className="bg-[#eeeaf4] rounded-2xl mb-6">
      <button className="bg-[#7a6eaa] inline-flex items-center text-white text-base font-semibold h-8 px-4 rounded-2xl">
        All History
      </button>
      <button className=" inline-flex items-center text-[#7a6eaa] text-base font-semibold h-8 px-4 rounded-2xl">
        Your History
      </button>
    </div>
  );
}
