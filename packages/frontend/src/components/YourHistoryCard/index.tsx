export default function YourHistoryCard() {
  return (
    <div className="w-full md:w-[756px] bg-[#1c1749] border border-[#e7e3eb] shadow-xl rounded-3xl">
      <div className="p-6 rounded-t-3xl border-b border-[#e7e3eb]">
        <div className="flex justify-between">
          <h5 className="text-white text-xl font-semibold">Round</h5>
        </div>
      </div>

      <div className="p-6 ">
        <div className="flex justify-between">
          <h5 className="text-white text-xl font-semibold">
            Winning NFT Number
          </h5>
        </div>
      </div>
    </div>
  );
}
