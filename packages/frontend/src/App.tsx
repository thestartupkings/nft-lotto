import { useState } from "react";
import HistoryTabMenu from "./components/HistoryTabMenu";
import AllHistoryCard from "./components/AllHistoryCard";
import YourHistoryCard from "./components/YourHistoryCard";

function App() {
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0);

  return (
    <div className="h-screen bg-gradient-to-b from-[#cbd7ef] to-[#999fd0] py-12">
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-[#280d5f] font-bold text-center mb-6">
          Zombium NFT Lottery
        </h2>

        <HistoryTabMenu />

        {historyTabMenuIndex === 0 ? <AllHistoryCard /> : <YourHistoryCard />}
      </div>
    </div>
  );
}

export default App;
