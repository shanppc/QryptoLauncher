// app/erc20/layout.js
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata = buildMetadata({
  title: "Launch ERC20 Token on Base — QryptoLauncher",
  description:
    "Deploy your custom ERC20 token on Base Mainnet or Sepolia Testnet without code. Initial supply is minted directly to your wallet.",
  path: "/erc20",
});

export default function Erc20Layout({ children }) {
  return <>{children}</>;
}
