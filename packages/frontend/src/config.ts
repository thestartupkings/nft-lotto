import { Chain } from "viem";

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
