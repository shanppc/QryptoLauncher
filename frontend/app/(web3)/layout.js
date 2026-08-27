import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import WalletButton from "@/components/wallet-button";

export default function Web3Layout({ children }) {
  return (
    <Providers>
      <Header rightElement={<WalletButton />} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        {children}
      </main>
    </Providers>
  );
}

