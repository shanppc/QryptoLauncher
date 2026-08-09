// app/about/page.js

import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata = buildMetadata({
  title: "About QryptoLauncher — No-Code Token & NFT Deployment on Base",
  description:
    "QryptoLauncher is a non-custodial, no-code platform for deploying ERC20 tokens and ERC721 NFT collections on Base. Learn how it works and why it's built the way it is.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">About QryptoLauncher</h1>

      <p className="mb-4 text-lg text-slate-300">
        QryptoLauncher exists to remove the technical wall between a good
        token or NFT idea and a live smart contract. You don't need to know
        Solidity, set up Hardhat, or run an IPFS node — you connect a wallet,
        fill in a form, and deploy directly to the Base network.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-3">Why we built this</h2>
      <p className="mb-4 text-slate-300">
        Deploying a smart contract has traditionally required real
        engineering effort: writing and testing Solidity, wiring up a
        deployment framework, formatting NFT metadata to the correct
        standard, and pinning assets to IPFS by hand. That barrier keeps a
        lot of legitimate projects — community tokens, small NFT drops,
        internal experiments — from ever shipping. QryptoLauncher takes the
        repetitive, error-prone parts of that process and turns them into a
        guided flow.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-3">How it works</h2>
      <ol className="list-decimal list-inside space-y-2 text-slate-300 mb-4">
        <li>
          <strong>Connect your wallet.</strong> QryptoLauncher uses your
          browser wallet (MetaMask) — there's no account to create and no
          email to hand over.
        </li>
        <li>
          <strong>Configure your contract.</strong> Set a token's name,
          symbol, and supply, or a collection's name, description, and
          media, entirely in-browser.
        </li>
        <li>
          <strong>Deploy onchain.</strong> Your configuration is sent to an
          audited, OpenZeppelin-based factory contract, which deploys a new
          instance and mints it directly to your wallet in a single
          transaction.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-10 mb-3">
        Non-custodial by design
      </h2>
      <p className="mb-4 text-slate-300">
        QryptoLauncher never takes ownership of what you deploy. 100% of an
        ERC20 token's initial supply, and full owner/minter control of an
        ERC721 collection, go straight to the wallet that signed the
        deployment transaction. We don't hold private keys, custody funds,
        or retain any special admin rights over your contract.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-3">
        Built on proven standards
      </h2>
      <p className="mb-4 text-slate-300">
        Every contract deployed through QryptoLauncher is based on
        OpenZeppelin's ERC20 and ERC721 implementations — the same base
        contracts used across most of the Ethereum ecosystem — deployed
        through factory contracts on Base. NFT collections are automatically
        pinned to IPFS and structured to match the standard metadata schema
        that wallets, marketplaces, and explorers expect.
      </p>

      <h2 className="text-xl font-semibold mt-10 mb-3">Where it runs</h2>
      <p className="mb-4 text-slate-300">
        QryptoLauncher supports Base Mainnet for production deployments and
        Sepolia Testnet for testing configurations before you spend real
        gas. You can switch networks from the header at any time.
      </p>

      <p className="mt-10 text-slate-400 text-sm">
        Questions about how a specific part of the flow works? Check the{" "}
        <a href="/faq" className="underline">
          FAQ
        </a>
        , or review the{" "}
        <a href="/disclaimer" className="underline">
          disclaimer
        </a>{" "}
        for the risks involved in deploying and holding onchain assets.
      </p>
    </main>
  );
}
