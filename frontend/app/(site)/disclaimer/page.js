// app/disclaimer/page.js

import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata = buildMetadata({
  title: "Disclaimer — QryptoLauncher",
  description:
    "Important risk disclosures for anyone deploying or holding tokens and NFTs created with QryptoLauncher. Not financial, legal, or tax advice.",
  path: "/disclaimer",
});

const LAST_UPDATED = "August 9, 2026";

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Disclaimer</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-slate-300">
        <p>
          Please read this page carefully before using QryptoLauncher to
          deploy a token or NFT collection. It explains the risks involved
          in using onchain deployment tools and public blockchains.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">Not Financial, Legal, or Tax Advice</h2>
          <p>
            Nothing on this site, in the app, or in any related
            documentation constitutes financial, investment, legal, or tax
            advice. QryptoLauncher is deployment tooling only. Whether to
            create, buy, sell, or hold any token or NFT is your decision,
            and you should consult a qualified professional before making
            financial decisions involving digital assets.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">No Guarantee of Value</h2>
          <p>
            Creating a token or NFT collection through QryptoLauncher does
            not create, imply, or guarantee any market, liquidity, or
            value for that asset. Any token or NFT you deploy may have no
            market whatsoever, and its value, if any, can go to zero.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Smart Contract Risk</h2>
          <p>
            While the underlying factory contracts are based on audited
            OpenZeppelin implementations and are deployed and verified on
            Basescan and Etherscan, no smart contract can be guaranteed
            free of bugs, exploits, or unintended behavior. Interacting
            with any smart contract, including ours, carries inherent
            technical risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Irreversibility</h2>
          <p>
            Blockchain transactions cannot be reversed, cancelled, or
            refunded once confirmed. This includes contract deployments,
            token transfers, NFT mints, and any fees paid. Always verify
            transaction details in your wallet before signing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Wallet and Key Security</h2>
          <p>
            You are solely responsible for the security of your wallet,
            private keys, and seed phrase. QryptoLauncher never has access
            to your keys and cannot recover funds lost due to compromised
            wallets, phishing, or user error.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Market and Regulatory Risk</h2>
          <p>
            Digital assets are volatile and lightly regulated in many
            jurisdictions, and regulations are evolving. Depending on how a
            token or NFT is structured and marketed, it may be subject to
            securities or other financial regulations in your jurisdiction.
            You are responsible for ensuring your use of the Service and
            any assets you create comply with applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Third-Party and IPFS Content</h2>
          <p>
            NFT media and metadata are stored on IPFS via Pinata and are
            publicly accessible once pinned. QryptoLauncher does not review
            or moderate uploaded content and is not responsible for content
            uploaded by users of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">No Liability for Losses</h2>
          <p>
            To the maximum extent permitted by law, QryptoLauncher and its
            contributors are not liable for any financial loss, lost funds,
            lost tokens, or damages resulting from your use of the Service,
            including losses caused by smart contract behavior, network
            congestion, gas price volatility, or third-party service
            outages.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Do Your Own Research</h2>
          <p>
            Before deploying, buying, or interacting with any token or NFT
            — whether created through QryptoLauncher or elsewhere — do your
            own research and consider seeking independent professional
            advice.
          </p>
        </section>

        <p className="text-sm text-slate-500 pt-6 border-t border-slate-800">
          This disclaimer works alongside our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          . It is a general template, not legal advice — consult a
          qualified lawyer for guidance specific to your situation.
        </p>
      </div>
    </main>
  );
}
