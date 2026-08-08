import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, sepolia } from "wagmi/chains";

// RainbowKit + wagmi config supporting Base (default) and Sepolia
export const wagmiConfig = getDefaultConfig({
  appName: "Qrypto Launcher",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [base, sepolia],
  ssr: true,
});
