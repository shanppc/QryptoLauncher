import Link from "next/link";
import { Header } from "@/components/header";

export default function SiteLayout({ children }) {
  return (
    <>
      <Header
        rightElement={
          <Link
            href="/launch-token"
            className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 transition-colors"
          >
            Launch App
          </Link>
        }
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        {children}
      </main>
    </>
  );
}

