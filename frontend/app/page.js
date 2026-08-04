import Link from "next/link";

const NETWORK_STATUS = [
  {
    network: "Sepolia Testnet",
    status: "Available now",
    isAvailable: true,
    copy: "Use test ETH. Testnet assets have no real-world value.",
  },
  {
    network: "Ethereum Mainnet",
    status: "Planned",
    isAvailable: false,
    copy: "Mainnet support will be announced when it is ready.",
  },
];

const CREATION_PATHS = [
  {
    title: "Create an ERC20 token",
    copy: "Set a name, symbol, and initial supply. The full supply is minted to your connected wallet.",
    linkLabel: "Launch ERC20",
    href: "/erc20",
  },
  {
    title: "Create an NFT collection",
    copy: "Add shared artwork, a description, and a maximum supply. Metadata is pinned to IPFS for your collection.",
    linkLabel: "Create ERC721",
    href: "/erc721",
  },
  {
    title: "Manage your launches",
    copy: "View contracts created through Qrypto Launcher and open their addresses in the block explorer.",
    linkLabel: "Open dashboard",
    href: "/dashboard",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect your wallet",
    copy: "Use MetaMask on the Sepolia testnet.",
  },
  {
    step: "02",
    title: "Choose what to create",
    copy: "Start an ERC20 token or an ERC721 collection.",
  },
  {
    step: "03",
    title: "Add the essentials",
    copy: "Enter your token details, or add collection artwork and metadata.",
  },
  {
    step: "04",
    title: "Confirm and track",
    copy: "Review the transaction in your wallet, then find the resulting contract in your dashboard.",
  },
];

const TRANSPARENCY_BULLETS = [
  "ERC20 supply is minted to the deployer wallet.",
  "NFT images and generated metadata are stored through IPFS.",
  "Contract addresses and transactions can be inspected in the network explorer.",
];

const FAQS = [
  {
    question: "Do I need to know Solidity?",
    answer:
      "No. The app guides you through the deployment inputs and wallet confirmation.",
  },
  {
    question: "What do I need before launching?",
    answer: "A browser wallet with MetaMask support and Sepolia test ETH.",
  },
  {
    question: "Who receives an ERC20 token's supply?",
    answer:
      "The full initial supply is minted to the wallet that deploys the token.",
  },
  {
    question: "What does an NFT collection include?",
    answer:
      "A shared image, description, IPFS-hosted metadata, a maximum supply, and creator-controlled minting.",
  },
  {
    question: "What will a deployment cost?",
    answer:
      "Review the transaction cost shown in your wallet before confirming. Use test ETH while Sepolia is the supported network.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* 1. Hero */}
      <section className="mx-auto max-w-3xl pt-6 text-center md:pt-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Available on Sepolia testnet
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Create, test, and prepare your{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-fuchsia-400 bg-clip-text text-transparent">
            token launch.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Create ERC20 tokens and ERC721 collections without writing Solidity.
          Ethereum mainnet support is planned.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/erc20"
            className="rounded-lg bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 hover:shadow-violet-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Launch ERC20 on Sepolia
          </Link>
          <Link
            href="/erc721"
            className="rounded-lg border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-zinc-100 transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Create ERC721 collection
          </Link>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          You need MetaMask and Sepolia test ETH to deploy.
        </p>
      </section>

      {/* 2. Network Status */}
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur sm:p-8">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Network availability
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {NETWORK_STATUS.map((item) => (
            <div
              key={item.network}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold text-zinc-100">
                    {item.network}
                  </span>
                  {item.isAvailable ? (
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      {item.status}
                    </span>
                  ) : (
                    <span className="rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                      {item.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. What You Can Create */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Choose your launch path
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {CREATION_PATHS.map((path) => (
            <div
              key={path.title}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-violet-500/30 hover:bg-white/[0.04]"
            >
              <div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-100">
                  {path.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {path.copy}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <Link
                  href={path.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
                >
                  {path.linkLabel}
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="scroll-mt-24 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            From idea to deployed contract
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.step}
              className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <span className="mb-4 inline-block w-max rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-violet-400">
                Step {step.step}
              </span>
              <h3 className="mb-2 font-semibold text-zinc-100">{step.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {step.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Ownership and Transparency */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              Your wallet, your deployment.
            </h2>
            <p className="mt-2 text-base text-zinc-400">
              Qrypto Launcher guides the creation flow; your connected wallet
              submits the onchain transaction.
            </p>
          </div>

          <ul className="space-y-4 pt-2">
            {TRANSPARENCY_BULLETS.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                <svg
                  aria-hidden="true"
                  className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Testnet Safety Callout */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-amber-500/20 p-2 text-amber-300">
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-amber-200">
              Build responsibly on testnet.
            </h3>
            <p className="text-sm leading-relaxed text-amber-300/90">
              Sepolia is for testing. Do not use real funds, promise token
              value, or treat testnet assets as production assets. You can obtain
              test ETH from standard public Sepolia faucets (such as Google Cloud
              Sepolia Faucet or Infura Faucet).
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-xl border border-white/10 bg-white/[0.02] transition-colors [&[open]]:bg-white/[0.04]"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 text-left text-sm font-semibold text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl">
                <span>{faq.question}</span>
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="border-t border-white/5 px-5 pb-5 pt-3 text-sm leading-relaxed text-zinc-400">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-r from-violet-950/40 via-violet-900/20 to-fuchsia-950/40 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          Ready to build on Sepolia?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-300 sm:text-base">
          Connect MetaMask, use test ETH, and create your first token in a few
          guided steps.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/erc20"
            className="rounded-lg bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 hover:shadow-violet-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            Launch ERC20 on Sepolia
          </Link>
          <Link
            href="/erc721"
            className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 px-3 py-2 rounded"
          >
            Create an NFT collection
          </Link>
        </div>
      </section>
    </div>
  );
}
