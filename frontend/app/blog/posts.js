// app/blog/posts.js
//
// Simple static data source for launch. Swap this for MDX files, a headless
// CMS, or a database query later — every consumer (blog index, [slug] page,
// sitemap.js) reads from this one array, so nothing else needs to change.

export const blogPosts = [
  {
    slug: "how-to-launch-an-erc20-token-on-base",
    title: "How to Launch an ERC20 Token on Base Without Writing Code",
    description:
      "A step-by-step walkthrough of deploying an ERC20 token on Base using QryptoLauncher — from connecting a wallet to confirming your first onchain transaction.",
    datePublished: "2026-07-01",
    dateModified: "2026-07-01",
    excerpt:
      "Deploying an ERC20 token used to mean writing Solidity, configuring Hardhat, and managing your own deployment scripts. Here's how to do it in a few minutes with just a wallet.",
    content: [
      "Deploying an ERC20 token traditionally means writing and testing Solidity code, setting up a framework like Hardhat or Foundry, and managing environment variables and private keys in a deployment script. For a lot of projects — community tokens, internal experiments, small-scale launches — that overhead isn't worth it.",
      "QryptoLauncher removes that overhead by putting a standardized, OpenZeppelin-based ERC20 factory contract behind a simple form. You still get a real, verifiable, non-custodial contract; you just don't have to write or deploy the code yourself.",
      "To launch a token: connect your wallet from the header, make sure you're on the network you intend to deploy to (Base Mainnet for production, Sepolia for testing), and open the ERC20 creation flow. Set your token's name, symbol, and initial supply — the app handles decimal precision automatically. Review the protocol fee and estimated gas, then confirm the transaction in your wallet.",
      "Once the transaction confirms, 100% of the initial supply is minted directly to your wallet, and the new contract is immediately visible on Basescan or Etherscan, along with your dashboard inside QryptoLauncher. From there, the token behaves like any standard ERC20 — it can be added to wallets, listed, or transferred like any other token on the network.",
      "A few things worth double-checking before you deploy: token symbol and name can't be changed after deployment, transactions are irreversible, and gas fees fluctuate with network conditions. Testing your configuration on Sepolia first is a good habit before committing to mainnet.",
    ],
  },
];
