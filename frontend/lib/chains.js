import { base, sepolia } from "wagmi/chains";
import { defineChain } from "viem";

// wagmi's built-in `arc` entry has no RPC URLs; define mainnet explicitly.
export const arc = defineChain({
  id: 5042,
  name: "Arc",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mainnet.arc.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      url: "https://explorer.arc.io",
    },
  },
});

export const SUPPORTED_CHAINS = [base, sepolia, arc];

export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];

export const SUPPORTED_NETWORKS_LABEL = SUPPORTED_CHAINS.map((c) => c.name).join(
  ", "
);
