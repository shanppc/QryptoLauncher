// app/privacy/page.js

import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata = buildMetadata({
  title: "Privacy Policy — QryptoLauncher",
  description:
    "How QryptoLauncher handles data: what's collected, what's public onchain, which third parties are involved, and what choices you have.",
  path: "/privacy",
});

const LAST_UPDATED = "August 9, 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-slate-300">
        <p>
          QryptoLauncher is designed to collect as little personal data as
          possible. This policy explains what information the Service
          interacts with, what's stored where, and the third parties
          involved.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Information We Don't Collect</h2>
          <p>
            We do not require account registration, do not ask for your
            name or email to use the core deployment features, and never
            have access to your private keys or wallet seed phrase. Your
            wallet's private keys never leave your device or wallet
            extension.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Information We Do Interact With</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Wallet address:</strong> When you connect a wallet,
              your public wallet address is used to read your token/NFT
              balances and to populate the dashboard. This address is
              already public information on the blockchain.
            </li>
            <li>
              <strong>Onchain transaction data:</strong> Any transaction
              you sign (deployments, mints, transfers) is broadcast to a
              public blockchain (Base or Sepolia) and is permanently
              visible to anyone, independent of QryptoLauncher.
            </li>
            <li>
              <strong>Uploaded media and metadata:</strong> Images and
              metadata you upload when creating an NFT collection are sent
              to Pinata for IPFS pinning and become publicly retrievable
              via IPFS, as is standard for onchain NFT metadata.
            </li>
            <li>
              <strong>Basic technical data:</strong> Standard web request
              data (such as IP address and browser type) may be logged
              temporarily by our hosting provider for security and
              performance purposes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Third-Party Services</h2>
          <p>The Service relies on the following third parties, each governed by their own privacy policy:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              <strong>MetaMask</strong> (wallet connection) — you interact
              with MetaMask directly; we never see your keys.
            </li>
            <li>
              <strong>Pinata</strong> (IPFS pinning for NFT media and
              metadata) — files you upload are transmitted to Pinata's API
              via a server-side signed request.
            </li>
            <li>
              <strong>Blockchain RPC providers</strong> (e.g. Alchemy) —
              used to read and submit onchain data for Base and Sepolia.
            </li>
            <li>
              <strong>Hosting/analytics provider</strong> (e.g. Vercel) —
              may collect basic, aggregated usage analytics to help us
              understand traffic and performance.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
          <p>
            The Service may use minimal, functional cookies or local
            storage to remember basic preferences (such as selected
            network). We do not use cookies for third-party advertising.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
          <p>
            Onchain data (transactions, deployed contracts, NFT metadata on
            IPFS) is permanent and cannot be deleted by us or by you, by
            the nature of public blockchains and content-addressed storage.
            Any server-side logs are retained only as long as needed for
            security and debugging purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Your Choices</h2>
          <p>
            You can disconnect your wallet from the Service at any time
            from your wallet extension. Because the core functionality
            requires no account, there is no personal profile to request
            deletion of beyond standard browser data (cookies, local
            storage), which you can clear through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
          <p>
            The Service is not directed at, and should not be used by,
            anyone under the age of 18.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material
            changes will be reflected by an updated "Last updated" date
            above.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
          <p>
            Questions about this policy can be directed through the
            project's{" "}
            <a
              href="https://github.com/shanppc/QryptoLauncher"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub repository
            </a>
            .
          </p>
        </section>

        <p className="text-sm text-slate-500 pt-6 border-t border-slate-800">
          This page is a general template and does not constitute legal
          advice. Consult a qualified lawyer to confirm this policy meets
          the requirements of the jurisdictions where you and your users
          are located (e.g. GDPR, CCPA).
        </p>
      </div>
    </main>
  );
}
