"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseUnits, parseEventLogs, formatEther } from "viem";
import { erc20Factory, Erc20FactoryAbi } from "@/lib/contracts";
import { parseContractError } from "@/lib/errors";
import { SUPPORTED_CHAINS } from "@/lib/chains";
import { Card, Field, StatusBanner, inputClass } from "@/components/ui";
import { trackEvent } from "@/utils/track";

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

  // --- Tracking refs --------------------------------------------------------
  // Fires token_form_started only once per form session (reset on new deploy).
  const formStartedRef = useRef(false);
  // Captures form.symbol before the form is cleared, so the success event
  // always has the correct value even after setForm(EMPTY) runs.
  const pendingSymbolRef = useRef("");
  // Fires token_deployment_success only once per successful receipt.
  const deploySuccessFiredRef = useRef(false);
  // Fires token_deployment_failed (confirmation stage) only once per waitError.
  const waitErrorFiredRef = useRef(false);

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

  // --- token_deployment_success --------------------------------------------
  useEffect(() => {
    if (
      receipt &&
      receipt.status !== "reverted" &&
      tokenAddress &&
      !deploySuccessFiredRef.current
    ) {
      deploySuccessFiredRef.current = true;
      trackEvent("token_deployment_success", {
        token_symbol: pendingSymbolRef.current,
        contract_address: tokenAddress,
        tx_hash: receipt.transactionHash,
      });
    }
  }, [receipt, tokenAddress]);

  // --- token_deployment_failed (confirmation stage) ------------------------
  useEffect(() => {
    if (waitError && !waitErrorFiredRef.current) {
      waitErrorFiredRef.current = true;
      trackEvent("token_deployment_failed", {
        error_reason: String(waitError?.message ?? waitError).slice(0, 200),
        stage: "confirmation",
      });
    }
  }, [waitError]);

  const busy = status === "signature" || status === "pending";

  // Wraps the existing update helper and fires token_form_started once.
  function fireFormStarted() {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackEvent("token_form_started");
    }
  }

  const update = (key) => (e) => {
    fireFormStarted();
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  function fail(msg) {
    setLocalError(msg);
    setPhase("error");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setTxHash(undefined);
    // Reset per-tx tracking guards for new attempt.
    deploySuccessFiredRef.current = false;
    waitErrorFiredRef.current = false;

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
      // Snapshot symbol before the form is cleared.
      pendingSymbolRef.current = form.symbol.trim();
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
      // Allow token_form_started to fire again on next form session.
      formStartedRef.current = false;
    } catch (err) {
      // --- token_deployment_failed (signature stage) -----------------------
      trackEvent("token_deployment_failed", {
        error_reason: String(err?.message ?? err).slice(0, 200),
        stage: "signature",
      });
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
              onFocus={fireFormStarted}
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
              onFocus={fireFormStarted}
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
              onFocus={fireFormStarted}
              disabled={busy}
              placeholder="1000000"
              className={inputClass}
            />
          </Field>

          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-sm">
            <span className="text-zinc-400">Service Fee</span>
            <span className="font-mono font-medium text-violet-300">
              {fee !== undefined ? `${formatEther(fee)} ETH` : "Loading..."}
            </span>
          </div>

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
