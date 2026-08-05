import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata = {
  title: "Qrypto Launcher",
  description: "Launch ERC20 tokens and ERC721 collections in a few clicks.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
            {children}
          </main>
          <footer className="border-t border-white/10 px-4 py-6 text-center text-sm text-zinc-500">
            Qrypto Launcher is available on Base Mainnet and Sepolia Testnet. Not financial or legal advice.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
