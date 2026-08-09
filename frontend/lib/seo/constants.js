// lib/seo/constants.js
//
// Single source of truth for the canonical domain and site-wide SEO defaults.
// Every metadata export and JSON-LD block should read from here so the
// domain only ever needs to change in one place.

export const SITE_URL = "https://www.qryptolauncher.com";
export const SITE_NAME = "QryptoLauncher";
export const SITE_DESCRIPTION = "Deploy ERC20 tokens and ERC721 NFT collections on Base without writing code. Connect your wallet, configure your contract, and launch onchain.";

// Update once you have real social accounts / a designed logo file.
export const SOCIAL_LINKS = [
  // "https://twitter.com/qryptolauncher",
  // "https://github.com/shanppc/QryptoLauncher",
];

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} — Create ERC20 Tokens and NFT Collections on Base`,
};

export const TWITTER_HANDLE = "@qryptolauncher"; 
