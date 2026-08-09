// app/erc721/layout.js
import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata = buildMetadata({
  title: "Create ERC721 NFT Collection on Base — QryptoLauncher",
  description:
    "Deploy custom ERC721 NFT collections on Base. Automatic artwork and metadata pinning to IPFS with full ownership control.",
  path: "/erc721",
});

export default function Erc721Layout({ children }) {
  return <>{children}</>;
}
