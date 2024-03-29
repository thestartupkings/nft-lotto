import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { FC, ReactNode } from "react";
import { shibarium, IS_PROD } from "./config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CHAINS = IS_PROD ? [shibarium] : [goerli];

const { chains, publicClient } = configureChains(CHAINS, [
  alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID ?? "" }),
  publicProvider(),
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id === shibarium.id) {
        return { http: shibarium.rpcUrls.default.http[0] };
      }
      return null;
    },
  }),
]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      <ToastContainer />
    </WagmiConfig>
  );
};

export default Provider;
