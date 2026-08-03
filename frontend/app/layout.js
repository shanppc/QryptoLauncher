import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
            Qrypto Launcher — deploy on testnet at your own risk.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
