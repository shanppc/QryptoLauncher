"use client";

import { useMemo, useState } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseUnits, parseEventLogs } from "viem";
import { erc20Factory, Erc20FactoryAbi } from "@/lib/contracts";
import { parseContractError } from "@/lib/errors";
import { SUPPORTED_CHAINS } from "@/lib/chains";
import { Card, Field, StatusBanner, inputClass } from "@/components/ui";

const EMPTY = { name: "", symbol: "", supply: "" };

export default function Erc20Page() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const contract = erc20Factory(chainId);
  const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
  const explorerUrl = chain?.blockExplorers?.default?.url;

  const [form, setForm] = useState(EMPTY);
  // what the user initiated: idle | signature | submitted | error
  const [phase, setPhase] = useState("idle");
  const [localError, setLocalError] = useState("");
  const [txHash, setTxHash] = useState(undefined);

  // fee is fetched and sent as msg.value, but never displayed
  const { data: fee } = useReadContract({
    ...contract,
    functionName: "fee",
    query: { enabled: Boolean(contract) },
  });

  const { writeContractAsync } = useWriteContract();
  const { data: receipt, error: waitError } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Derive UI state during render instead of syncing it in an effect.
  const { status, message } = useMemo(() => {
    if (phase === "error") return { status: "error", message: localError };

    if (phase === "submitted") {
      if (waitError) {
        return { status: "error", message: parseContractError(waitError) };
      }
      if (receipt?.status === "reverted") {
        return { status: "error", message: "Transaction reverted on chain." };
      }
      if (receipt) return { status: "success", message: "Token deployed." };
      return {
        status: "pending",
        message: "Transaction submitted, waiting for confirmation...",
      };
    }

    if (phase === "signature") {
      return {
        status: "signature",
        message: "Confirm the transaction in MetaMask...",
      };
    }

    return { status: "idle", message: "" };
  }, [phase, localError, receipt, waitError]);

  const tokenAddress = useMemo(() => {
    if (!receipt || receipt.status === "reverted") return "";
    try {
      const [log] = parseEventLogs({
        abi: Erc20FactoryAbi,
        eventName: "TokenCreated",
        logs: receipt.logs,
      });
      return log?.args?.tokenAddress ?? "";
    } catch {
      return "";
    }
  }, [receipt]);

  const busy = status === "signature" || status === "pending";

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function fail(msg) {
    setLocalError(msg);
    setPhase("error");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTxHash(undefined);

    if (!contract) {
      fail("This network is not supported. Switch networks and retry.");
      return;
    }

    const supply = form.supply.trim();
    if (!/^\d+(\.\d+)?$/.test(supply) || Number(supply) <= 0) {
      fail("Initial supply must be a number greater than zero.");
      return;
    }

    const args = [form.name.trim(), form.symbol.trim(), parseUnits(supply, 18)];

    try {
      setPhase("signature");
      const hash = await writeContractAsync({
        ...contract,
        functionName: "createToken",
        args,
        value: fee ?? 0n,
      });

      setTxHash(hash);
      setPhase("submitted");
      setForm(EMPTY);
    } catch (err) {
      fail(parseContractError(err));
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-bold tracking-tight">
        Launch an ERC20 token
      </h1>
      <p className="mt-2 mb-8 text-zinc-400">
        Deployed from your wallet. The full supply is minted to your address.
      </p>

      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <Field label="Token name">
            <input
              required
              value={form.name}
              onChange={update("name")}
              disabled={busy}
              placeholder="My Token"
              className={inputClass}
            />
          </Field>

          <Field label="Symbol">
            <input
              required
              value={form.symbol}
              onChange={update("symbol")}
              disabled={busy}
              placeholder="MTK"
              maxLength={11}
              className={inputClass}
            />
          </Field>

          <Field
            label="Initial supply"
            hint="Whole tokens. 18 decimals are applied for you."
          >
            <input
              required
              inputMode="decimal"
              value={form.supply}
              onChange={update("supply")}
              disabled={busy}
              placeholder="1000000"
              className={inputClass}
            />
          </Field>

          <button
            type="submit"
            disabled={busy || !isConnected}
            className="mt-1 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!isConnected
              ? "Connect your wallet to continue"
              : busy
                ? "Deploying..."
                : "Deploy token"}
          </button>

          <StatusBanner
            status={status}
            message={message}
            txHash={txHash}
            explorerUrl={explorerUrl}
          />

          {tokenAddress && (
            <p className="break-all text-sm text-zinc-400">
              Token address:{" "}
              <span className="font-mono text-zinc-200">{tokenAddress}</span>
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
