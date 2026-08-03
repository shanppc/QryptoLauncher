"use client";

// Shared bits used by both launcher forms. Keeps the pages lean.

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-50";

const STATUS_STYLES = {
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  busy: "border-violet-500/30 bg-violet-500/10 text-violet-200",
};

/**
 * status: one of idle | uploading | signature | pending | success | error
 */
export function StatusBanner({ status, message, txHash, explorerUrl }) {
  if (status === "idle" || !message) return null;

  const tone =
    status === "error" ? "error" : status === "success" ? "success" : "busy";
  const busy = tone === "busy";

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${STATUS_STYLES[tone]}`}
    >
      {busy && (
        <span
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      <div className="min-w-0">
        <p className="break-words">{message}</p>
        {txHash && explorerUrl && (
          <a
            href={`${explorerUrl}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block underline underline-offset-2 hover:no-underline"
          >
            View transaction
          </a>
        )}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/[0.03] p-5 ${className}`}
    >
      {children}
    </div>
  );
}
