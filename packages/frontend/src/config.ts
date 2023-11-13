import { Chain, Address } from "viem";
import { Lotto__factory } from "@startupkings/nft-lotto-contract";

export const shibarium: Chain = {
  network: "Shibarium",
  name: "Shibarium",
  rpcUrls: {
    default: { http: ["https://www.shibrpc.com"] },
    public: { http: ["https://www.shibrpc.com"] },
  },
  id: 109,
  nativeCurrency: {
    symbol: "BONE",
    name: "BONE",
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "Shibariumscan",
      url: "https://www.shibariumscan.io",
    },
  },
};

export const VITE_LOTTO_CONTRACT_ADDRESS = import.meta.env
  .VITE_LOTTO_CONTRACT_ADDRESS as Address;

export const LotteryContract = {
  address: VITE_LOTTO_CONTRACT_ADDRESS,
  abi: Lotto__factory.abi,
} as const;

export const IS_PROD = (import.meta.env.VITE_IS_PROD as string) === "true";

console.log(VITE_LOTTO_CONTRACT_ADDRESS, import.meta.env.VITE_ALCHEMY_ID);
