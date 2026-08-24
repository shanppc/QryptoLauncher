import { useState, useEffect } from "react";

/**
 * Fetches the current ETH/USD price from our server-side /api/eth-price route
 * (which calls CoinMarketCap using the CMC_PRO_API_KEY env variable).
 *
 * Returns { ethUsd: number | null, loading: boolean }
 */
export function useEthPrice() {
  const [ethUsd, setEthUsd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrice() {
      try {
        const res = await fetch("/api/eth-price");
        if (!res.ok) throw new Error("non-ok response");
        const { usd } = await res.json();
        if (!cancelled && typeof usd === "number") setEthUsd(usd);
      } catch {
        // silently ignore; ethUsd stays null
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrice();
    return () => {
      cancelled = true;
    };
  }, []);

  return { ethUsd, loading };
}
