// app/blog/page.js
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { blogPosts } from "./posts";

export const metadata = buildMetadata({
  title: "Blog — QryptoLauncher",
  description:
    "Guides and updates on deploying ERC20 tokens and ERC721 NFT collections on Base, IPFS metadata, wallet security, and building on QryptoLauncher.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">QryptoLauncher Blog</h1>
      <p className="mb-10 text-slate-300">
        Guides and notes on deploying tokens and NFT collections on Base,
        onchain metadata, and building safely with no-code tools.
      </p>
      <div className="space-y-10">
        {blogPosts.map((post) => (
          <article key={post.slug} className="border-b border-slate-800 pb-8">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-slate-500 mb-3">
              {new Date(post.datePublished).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-slate-300 mb-3">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm underline text-slate-400"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}