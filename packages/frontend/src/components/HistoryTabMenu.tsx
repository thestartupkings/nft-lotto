import React, { useMemo } from "react";

export default function HistoryTabMenu({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}) {
  return (
    <div className="bg-[#eeeaf4] rounded-2xl mb-6">
      <button
        className={`${
          activeIndex == 0 ? "bg-[#7a6eaa] text-white" : "text-[#7a6eaa]"
        } inline-flex items-center text-base font-semibold h-8 px-4 rounded-2xl`}
        onClick={() => setActiveIndex(0)}
      >
        All History
      </button>
      <button
        className={`${
          activeIndex == 1 ? "bg-[#7a6eaa] text-white" : "text-[#7a6eaa]"
        } inline-flex items-center text-base font-semibold h-8 px-4 rounded-2xl`}
        onClick={() => setActiveIndex(1)}
      >
        Your History
      </button>
    </div>
  );
}
