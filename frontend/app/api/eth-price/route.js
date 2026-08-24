import { NextResponse } from "next/server";

export const revalidate = 60; // cache for 60 seconds

export async function GET() {
  const apiKey = process.env.CMC_PRO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "CMC_PRO_API_KEY is not configured." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH&convert=USD",
      {
        headers: {
          "X-CMC_PRO_API_KEY": apiKey,
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`CoinMarketCap responded with ${res.status}`);
    }

    const json = await res.json();
    const price = json?.data?.ETH?.quote?.USD?.price;

    if (typeof price !== "number") {
      throw new Error("Unexpected CoinMarketCap response shape.");
    }

    return NextResponse.json({ usd: price });
  } catch (err) {
    console.error("[eth-price]", err);
    return NextResponse.json(
      { error: err.message ?? "Failed to fetch ETH price." },
      { status: 502 }
    );
  }
}
