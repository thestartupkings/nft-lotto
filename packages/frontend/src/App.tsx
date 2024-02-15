import { useState } from "react";
import { useConfig } from "wagmi";

import HistoryTabMenu from "./components/HistoryTabMenu";
import AllHistoryCard from "./components/AllHistoryCard";
import YourHistoryCard from "./components/YourHistoryCard";
import Footer from "./components/Footer";
import Header from "./components/Header";

import {
  useClaimPrize,
  useGetCurrentRound,
  useGetCurrentRoundWinner,
} from "@/hooks";
import { ERC20Balance, Fairness } from "./components";

import zombie1Img from "./assets/images/zombie-1.png";
import zombie2Img from "./assets/images/zombie-2.png";

function App() {
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0);

  const { data: round } = useGetCurrentRound();
  const { winner, isWinner, chosenTokenId, claimedBy } =
    useGetCurrentRoundWinner();

  const config = useConfig();

  const { claim } = useClaimPrize({
    roundId: round?.[1],
    tokenId: chosenTokenId,
    enabled: isWinner,
  });

  return (
    <div className="bg-[#0A062F]">
      <div>
        <Header />

        <section className="block py-20">
          <div className="flex justify-center items-center">
            <div>
              <img src={zombie2Img} className="-scale-x-100" />
            </div>
            <div>
              <h2 className="text-3xl text-white font-bold text-center mb-6">
                Zombium NFT Lottery
              </h2>

              <p className="max-w-2xl text-slate-300 font-medium mx-auto text-center">
                Zombium Lottery is provable lottery powered by Shibarium
                Blockchain.
                <br />
                Buy Zombium NFT to increate chance to win!!!
              </p>
            </div>

            <div>
              <img src={zombie1Img} />
            </div>
          </div>

          <div className="text-center text-white">
            {round ? (
              <>
                <div className="text-2xl md:text-6xl text-[#ffc700] font-semibold mb-3">
                  <ERC20Balance
                    address={round[0].token}
                    amount={round[0].prize}
                  />
                </div>
                <div className="text-xl text-white font-bold text-center">
                  in prizes!
                </div>
              </>
            ) : null}

            <div className="my-2">
              {winner ? (
                !claimedBy ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xl">
                      The winner is
                      <br />
                      <span className="text-sm md:text-2xl text-[#ffc700] font-semibold">
                        {isWinner ? "You 🎉🎉🎉!" : winner}
                      </span>
                    </p>
                    {isWinner && (
                      <button
                        onClick={claim}
                        className="max-w-[8rem] items-center h-12 bg-[#1fc7d4] px-5 rounded-2xl text-white font-semibold"
                      >
                        Claim Prize
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    Already claimed by&nbsp;
                    <span className="text-xl text-[#ffc700] font-semibold">
                      {claimedBy}
                    </span>
                  </>
                )
              ) : chosenTokenId !== undefined ? (
                <div className="leading-6">
                  Selected token ID is&nbsp;
                  <span className="text-2xl text-[#ffc700] font-semibold">
                    {chosenTokenId.toString()}
                  </span>
                  &nbsp;but not minted yet.
                </div>
              ) : (
                <div className="flex items-end justify-center mt-10">
                  {config.chains && round ? (
                    <h2 className="text-xl text-white font-semibold">
                      Winner will be chosen from&nbsp;
                      <a
                        href={`${config.chains[0].blockExplorers?.default.url}/block/${round?.[0].blockHeight}`}
                        target="_blank"
                        className="text-[#ffc700] font-semibold"
                      >
                        {round[0].blockHeight.toString()}
                      </a>
                      &nbsp;block hash.
                    </h2>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="max-w-xs md:max-w-lg mx-auto py-12 flex flex-col items-center">
        <h2 className="text-4xl text-[white] font-bold text-center mb-6">
          Finished Rounds
        </h2>

        <HistoryTabMenu
          activeIndex={historyTabMenuIndex}
          setActiveIndex={setHistoryTabMenuIndex}
        />

        {historyTabMenuIndex === 0 ? <AllHistoryCard /> : <YourHistoryCard />}
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-5xl font-semibold text-white mb-5">
              How To Play
            </h2>

            <p className="text-center text-gray-300">
              We choose the NFT number from the block hash of the round block.
              <br />
              If you own the NFT with the chosen number, you win the prize!
            </p>
          </div>
          <Fairness />
        </div>

        <div className="text-center mt-8">
          <div className="text-3xl text-white font-semibold mb-8">
            Just Grab Zombium <br />
            <span className="text-lg">to Jump into Lottery</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <a
              href="https://mint.zombium.app/"
              target="_blank"
              className="inline-flex items-center h-12 bg-[#1fc7d4] px-5 rounded-2xl text-white font-semibold"
            >
              Mint Zombium
            </a>
            <span className="text-black">or</span>
            <a
              href="https://app.withmantra.com/market/collection/0xb1635a8a344afc0bdc0e8cf26954815644be7370?chain_id=109&auctionType=fixed&sort=2&statuses=created"
              target="_blank"
              className="inline-flex items-center h-12 bg-[#ed4b9e] px-5 rounded-2xl text-white font-semibold"
            >
              Buy Zombium
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
