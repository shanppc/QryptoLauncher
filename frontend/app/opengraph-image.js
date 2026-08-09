// app/opengraph-image.js
//
// Next.js auto-generates a 1200x630 OG image at build/request time and
// wires it into the <meta property="og:image"> tag automatically.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image

import { ImageResponse } from "next/og";

export const alt = "QryptoLauncher — Create ERC20 Tokens and NFT Collections on Base";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b0f1a 0%, #101a33 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#5b8def",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: "#0b0f1a",
            }}
          >
            Q
          </div>
          <div style={{ fontSize: 32, color: "#c7d2fe", fontWeight: 600 }}>
            QryptoLauncher
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 54,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: 980,
          }}
        >
          Launch Tokens and NFT Collections on Base
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 26,
            color: "#94a3b8",
            maxWidth: 900,
          }}
        >
          No-code ERC20 &amp; ERC721 deployment. Non-custodial. Onchain in minutes.
        </div>
      </div>
    ),
    { ...size }
  );
}
