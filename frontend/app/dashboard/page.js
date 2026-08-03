"use client";

import { useAccount, useChainId, useReadContract, useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import {
  erc20Factory,
  erc721Factory,
  Erc20TokenAbi,
  Erc721TokenAbi,
} from "@/lib/contracts";
import { SUPPORTED_CHAINS } from "@/lib/chains";
import { Card } from "@/components/ui";

// Per-item fields we batch through multicall
const ERC20_FIELDS = ["name", "symbol", "totalSupply"];
const ERC721_FIELDS = ["name", "symbol", "maxSupply", "totalMinted"];

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function Stat({ label, value, loading }) {
  return (
    <Card>
      <p className="text-sm text-zinc-400">{label}</p>
      {loading ? (
        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-white/10" />
      ) : (
        <p className="mt-1 text-3xl font-semibold text-zinc-100">
          {value ?? "—"}
        </p>
      )}
    </Card>
  );
}

function AddressLink({ address, explorerUrl }) {
  if (!explorerUrl) {
    return <span className="font-mono text-xs text-zinc-500">{address}</span>;
  }
  return (
    <a
      href={`${explorerUrl}/address/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-violet-400 underline-offset-2 hover:underline"
    >
      {address.slice(0, 10)}...{address.slice(-8)}
    </a>
  );
}

function ItemList({ title, empty, loading, items, columns, explorerUrl }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-zinc-100">{title}</h2>
      {loading ? (
        <div className="flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <p className="text-sm text-zinc-500">{empty}</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-zinc-400">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-2.5 font-medium">
                    {c}
                  </th>
                ))}
                <th className="px-4 py-2.5 font-medium">Address</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.address}
                  className="border-t border-white/5 text-zinc-300"
                >
                  {item.cells.map((cell, i) => (
                    <td key={i} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <AddressLink
                      address={item.address}
                      explorerUrl={explorerUrl}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const factory20 = erc20Factory(chainId);
  const factory721 = erc721Factory(chainId);
  const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
  const explorerUrl = chain?.blockExplorers?.default?.url;
  const supported = Boolean(factory20 && factory721);

  // ---- totals -------------------------------------------------------------
  const { data: total20, isLoading: loadingTotal20 } = useReadContract({
    ...factory20,
    functionName: "totalTokensDeployed",
    query: { enabled: supported },
  });

  const { data: allCollections, isLoading: loadingTotal721 } = useReadContract({
    ...factory721,
    functionName: "getAllCollections",
    query: { enabled: supported },
  });

  // ---- the user's deployments --------------------------------------------
  const { data: myTokens, isLoading: loadingMyTokens } = useReadContract({
    ...factory20,
    functionName: "getTokensByUser",
    args: [address],
    query: { enabled: supported && Boolean(address) },
  });

  const { data: myCollections, isLoading: loadingMyCollections } =
    useReadContract({
      ...factory721,
      functionName: "getCollectionsByUser",
      args: [address],
      query: { enabled: supported && Boolean(address) },
    });

  // ---- batched per-item reads (multicall, not one call per item) ----------
  const { data: tokenData, isLoading: loadingTokenData } = useReadContracts({
    contracts: (myTokens ?? []).flatMap((token) =>
      ERC20_FIELDS.map((functionName) => ({
        address: token,
        abi: Erc20TokenAbi,
        functionName,
      }))
    ),
    query: { enabled: (myTokens ?? []).length > 0 },
  });

  const { data: collectionData, isLoading: loadingCollectionData } =
    useReadContracts({
      contracts: (myCollections ?? []).flatMap((collection) =>
        ERC721_FIELDS.map((functionName) => ({
          address: collection,
          abi: Erc721TokenAbi,
          functionName,
        }))
      ),
      query: { enabled: (myCollections ?? []).length > 0 },
    });

  const tokenRows = chunk(tokenData ?? [], ERC20_FIELDS.length).map(
    (group, i) => {
      const [name, symbol, supply] = group.map((r) => r?.result);
      return {
        address: (myTokens ?? [])[i],
        cells: [
          name ?? "—",
          symbol ?? "—",
          supply === undefined ? "—" : formatUnits(supply, 18),
        ],
      };
    }
  );

  const collectionRows = chunk(collectionData ?? [], ERC721_FIELDS.length).map(
    (group, i) => {
      const [name, symbol, maxSupply, minted] = group.map((r) => r?.result);
      return {
        address: (myCollections ?? [])[i],
        cells: [
          name ?? "—",
          symbol ?? "—",
          maxSupply === undefined ? "—" : String(maxSupply),
          minted === undefined ? "—" : String(minted),
        ],
      };
    }
  );

  if (!supported) {
    return (
      <Card>
        <p className="text-sm text-amber-300">
          This network isn&apos;t supported. Switch to{" "}
          {SUPPORTED_CHAINS[0].name} using the selector in the header.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Everything launched through Qrypto Launcher on {chain?.name}.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <Stat
          label="Total ERC20 deployed"
          value={total20 === undefined ? undefined : String(total20)}
          loading={loadingTotal20}
        />
        <Stat
          label="Total ERC721 deployed"
          value={allCollections ? String(allCollections.length) : undefined}
          loading={loadingTotal721}
        />
      </section>

      {!isConnected ? (
        <Card>
          <p className="text-sm text-zinc-400">
            Connect your wallet to see your own deployments.
          </p>
        </Card>
      ) : (
        <>
          <ItemList
            title="My ERC20s"
            empty="You haven't deployed any tokens yet."
            loading={loadingMyTokens || loadingTokenData}
            items={tokenRows}
            columns={["Name", "Symbol", "Supply"]}
            explorerUrl={explorerUrl}
          />

          <ItemList
            title="My NFT Collections"
            empty="You haven't deployed any collections yet."
            loading={loadingMyCollections || loadingCollectionData}
            items={collectionRows}
            columns={["Name", "Symbol", "Max supply", "Minted"]}
            explorerUrl={explorerUrl}
          />
        </>
      )}
    </div>
  );
}
