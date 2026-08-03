import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { injected } from "wagmi/connectors";
import { SUPPORTED_CHAINS } from "./chains";

// MetaMask only, via the injected connector. No WalletConnect / RainbowKit.
export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [injected({ target: "metaMask" })],
  transports: Object.fromEntries(SUPPORTED_CHAINS.map((c) => [c.id, http()])),
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
});
