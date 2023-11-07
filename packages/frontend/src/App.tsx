import { useState } from "react";
import HistoryTabMenu from "./components/HistoryTabMenu";
import AllHistoryCard from "./components/AllHistoryCard";
import YourHistoryCard from "./components/YourHistoryCard";
import Footer from "./components/Footer";

function App() {
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0);

  return (
    <div>
      <div className="bg-gradient-to-b from-[#7645d9] to-[#5121b1] py-20">
        <h2 className="text-xl text-white font-bold text-center mb-6">
          Zombium NFT Lottery
        </h2>

        <div className="text-center">
          <div className="text-6xl text-[#ffc700] font-semibold mb-3">
            $50,166
          </div>

          <div className="text-xl text-white font-bold text-center">
            in prizes!
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#313d5c] to-[#3d2a54] py-20">
        <div className="text-center">
          <div className="text-3xl text-white font-semibold mb-8">
            Just Grab Zombium <br />
            <span className="text-lg">to Jump into Lottery</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button className="inline-flex items-center h-12 bg-[#1fc7d4] px-5 rounded-2xl text-white font-semibold">
              Mint Zombium
            </button>
            <span className="text-white">or</span>
            <button className="inline-flex items-center h-12 bg-[#ed4b9e] px-5 rounded-2xl text-white font-semibold">
              Buy Zombium
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#cbd7ef] to-[#999fd0] py-12">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl text-[#280d5f] font-bold text-center mb-6">
            Finished Rounds
          </h2>

          <HistoryTabMenu />

          {historyTabMenuIndex === 0 ? <AllHistoryCard /> : <YourHistoryCard />}
        </div>
      </div>

      <div className="px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-5xl font-semibold text-[#7645d9] mb-5">
            How To Play
          </h2>

          <div className="text-center">
            If the digits on your tickets match the winning numbers in the
            correct order, you win a portion of the prize pool.
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
