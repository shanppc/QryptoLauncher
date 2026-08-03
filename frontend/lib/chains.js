import { sepolia } from "wagmi/chains";

// Supported chains as an array. To add a chain later:
// 1. import it from wagmi/chains and push it here
// 2. add its addresses in lib/contracts/addresses.js
export const SUPPORTED_CHAINS = [sepolia];

export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];
