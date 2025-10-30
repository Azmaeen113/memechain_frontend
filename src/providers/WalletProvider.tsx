import React from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  bsc,
  arbitrum,
  base,
  optimism,
  avalanche,
  fantom,
  gnosis,
  zkSync,
  linea,
  scroll,
  mantle,
  blast,
  sepolia
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { UserProvider } from "@/contexts/UserContext";

const config = getDefaultConfig({
  appName: "memechain",
  projectId: "32f69a4af876e8f694e3bb99749029c3",
  chains: [
    mainnet,
    polygon,
    bsc,
    arbitrum,
    base,
    optimism,
    avalanche,
    fantom,
    gnosis,
    zkSync,
    linea,
    scroll,
    mantle,
    blast,
    sepolia
  ]
});

const queryClient = new QueryClient();

export function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#FF8A00",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small"
          })}
        >
          <UserProvider>
            {children}
          </UserProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
