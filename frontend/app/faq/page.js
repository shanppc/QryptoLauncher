// app/faq/page.js

import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata = buildMetadata({
  title: "FAQ — QryptoLauncher",
  description:
    "Answers to common questions about deploying ERC20 tokens and ERC721 NFT collections with QryptoLauncher, including fees, custody, supported networks, and security.",
  path: "/faq",
});

const faqs = [
  {
    q: "What is QryptoLauncher?",
    a: "QryptoLauncher is a no-code web application for deploying ERC20 tokens and ERC721 NFT collections on Base. You configure your contract in a browser form, connect a wallet, and deploy directly onchain — no Solidity or deployment tooling required.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. The entire flow — token or collection setup, image uploads, metadata generation, and deployment — is handled through the interface. You only need a browser wallet and enough ETH on Base to cover gas and the protocol fee.",
  },
  {
    q: "Does QryptoLauncher take custody of my tokens or collection?",
    a: "No. QryptoLauncher is non-custodial. 100% of an ERC20 token's initial supply is minted to your wallet, and ownership/minting rights of an ERC721 collection go directly to the wallet that deployed it. We never hold your private keys or funds.",
  },
  {
    q: "What does it cost to deploy?",
    a: "Deploying an ERC20 token currently carries a fixed protocol fee of 0.00027 ETH, plus standard Base network gas. NFT collection deployment costs depend on your configuration (supply, metadata size) plus gas. Exact costs are shown in the app before you confirm a transaction.",
  },
  {
    q: "Which networks are supported?",
    a: "Base Mainnet for live deployments, and Sepolia Testnet for testing your configuration before spending real funds. You can switch networks from the header at any time.",
  },
  {
    q: "What wallet do I need?",
    a: "QryptoLauncher currently supports MetaMask as a browser-injected wallet provider. Make sure it's installed and set to the correct network (Base Mainnet or Sepolia) before deploying.",
  },
  {
    q: "How is NFT metadata and image storage handled?",
    a: "When you create an ERC721 collection, uploaded images are pinned to IPFS through Pinata, and QryptoLauncher automatically generates standards-compliant metadata JSON for each token, with a base URI pointing to your IPFS content.",
  },
  {
    q: "Are the smart contracts audited or verified?",
    a: "The factory contracts are built on OpenZeppelin's audited ERC20 and ERC721 base implementations and are deployed and verified on Basescan and Etherscan, so you can review the exact bytecode and source before interacting with them. Contract addresses are listed in the project's GitHub repository.",
  },
  {
    q: "Can I mint more NFTs after deploying a collection?",
    a: "Yes, up to the maximum supply cap you set at deployment. Minting after deployment is controlled by the collection owner (your wallet) through the dashboard.",
  },
  {
    q: "Where can I see everything I've deployed?",
    a: "The dashboard indexes all tokens and collections deployed from your connected wallet, with direct links to view each contract on Basescan or Etherscan.",
  },
  {
    q: "Is deploying a token or NFT collection reversible?",
    a: "No. Blockchain transactions are permanent once confirmed. Double-check your configuration — name, symbol, supply, metadata — before submitting a deployment transaction, since it cannot be edited or undone afterward.",
  },
  {
    q: "Is this financial advice or a guarantee of value?",
    a: "No. QryptoLauncher is deployment tooling only. It doesn't provide financial, legal, or investment advice, and creating a token or NFT collection doesn't guarantee it will have any value or market. See the disclaimer for details.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <p className="mb-10 text-slate-300">
        Common questions about deploying and managing tokens and NFT
        collections with QryptoLauncher. If you don't see what you're
        looking for, see the{" "}
        <a href="/about" className="underline">
          about page
        </a>{" "}
        or the{" "}
        <a href="/disclaimer" className="underline">
          disclaimer
        </a>
        .
      </p>

      <div className="space-y-8">
        {faqs.map((item) => (
          <div key={item.q}>
            <h2 className="text-lg font-semibold mb-2">{item.q}</h2>
            <p className="text-slate-300">{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
