import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { SUPPORTED_CHAINS } from "@/lib/chains";

// RainbowKit + wagmi config supporting Base (default), Sepolia, and Arc
export const wagmiConfig = getDefaultConfig({
  appName: "Qrypto Launcher",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: SUPPORTED_CHAINS,
  ssr: true,
});
