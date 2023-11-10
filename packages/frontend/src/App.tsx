import { useCallback, useMemo, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { formatEther } from "viem";
import HistoryTabMenu from "./components/HistoryTabMenu";
import AllHistoryCard from "./components/AllHistoryCard";
import YourHistoryCard from "./components/YourHistoryCard";
import Footer from "./components/Footer";
import Header from "./components/Header";

import { claimPrize } from "@/api";
import { useGetCurrentRound, useGetCurrentRoundWinner } from "@/hooks";

function App() {
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0);
  const { data: round } = useGetCurrentRound();
  const { winner, chosenTokenId } = useGetCurrentRoundWinner();

  const { address } = useAccount();
  const isWinner = useMemo(
    () => !!winner && winner === address,
    [winner, address]
  );
  const { signMessageAsync } = useSignMessage();
  const handleClaimPrize = useCallback(async () => {
    if (!address || !isWinner || !round) return;

    const addressSingature = await signMessageAsync({ message: address });

    const { signature } = await claimPrize(
      Number(round.blockHeight),
      address,
      addressSingature
    );
    console.log(signature);
  }, [address, isWinner, round, signMessageAsync]);

  return (
    <div>
      <div className="bg-gradient-to-b from-[#7645d9] to-[#5121b1]">
        <Header />

        <section className="block py-20">
          <h2 className="text-xl text-white font-bold text-center mb-6">
            Zombium NFT Lottery
          </h2>

          <div className="text-center text-white">
            <div className="text-6xl text-[#ffc700] font-semibold mb-3">
              {round?.prize ? <>{formatEther(round?.prize)} BONE</> : null}
            </div>

            <div className="text-xl text-white font-bold text-center">
              in prizes!
            </div>

            {winner ? (
              <div className="flex flex-col gap-2">
                <p className="text-xl">
                  The winner is&nbsp;
                  <span className="text-2xl text-[#ffc700] font-semibold">
                    {isWinner ? "You 🎉🎉🎉!" : winner}
                  </span>
                </p>
                {isWinner && (
                  <button onClick={handleClaimPrize}>Claim Prize</button>
                )}
              </div>
            ) : chosenTokenId !== undefined ? (
              <>Selected token ID is {chosenTokenId} but </>
            ) : (
              <div className="flex items-end justify-center mt-10">
                <div className="flex items-end">
                  <h3 className="text-4xl text-[#ffc700] font-semibold">21</h3>
                  <h3 className="text-xl text-[#e7974d] mr-2">h</h3>
                  <h3 className="text-4xl text-[#ffc700] font-semibold">48</h3>
                  <h3 className="text-xl text-[#e7974d] mr-2">m</h3>
                </div>

                <h2 className="text-xl text-white font-semibold">
                  until the draw
                </h2>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="bg-gradient-to-b from-[#cbd7ef] to-[#999fd0] py-12">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl text-[#280d5f] font-bold text-center mb-6">
            Finished Rounds
          </h2>

          <HistoryTabMenu
            activeIndex={historyTabMenuIndex}
            setActiveIndex={setHistoryTabMenuIndex}
          />

          {historyTabMenuIndex === 0 ? <AllHistoryCard /> : <YourHistoryCard />}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-5xl font-semibold text-[#7645d9] mb-5">
            How To Play
          </h2>

          <div className="text-center">
            If the digits on your tickets match the winning numbers in the
            correct order, you win a portion of the prize pool.
          </div>
        </div>

        <hr className="my-8" />
        <div className="text-center">
          <div className="text-3xl text-[#7645d9] font-semibold mb-8">
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
