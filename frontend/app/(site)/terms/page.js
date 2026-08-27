// app/terms/page.js

import { buildMetadata } from "@/lib/seo/buildMetadata";

export const metadata = buildMetadata({
  title: "Terms of Service — QryptoLauncher",
  description:
    "The terms governing your use of QryptoLauncher, a non-custodial platform for deploying ERC20 tokens and ERC721 NFT collections on Base.",
  path: "/terms",
});

const LAST_UPDATED = "August 9, 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-slate-300">
        <p>
          These Terms of Service ("Terms") govern your access to and use of
          QryptoLauncher (the "Service"), a web application that allows
          users to configure and deploy ERC20 token and ERC721 NFT
          collection smart contracts on the Base network. By connecting a
          wallet and using the Service, you agree to these Terms. If you do
          not agree, do not use the Service.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. Nature of the Service</h2>
          <p>
            QryptoLauncher is a frontend interface to smart contracts
            ("Factory Contracts") deployed on public blockchains. We do not
            operate a bank, exchange, broker-dealer, or custodian. The
            Service helps you construct and submit transactions; you sign
            and broadcast every transaction yourself through your own
            wallet, and you retain full control over any contract you
            deploy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
          <p>
            You must be legally able to enter into a binding agreement in
            your jurisdiction to use the Service, and you must not be
            located in, or a resident of, any jurisdiction where use of the
            Service would violate applicable law. You are solely
            responsible for determining whether use of the Service is
            legal where you are located.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. No Custody, No Account</h2>
          <p>
            The Service does not require account registration and does not
            take custody of your funds, tokens, or private keys at any
            point. All deployments are non-custodial: token supply and
            contract ownership go directly to the wallet address that signs
            the deployment transaction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Fees</h2>
          <p>
            Deploying a contract through the Service requires payment of
            network gas fees to the underlying blockchain, and, for ERC20
            deployments, a protocol fee currently set at 0.00027 ETH. Fees
            are displayed before you confirm a transaction and are paid
            directly from your wallet; QryptoLauncher does not process or
            hold payment on your behalf. All fees are non-refundable once a
            transaction has confirmed onchain.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Your Responsibilities</h2>
          <p>You are solely responsible for:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Securing your wallet, private keys, and seed phrase.</li>
            <li>
              Reviewing and understanding every transaction before signing
              it — deployments are permanent and cannot be reversed.
            </li>
            <li>
              The accuracy of any information you configure (token name,
              symbol, supply, NFT metadata, images) and the content of any
              media you upload.
            </li>
            <li>
              Complying with applicable laws relating to the tokens or NFTs
              you create, including securities, tax, and consumer
              protection laws in your jurisdiction.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Prohibited Use</h2>
          <p>You may not use the Service to create or distribute tokens or NFTs that:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Infringe on the intellectual property or rights of others.</li>
            <li>Are fraudulent, deceptive, or designed to facilitate a scam.</li>
            <li>Violate applicable securities, sanctions, or anti-money-laundering laws.</li>
            <li>Contain unlawful, defamatory, or abusive content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Third-Party Services</h2>
          <p>
            The Service integrates third-party infrastructure, including
            wallet providers (e.g. MetaMask), blockchain networks (Base,
            and Ethereum testnets), and IPFS pinning services (Pinata).
            QryptoLauncher does not control and is not responsible for the
            availability, performance, or security of these third-party
            services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">8. Intellectual Property</h2>
          <p>
            The Service's interface, branding, and non-open-source code are
            owned by QryptoLauncher. Open-source components are governed by
            their respective licenses, as noted in the project repository.
            You retain ownership of any content you upload, subject to the
            license terms of the storage providers (e.g. IPFS/Pinata) used
            to host it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT
            WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, OR NON-INFRINGEMENT. We do not warrant that the
            Service will be uninterrupted, error-free, or secure, or that
            any smart contract deployed through it is free of defects. See
            also the{" "}
            <a href="/disclaimer" className="underline">
              Disclaimer
            </a>{" "}
            page for risk-specific disclosures.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, QRYPTOLAUNCHER AND ITS
            CONTRIBUTORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
            FUNDS, TOKENS, OR DATA, ARISING FROM YOUR USE OF THE SERVICE OR
            ANY SMART CONTRACT DEPLOYED THROUGH IT, EVEN IF ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGES.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">11. Indemnification</h2>
          <p>
            You agree to indemnify and hold QryptoLauncher and its
            contributors harmless from any claim or demand arising out of
            your use of the Service, your violation of these Terms, or any
            token or collection you deploy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">12. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes
            will be reflected by an updated "Last updated" date above.
            Continued use of the Service after changes are posted
            constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">13. Contact</h2>
          <p>
            Questions about these Terms can be directed through the
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
          advice. Consult a qualified lawyer to confirm these Terms meet
          the requirements of the jurisdictions where you operate.
        </p>
      </div>
    </main>
  );
}
