"use client";

import { useMemo, useState, useEffect } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseEventLogs, isAddress } from "viem";
import {
  erc721Factory,
  Erc721FactoryAbi,
  Erc721TokenAbi,
} from "@/lib/contracts";
import { parseContractError } from "@/lib/errors";
import { SUPPORTED_CHAINS } from "@/lib/chains";
import { uploadImage, uploadMetadataFolder } from "@/lib/pinata";
import { Card, Field, StatusBanner, inputClass } from "@/components/ui";

const EMPTY_DEPLOY = { name: "", symbol: "", maxSupply: "", description: "" };
const MAX_SUPPLY_LIMIT = 5000;

export default function Erc721Page() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const contract = erc721Factory(chainId);
  const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
  const explorerUrl = chain?.blockExplorers?.default?.url;

  // Active Tab: "deploy" | "mint"
  const [activeTab, setActiveTab] = useState("deploy");

  // ---- DEPLOY COLLECTION STATE ---------------------------------------------
  const [deployForm, setDeployForm] = useState(EMPTY_DEPLOY);
  const [image, setImage] = useState(null);
  // idle | uploading | signature | submitted | error
  const [deployPhase, setDeployPhase] = useState("idle");
  const [uploadStep, setUploadStep] = useState("");
  const [deployLocalError, setDeployLocalError] = useState("");
  const [deployTxHash, setDeployTxHash] = useState(undefined);

  // ---- MINT NFT STATE ------------------------------------------------------
  const [mintCollectionAddress, setMintCollectionAddress] = useState("");
  const [mintRecipient, setMintRecipient] = useState("");
  // idle | signature | submitted | error
  const [mintPhase, setMintPhase] = useState("idle");
  const [mintLocalError, setMintLocalError] = useState("");
  const [mintTxHash, setMintTxHash] = useState(undefined);

  // Set recipient to connected address by default if empty
  useEffect(() => {
    if (address && !mintRecipient) {
      setMintRecipient(address);
    }
  }, [address, mintRecipient]);

  // fee for deployment
  const { data: fee } = useReadContract({
    ...contract,
    functionName: "fee",
    query: { enabled: Boolean(contract) },
  });

  const { writeContractAsync: writeDeployContract } = useWriteContract();
  const { data: deployReceipt, error: deployWaitError } =
    useWaitForTransactionReceipt({
      hash: deployTxHash,
    });

  const { writeContractAsync: writeMintContract } = useWriteContract();
  const { data: mintReceipt, error: mintWaitError } =
    useWaitForTransactionReceipt({
      hash: mintTxHash,
    });

  // ---- DERIVED DEPLOY UI STATE ---------------------------------------------
  const { status: deployStatus, message: deployMessage } = useMemo(() => {
    if (deployPhase === "error")
      return { status: "error", message: deployLocalError };

    if (deployPhase === "submitted") {
      if (deployWaitError) {
        return {
          status: "error",
          message: parseContractError(deployWaitError),
        };
      }
      if (deployReceipt?.status === "reverted") {
        return { status: "error", message: "Transaction reverted on chain." };
      }
      if (deployReceipt) {
        return { status: "success", message: "Collection deployed successfully!" };
      }
      return {
        status: "pending",
        message: "Transaction submitted, waiting for confirmation...",
      };
    }

    if (deployPhase === "uploading") {
      return { status: "uploading", message: uploadStep };
    }

    if (deployPhase === "signature") {
      return {
        status: "signature",
        message: "Confirm the deployment transaction in MetaMask...",
      };
    }

    return { status: "idle", message: "" };
  }, [deployPhase, deployLocalError, uploadStep, deployReceipt, deployWaitError]);

  const deployedCollectionAddress = useMemo(() => {
    if (!deployReceipt || deployReceipt.status === "reverted") return "";
    try {
      const [log] = parseEventLogs({
        abi: Erc721FactoryAbi,
        eventName: "CollectionCreated",
        logs: deployReceipt.logs,
      });
      return log?.args?.collectionAddress ?? "";
    } catch {
      return "";
    }
  }, [deployReceipt]);

  const deployBusy =
    deployStatus === "uploading" ||
    deployStatus === "signature" ||
    deployStatus === "pending";

  const updateDeploy = (key) => (e) =>
    setDeployForm((f) => ({ ...f, [key]: e.target.value }));

  function failDeploy(msg) {
    setDeployLocalError(msg);
    setDeployPhase("error");
  }

  async function onDeploySubmit(e) {
    e.preventDefault();
    setDeployTxHash(undefined);

    if (!contract) {
      failDeploy("This network is not supported. Switch networks and retry.");
      return;
    }
    if (!image) {
      failDeploy("Please choose an image for the collection.");
      return;
    }

    const max = Number(deployForm.maxSupply);
    if (!Number.isInteger(max) || max <= 0) {
      failDeploy("Max supply must be a whole number greater than zero.");
      return;
    }
    if (max > MAX_SUPPLY_LIMIT) {
      failDeploy(
        `Max supply is limited to ${MAX_SUPPLY_LIMIT} here, since one metadata file is generated per token.`
      );
      return;
    }

    const name = deployForm.name.trim();
    const symbol = deployForm.symbol.trim();
    const description = deployForm.description.trim();

    try {
      setDeployPhase("uploading");
      setUploadStep("Uploading image to IPFS...");
      const imageCid = await uploadImage(image);
      if (!imageCid) throw new Error("Pinata did not return an image CID.");

      setUploadStep("Generating and uploading metadata...");
      const metadata = Array.from({ length: max }, () => ({
        name,
        description,
        image: `ipfs://${imageCid}`,
      }));

      const folderCid = await uploadMetadataFolder(metadata);
      if (!folderCid) throw new Error("Pinata did not return a folder CID.");

      const baseURI = `ipfs://${folderCid}/`;

      setDeployPhase("signature");
      const hash = await writeDeployContract({
        ...contract,
        functionName: "createCollection",
        args: [name, symbol, baseURI, BigInt(max)],
        value: fee ?? 0n,
      });

      setDeployTxHash(hash);
      setDeployPhase("submitted");
      setDeployForm(EMPTY_DEPLOY);
      setImage(null);
    } catch (err) {
      failDeploy(parseContractError(err));
    }
  }

  // ---- READ CONTRACT INFO FOR MINT TAB -------------------------------------
  const validMintAddress = isAddress(mintCollectionAddress)
    ? mintCollectionAddress
    : null;

  const MINT_READ_FIELDS = ["name", "symbol", "creator", "totalMinted", "maxSupply"];
  const { data: mintContractData, refetch: refetchMintData, isLoading: loadingMintData } = useReadContracts({
    contracts: validMintAddress
      ? MINT_READ_FIELDS.map((fn) => ({
          address: validMintAddress,
          abi: Erc721TokenAbi,
          functionName: fn,
        }))
      : [],
    query: { enabled: Boolean(validMintAddress) },
  });

  // Refetch mint collection info when mint tx succeeds
  useEffect(() => {
    if (mintReceipt && mintReceipt.status === "success") {
      refetchMintData();
    }
  }, [mintReceipt, refetchMintData]);

  const collectionInfo = useMemo(() => {
    if (!validMintAddress || !mintContractData) return null;
    const [nameRes, symbolRes, creatorRes, totalMintedRes, maxSupplyRes] =
      mintContractData;

    if (nameRes?.status !== "success" || symbolRes?.status !== "success") {
      return null;
    }

    return {
      name: nameRes.result,
      symbol: symbolRes.result,
      creator: creatorRes?.result,
      totalMinted: totalMintedRes?.result !== undefined ? BigInt(totalMintedRes.result) : undefined,
      maxSupply: maxSupplyRes?.result !== undefined ? BigInt(maxSupplyRes.result) : undefined,
    };
  }, [validMintAddress, mintContractData]);

  const isCreator =
    collectionInfo?.creator && address
      ? collectionInfo.creator.toLowerCase() === address.toLowerCase()
      : true;

  const isSoldOut =
    collectionInfo?.totalMinted !== undefined &&
    collectionInfo?.maxSupply !== undefined &&
    collectionInfo.totalMinted >= collectionInfo.maxSupply;

  // ---- DERIVED MINT UI STATE -----------------------------------------------
  const { status: mintStatus, message: mintMessage } = useMemo(() => {
    if (mintPhase === "error")
      return { status: "error", message: mintLocalError };

    if (mintPhase === "submitted") {
      if (mintWaitError) {
        return { status: "error", message: parseContractError(mintWaitError) };
      }
      if (mintReceipt?.status === "reverted") {
        return { status: "error", message: "Mint transaction reverted on chain." };
      }
      if (mintReceipt) {
        return { status: "success", message: "NFT minted successfully!" };
      }
      return {
        status: "pending",
        message: "Minting transaction submitted, waiting for confirmation...",
      };
    }

    if (mintPhase === "signature") {
      return {
        status: "signature",
        message: "Confirm the mint transaction in MetaMask...",
      };
    }

    return { status: "idle", message: "" };
  }, [mintPhase, mintLocalError, mintReceipt, mintWaitError]);

  const mintBusy = mintStatus === "signature" || mintStatus === "pending";

  function failMint(msg) {
    setMintLocalError(msg);
    setMintPhase("error");
  }

  async function onMintSubmit(e) {
    e.preventDefault();
    setMintTxHash(undefined);

    if (!validMintAddress) {
      failMint("Please enter a valid ERC-721 collection contract address.");
      return;
    }
    if (!isAddress(mintRecipient)) {
      failMint("Please enter a valid recipient Ethereum address.");
      return;
    }

    if (collectionInfo && !isCreator) {
      failMint(
        `Only the creator (${collectionInfo.creator.slice(
          0,
          6
        )}...${collectionInfo.creator.slice(-4)}) can mint NFTs for this collection.`
      );
      return;
    }

    if (isSoldOut) {
      failMint("Max supply reached. No more tokens can be minted.");
      return;
    }

    try {
      setMintPhase("signature");
      const hash = await writeMintContract({
        address: validMintAddress,
        abi: Erc721TokenAbi,
        functionName: "mint",
        args: [mintRecipient],
      });

      setMintTxHash(hash);
      setMintPhase("submitted");
    } catch (err) {
      failMint(parseContractError(err));
    }
  }

  function quickGoToMint(collAddr) {
    setMintCollectionAddress(collAddr);
    if (address) setMintRecipient(address);
    setMintPhase("idle");
    setMintLocalError("");
    setMintTxHash(undefined);
    setActiveTab("mint");
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-bold tracking-tight">ERC721 Collection Studio</h1>
      <p className="mt-2 mb-6 text-zinc-400">
        Deploy a new NFT collection to IPFS or mint NFTs from your deployed collections.
      </p>

      {/* Tabs Switcher */}
      <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("deploy")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            activeTab === "deploy"
              ? "bg-violet-600 text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Deploy Collection
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("mint")}
          className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
            activeTab === "mint"
              ? "bg-violet-600 text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Mint NFT
        </button>
      </div>

      {activeTab === "deploy" ? (
        <Card>
          <form onSubmit={onDeploySubmit} className="flex flex-col gap-5">
            <Field label="Collection name">
              <input
                required
                value={deployForm.name}
                onChange={updateDeploy("name")}
                disabled={deployBusy}
                placeholder="My Collection"
                className={inputClass}
              />
            </Field>

            <Field label="Symbol">
              <input
                required
                value={deployForm.symbol}
                onChange={updateDeploy("symbol")}
                disabled={deployBusy}
                placeholder="MYC"
                maxLength={11}
                className={inputClass}
              />
            </Field>

            <Field
              label="Max supply"
              hint={`How many tokens can ever be minted (max ${MAX_SUPPLY_LIMIT}).`}
            >
              <input
                required
                inputMode="numeric"
                value={deployForm.maxSupply}
                onChange={updateDeploy("maxSupply")}
                disabled={deployBusy}
                placeholder="100"
                className={inputClass}
              />
            </Field>

            <Field label="Image" hint="Shared by every token in this collection.">
              <input
                required
                type="file"
                accept="image/*"
                disabled={deployBusy}
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-violet-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-violet-500 disabled:opacity-50"
              />
            </Field>

            <Field label="Description">
              <textarea
                required
                rows={3}
                value={deployForm.description}
                onChange={updateDeploy("description")}
                disabled={deployBusy}
                placeholder="What is this collection about?"
                className={inputClass}
              />
            </Field>

            <button
              type="submit"
              disabled={deployBusy || !isConnected}
              className="mt-1 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!isConnected
                ? "Connect your wallet to continue"
                : deployBusy
                  ? "Working..."
                  : "Deploy collection"}
            </button>

            <StatusBanner
              status={deployStatus}
              message={deployMessage}
              txHash={deployTxHash}
              explorerUrl={explorerUrl}
            />

            {deployedCollectionAddress && (
              <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Collection Ready
                </p>
                <p className="mt-1 break-all font-mono text-xs text-emerald-200">
                  {deployedCollectionAddress}
                </p>
                <button
                  type="button"
                  onClick={() => quickGoToMint(deployedCollectionAddress)}
                  className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition-colors"
                >
                  Mint NFT from this Collection &rarr;
                </button>
              </div>
            )}
          </form>
        </Card>
      ) : (
        <Card>
          <form onSubmit={onMintSubmit} className="flex flex-col gap-5">
            <Field label="Collection Address" hint="Address of the deployed ERC721 collection contract.">
              <input
                required
                value={mintCollectionAddress}
                onChange={(e) => setMintCollectionAddress(e.target.value.trim())}
                disabled={mintBusy}
                placeholder="0x..."
                className={inputClass}
              />
            </Field>

            {/* Live Collection Inspection */}
            {validMintAddress && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
                {loadingMintData ? (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    <span>Loading collection info...</span>
                  </div>
                ) : collectionInfo ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-100">
                        {collectionInfo.name} ({collectionInfo.symbol})
                      </span>
                      <span className="rounded bg-violet-500/20 px-2 py-0.5 text-xs font-mono text-violet-300">
                        {collectionInfo.totalMinted !== undefined
                          ? `${collectionInfo.totalMinted.toString()} / ${collectionInfo.maxSupply.toString()} Minted`
                          : "ERC721"}
                      </span>
                    </div>

                    {collectionInfo.maxSupply !== undefined &&
                      collectionInfo.totalMinted !== undefined && (
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-violet-500 transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                (Number(collectionInfo.totalMinted) /
                                  Number(collectionInfo.maxSupply)) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      )}

                    {collectionInfo.creator && (
                      <p className="text-xs text-zinc-400">
                        Creator:{" "}
                        <span className="font-mono text-zinc-300">
                          {collectionInfo.creator}
                        </span>
                        {isCreator && (
                          <span className="ml-2 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
                            You (Creator)
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-amber-400">
                    Could not fetch ERC721 collection info. Verify that this contract address is an ERC721 collection deployed by Qrypto Launcher.
                  </p>
                )}
              </div>
            )}

            <Field label="Recipient Address" hint="The wallet address that will receive the minted NFT.">
              <div className="flex gap-2">
                <input
                  required
                  value={mintRecipient}
                  onChange={(e) => setMintRecipient(e.target.value.trim())}
                  disabled={mintBusy}
                  placeholder="0x..."
                  className={inputClass}
                />
                {address && (
                  <button
                    type="button"
                    onClick={() => setMintRecipient(address)}
                    disabled={mintBusy}
                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10"
                  >
                    My Wallet
                  </button>
                )}
              </div>
            </Field>

            {collectionInfo && !isCreator && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                Warning: Only the creator of this collection can mint NFTs. You are connected as a different address.
              </div>
            )}

            {isSoldOut && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                Max supply reached ({collectionInfo.maxSupply.toString()} NFTs). No more NFTs can be minted.
              </div>
            )}

            <button
              type="submit"
              disabled={
                mintBusy ||
                !isConnected ||
                !validMintAddress ||
                (collectionInfo && !isCreator) ||
                isSoldOut
              }
              className="mt-1 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!isConnected
                ? "Connect your wallet to continue"
                : mintBusy
                  ? "Minting NFT..."
                  : isSoldOut
                    ? "Max supply reached"
                    : !isCreator
                      ? "Only creator can mint"
                      : "Mint NFT"}
            </button>

            <StatusBanner
              status={mintStatus}
              message={mintMessage}
              txHash={mintTxHash}
              explorerUrl={explorerUrl}
            />
          </form>
        </Card>
      )}
    </div>
  );
}
