"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider, useAccount } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { useState, useEffect, useRef } from "react";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { DEFAULT_CHAIN, SUPPORTED_CHAINS } from "@/lib/chains";
import { trackEvent } from "@/utils/track";

/**
 * Tracks wallet_connected (false→true transition) and network_selected
 * (chainId change after first connect). Must live inside the WagmiProvider
 * tree so useAccount() has context.
 */
function WalletTracker() {
  const { isConnected, address, connector, chainId } = useAccount();

  // Resolve chain name from SUPPORTED_CHAINS (or wagmi's built-in chain list).
  const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);

  // --- wallet_connected: fire once on false → true transition ---------------
  const prevConnected = useRef(false);
  useEffect(() => {
    if (!prevConnected.current && isConnected) {
      trackEvent("wallet_connected", {
        wallet_provider: connector?.name ?? "unknown",
        wallet_address: address,
      });
    }
    prevConnected.current = isConnected;
  }, [isConnected, address, connector]);

  // --- network_selected: fire on chainId change AFTER first connect ---------
  // We never fire on the very first render/mount (prevChainId starts null).
  // We also gate on everConnected so a page-load with no wallet doesn't fire.
  const prevChainId = useRef(null);
  const everConnected = useRef(false);
  useEffect(() => {
    if (isConnected) everConnected.current = true;

    // Skip until the user has connected at least once.
    if (!everConnected.current) {
      prevChainId.current = chainId ?? null;
      return;
    }

    // Skip the initial population of prevChainId.
    if (prevChainId.current === null) {
      prevChainId.current = chainId ?? null;
      return;
    }

    if (prevChainId.current !== chainId) {
      trackEvent("network_selected", {
        network_name: chain?.name ?? "unknown",
        chain_id: chainId,
      });
      prevChainId.current = chainId ?? null;
    }
  }, [chainId, isConnected, chain]);

  return null;
}

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={DEFAULT_CHAIN}
          theme={darkTheme({
            accentColor: "#7c3aed",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {/* Tracker renders null — only here for wagmi/account context */}
          <WalletTracker />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
