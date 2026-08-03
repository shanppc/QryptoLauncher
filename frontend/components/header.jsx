"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { SUPPORTED_CHAINS } from "@/lib/chains";
import { useIsMounted } from "@/lib/useIsMounted";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/erc20", label: "ERC20" },
  { href: "/erc721", label: "ERC721" },
  { href: "/dashboard", label: "Dashboard" },
];

function shorten(addr) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

export function Header() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, isPending: connecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();

  // gate wallet-dependent UI so SSR and first client render match
  const mounted = useIsMounted();

  const unsupported =
    isConnected && !SUPPORTED_CHAINS.some((c) => c.id === chainId);

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0f]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          <span className="text-violet-400">Qrypto</span>Launcher
        </Link>

        <nav className="flex items-center gap-1 text-sm" aria-label="Main">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="network-select" className="sr-only">
            Select network
          </label>
          <select
            id="network-select"
            value={SUPPORTED_CHAINS.some((c) => c.id === chainId) ? chainId : ""}
            disabled={!mounted || switching}
            onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-zinc-200 disabled:opacity-50"
          >
            {unsupported && <option value="">Unsupported network</option>}
            {SUPPORTED_CHAINS.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0a0a0f]">
                {c.name}
              </option>
            ))}
          </select>

          {!mounted ? (
            <div className="h-8 w-28 animate-pulse rounded-md bg-white/5" />
          ) : isConnected ? (
            <button
              type="button"
              onClick={() => disconnect()}
              title={address}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-200 hover:bg-white/10"
            >
              {shorten(address)}
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                connect({ connector: injected({ target: "metaMask" }) })
              }
              disabled={connecting}
              className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-60"
            >
              {connecting ? "Connecting..." : "Connect MetaMask"}
            </button>
          )}
        </div>
      </div>

      {mounted && unsupported && (
        <p className="bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300">
          Wrong network. Switch to {SUPPORTED_CHAINS[0].name} to continue.
        </p>
      )}
    </header>
  );
}
