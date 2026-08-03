import Link from "next/link";

const FEATURES = [
  {
    title: "ERC20 Tokens",
    body: "Name it, pick a symbol, set the supply. Your token is deployed straight from your wallet.",
  },
  {
    title: "ERC721 Collections",
    body: "Upload one artwork, set a max supply, and metadata is pinned to IPFS automatically.",
  },
  {
    title: "You stay the owner",
    body: "Contracts are deployed by your address. No custody, no middleman, no hidden admin keys.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <section className="mx-auto max-w-3xl pt-10 text-center">
        <p className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
          Live on Sepolia
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Launch your token in{" "}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            minutes
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
          Deploy ERC20 tokens and ERC721 NFT collections without writing a
          single line of Solidity.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/erc20"
            className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
          >
            Launch ERC20
          </Link>
          <Link
            href="/erc721"
            className="rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/10"
          >
            Launch ERC721
          </Link>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h2 className="mb-2 font-semibold text-zinc-100">{f.title}</h2>
            <p className="text-sm leading-relaxed text-zinc-400">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
