import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useSignMessage, useConfig } from "wagmi";
import { formatEther, Address } from "viem";
import HistoryTabMenu from "./components/HistoryTabMenu";
import AllHistoryCard from "./components/AllHistoryCard";
import YourHistoryCard from "./components/YourHistoryCard";
import Footer from "./components/Footer";
import Header from "./components/Header";

import { claimPrize } from "@/api";
import {
  useClaimPrize,
  useGetCurrentRound,
  useGetCurrentRoundWinner,
} from "@/hooks";

function App() {
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0);
  const [signature, setSignature] = useState<Address | undefined>(undefined);
  const { data: round } = useGetCurrentRound();
  const { winner, chosenTokenId } = useGetCurrentRoundWinner();
  const { address } = useAccount();
  const config = useConfig();

  const { signMessageAsync } = useSignMessage();
  const { claim } = useClaimPrize({
    roundId: round?.[1] || BigInt(0),
    tokenId: chosenTokenId || BigInt(0),
    signature: signature || "0x",
    enabled:
      round?.[1] !== undefined && chosenTokenId !== undefined && !!signature,
  });

  const isWinner = useMemo(
    () => !!winner && winner === address,
    [winner, address]
  );
  const hasClaimed = useMemo(() => {
    return (
      round && round[0].winner !== "0x0000000000000000000000000000000000000000"
    );
  }, [round]);

  const handleClaimPrize = useCallback(async () => {
    if (!address || !isWinner || !round) return;

    const addressSingature = await signMessageAsync({ message: address });

    const { signature } = await claimPrize(
      Number(round[1]),
      address,
      addressSingature
    );
    setSignature(signature);
  }, [address, isWinner, round, signMessageAsync]);

  useEffect(() => {
    if (!signature) return;
    claim?.();
  }, [signature, claim]);

  return (
    <div>
      <div className="bg-gradient-to-b from-[#7645d9] to-[#5121b1]">
        <Header />

        <section className="block py-20">
          <h2 className="text-xl text-white font-bold text-center mb-6">
            Zombium NFT Lottery
          </h2>

          <div className="text-center text-white">
            {round ? (
              <>
                <div className="text-6xl text-[#ffc700] font-semibold mb-3">
                  {formatEther(round?.[0].prize)} BONE
                </div>
                <div className="text-xl text-white font-bold text-center">
                  in prizes!
                </div>
              </>
            ) : null}

            {winner ? (
              !hasClaimed ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-xl">
                    The winner is&nbsp;
                    <span className="text-2xl text-[#ffc700] font-semibold">
                      {isWinner ? "You 🎉🎉🎉!" : winner}
                    </span>
                  </p>
                  {isWinner && (
                    <button
                      onClick={handleClaimPrize}
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
                    {winner}
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
                <h2 className="text-xl text-white font-semibold">
                  {config.chains && round ? (
                    <div>
                      Winner will be chosen from this block&nbsp;
                      <a
                        href={`${config.chains[0].blockExplorers?.default.url}/block/${round?.[0].blockHeight}`}
                        target="_blank"
                      >
                        {round[0].blockHeight.toString()}
                      </a>
                    </div>
                  ) : null}
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
