// app/blog/posts.js
//
// Simple static data source for launch. Swap this for MDX files, a headless
// CMS, or a database query later — every consumer (blog index, [slug] page,
// sitemap.js) reads from this one array, so nothing else needs to change.
//
// content[] is a list of typed blocks rendered in order by [slug]/page.js:
//   { type: "heading", text }                     -> <h2>
//   { type: "paragraph", text }                    -> <p>
//   { type: "image", src, alt, caption? }          -> <figure><img>

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
      {
        type: "paragraph",
        text: "Deploying an ERC20 token traditionally means writing and testing Solidity code, setting up a framework like Hardhat or Foundry, and managing environment variables and private keys in a deployment script. For a lot of projects — community tokens, internal experiments, small-scale launches — that overhead isn't worth it.",
      },
      {
        type: "paragraph",
        text: "QryptoLauncher removes that overhead by putting a standardized, OpenZeppelin-based ERC20 factory contract behind a simple form. You still get a real, verifiable, non-custodial contract; you just don't have to write or deploy the code yourself.",
      },
      {
        type: "paragraph",
        text: "To launch a token: connect your wallet from the header, make sure you're on the network you intend to deploy to (Base Mainnet for production, Sepolia for testing), and open the ERC20 creation flow. Set your token's name, symbol, and initial supply — the app handles decimal precision automatically. Review the protocol fee and estimated gas, then confirm the transaction in your wallet.",
      },
      {
        type: "paragraph",
        text: "Once the transaction confirms, 100% of the initial supply is minted directly to your wallet, and the new contract is immediately visible on Basescan or Etherscan, along with your dashboard inside QryptoLauncher. From there, the token behaves like any standard ERC20 — it can be added to wallets, listed, or transferred like any other token on the network.",
      },
      {
        type: "paragraph",
        text: "A few things worth double-checking before you deploy: token symbol and name can't be changed after deployment, transactions are irreversible, and gas fees fluctuate with network conditions. Testing your configuration on Sepolia first is a good habit before committing to mainnet.",
      },
    ],
  },
  {
    slug: "create-erc20-token-on-base-without-coding",
    title: "How to Create an ERC20 Token on Base Without Coding",
    description:
      "Everything you need to create an ERC20 token on Base without writing Solidity — wallet setup, token parameters, gas versus service fees, and how to verify your contract on BaseScan.",
    datePublished: "2026-08-12",
    dateModified: "2026-08-12",
    excerpt:
      "You don't need to know Solidity, Hardhat, or how a smart contract compiles to launch a token on Base. This guide walks through the whole process with QryptoLauncher's no-code ERC20 creator, plus the risks nobody should skip.",
    content: [
      {
        type: "heading",
        text: "What is an ERC20 token?",
      },
      {
        type: "paragraph",
        text: "An ERC20 token is a fungible token standard on Ethereum-compatible chains — a smart contract that defines a name, symbol, total supply, and a shared set of functions (transfer, balanceOf, approve, allowance) that every wallet and exchange already knows how to read. Because the interface is standardized, an ERC20 token you deploy today will work in MetaMask, Coinbase Wallet, and any DEX without custom integration work. It's the same standard behind most community tokens, governance tokens, and reward-point systems you'll find onchain.",
      },
      {
        type: "heading",
        text: "Why launch on Base?",
      },
      {
        type: "paragraph",
        text: "Base is Coinbase's Ethereum Layer 2, built on the OP Stack. The appeal for a new token launch is straightforward: transaction costs are a small fraction of Ethereum mainnet, confirmation times are fast, and the network settles back to Ethereum for security. It also has an active DeFi and consumer-app ecosystem, so a token deployed there has a real path to wallets, DEXs, and onchain apps rather than sitting isolated on a chain nobody uses. That combination is why so many teams choose to launch a token on Base instead of mainnet Ethereum, especially for community or early-stage projects where gas costs matter.",
      },
      {
        type: "heading",
        text: "What you need before starting",
      },
      {
        type: "paragraph",
        text: "Before you start, you need three things: a browser wallet such as MetaMask or Coinbase Wallet, a small amount of ETH on Base to cover gas (a few dollars' worth is typically enough), and a decision on your token's name, symbol, and total supply. You don't need an IDE, a compiler, or any prior Solidity experience — that's the point of a no-code ERC20 creator. QryptoLauncher's factory contract has already been written, audited in its logic, and deployed; your job is just to configure the parameters and sign the transaction.",
      },
      {
        type: "heading",
        text: "The QryptoLauncher step-by-step process",
      },
      {
        type: "paragraph",
        text: "The QryptoLauncher process is intentionally short. Connect your wallet from the top of the app and confirm you're on Base Mainnet (or Base Sepolia if you want to do a free test run first). Open the ERC20 creation flow, which acts as a Base token generator — a form sitting in front of a standardized, OpenZeppelin-based contract. Fill in your token details, review the fee breakdown, and confirm the transaction in your wallet. That's the entire flow to deploy an ERC20 smart contract: no code editor, no deployment script, no private key ever leaves your wallet.",
      },
      {
        type: "image",
        src: "/blog/images/create-erc20-token-form.webp",
        alt: "QryptoLauncher ERC20 token creation form, showing name, symbol, and supply fields",
        caption: "The QryptoLauncher ERC20 creation form",
      },
      {
        type: "heading",
        text: "Token name, symbol, supply, and decimals",
      },
      {
        type: "paragraph",
        text: "Four fields matter most: name (the full, human-readable name your token will show in wallets and explorers), symbol (the short ticker, usually 3–5 characters, shown next to balances), total supply (how many tokens exist at deployment — QryptoLauncher mints the full supply to your wallet in one transaction), and decimals. Decimals control how divisible your token is; QryptoLauncher uses the standard 18 decimals used by ETH and most ERC20 tokens unless you're deliberately matching a different standard. Name and symbol are permanent once deployed, so it's worth typing them twice before confirming.",
      },
      {
        type: "heading",
        text: "Gas fee vs. QryptoLauncher service fee",
      },
      {
        type: "paragraph",
        text: "Every deployment involves two separate costs, and it helps to know which is which. The gas fee is paid to the Base network itself, not to QryptoLauncher — it covers the computation of deploying and initializing your contract, and it fluctuates with network activity. QryptoLauncher's service fee is a separate, transparent charge shown before you confirm, covering the factory infrastructure, frontend, and ongoing maintenance. Your wallet will show both as part of the total transaction cost, and nothing is charged silently — you approve the exact amount before signing.",
      },
      {
        type: "heading",
        text: "How to inspect your contract on BaseScan",
      },
      {
        type: "paragraph",
        text: "Once your transaction confirms, your token has a real contract address on Base, and you can verify everything yourself on BaseScan. Search your wallet address or the transaction hash, open the new contract, and check the Contract tab to confirm the source is verified against OpenZeppelin's ERC20 implementation. The Holders tab will show your wallet holding 100% of the initial supply, and the Read Contract tab lets you query name, symbol, decimals, and totalSupply directly against the chain — no dashboard required. This is the same public record anyone else can check, which is exactly the point of deploying onchain instead of trusting a private database.",
      },
      {
        type: "image",
        src: "/blog/images/deployed-token.webp",
        alt: "A deployed ERC20 token contract",
        caption: "The deployed Token contract",
      },
      {
        type: "heading",
        text: "Risks and responsibilities",
      },
      {
        type: "paragraph",
        text: "Here's the part worth being blunt about: creating a token does not automatically create liquidity, value, utility, buyers, or regulatory compliance. QryptoLauncher deploys a real, functioning ERC20 contract — it does not create a market for it, list it on an exchange, guarantee anyone will want to hold it, or determine whether your specific token and jurisdiction require securities, tax, or other regulatory compliance. Adding liquidity to a DEX, marketing the token, and understanding the legal obligations in your jurisdiction are entirely separate steps that are your responsibility, not the platform's. Treat the deployment as the beginning of the work, not the end of it.",
      },
      {
        type: "paragraph",
        text: "It's also worth remembering that blockchain transactions are irreversible. Once your contract is deployed, you cannot edit its name, symbol, or the initial supply logic — you can only deploy a new one. Double-check your inputs, keep your seed phrase offline and never share it, and consider running through the entire flow on Base Sepolia testnet first so a typo doesn't cost you real gas.",
      },
      {
        type: "heading",
        text: "Frequently asked questions",
      },
      {
        type: "paragraph",
        text: "Do I need to know Solidity to create an ERC20 token on Base? No. QryptoLauncher's no-code ERC20 creator handles the contract code; you only fill in the token parameters and sign the transaction in your wallet.",
      },
      {
        type: "paragraph",
        text: "Who owns the token supply after deployment? You do. 100% of the initial supply is minted directly to the wallet you deployed from — QryptoLauncher never holds or custodies your tokens.",
      },
      {
        type: "paragraph",
        text: "Can I change the name or symbol after deploying? No. Those values are fixed in the contract at deployment. If you need different values, you'll need to deploy a new token.",
      },
      {
        type: "paragraph",
        text: "Does launching a token on Base mean it will be listed on an exchange? No. Deployment only creates the contract. Getting listed on a DEX or CEX, adding liquidity, and building demand are separate steps you handle afterward.",
      },
      {
        type: "paragraph",
        text: "Is QryptoLauncher custodial? No. QryptoLauncher is non-custodial — your wallet signs every transaction, and the app never has access to your private keys or funds.",
      },
      {
        type: "heading",
        text: "Ready to launch?",
      },
      {
        type: "paragraph",
        text: "If you're ready to deploy an ERC20 smart contract on Base, the process takes a wallet, a few minutes, and a small amount of ETH for gas. Head to QryptoLauncher, connect your wallet, and launch your token on Base — just go in knowing that the contract is only step one, and everything that gives a token real utility happens after it's live.",
      },
    ],
  },
];