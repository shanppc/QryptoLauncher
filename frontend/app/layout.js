import "./globals.css";
import Link from "next/link";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  SOCIAL_LINKS,
} from "@/lib/seo/constants";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Create ERC20 Tokens and NFT Collections on Base`,
    template: `%s`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Create ERC20 Tokens and NFT Collections on Base`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/icon.png`,
              description:
                "QryptoLauncher is a non-custodial, no-code platform for deploying ERC20 tokens and ERC721 NFT collections on Base.",
              ...(SOCIAL_LINKS.length ? { sameAs: SOCIAL_LINKS } : {}),
            }),
          }}
        />
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
            {children}
          </main>
          <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-zinc-400">
            <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
              <Link href="/about" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/disclaimer" className="hover:text-white transition-colors">
                Disclaimer
              </Link>
            </div>
            <p className="text-zinc-500 text-xs">
              Qrypto Launcher is available on Base Mainnet and Sepolia Testnet. Not financial or legal advice.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
