// app/blog/[slug]/page.js
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { blogPosts } from "../posts";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return buildMetadata({
    title: `${post.title} — QryptoLauncher`,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

function ContentBlock({ block, index }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 key={index} className="text-2xl font-semibold text-white mt-10 mb-4">
          {block.text}
        </h2>
      );
    case "image":
      return (
        <figure key={index} className="my-8">
          <div className="relative w-full overflow-hidden rounded-lg border border-slate-800">
            <Image
              src={block.src}
              alt={block.alt}
              width={1200}
              height={675}
              className="w-full h-auto"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-sm text-slate-500 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "paragraph":
    default:
      // FIX: Render HTML directly and add Tailwind styling for nested <a> tags
      return (
        <p 
          key={index} 
          className="text-slate-300 leading-relaxed mb-5 [&_a]:text-blue-400 [&_a]:underline hover:[&_a]:text-blue-300"
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      );
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Organization",
      name: "QryptoLauncher",
    },
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className="text-sm text-slate-400 hover:underline">
        ← Back to blog
      </Link>

      <h1 className="text-3xl font-bold text-white mt-4 mb-3">{post.title}</h1>

      <p className="text-sm text-slate-500 mb-10">
        {new Date(post.datePublished).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <article>
        {post.content.map((block, index) => (
          <ContentBlock key={index} block={block} index={index} />
        ))}
      </article>

    </main>
  );
}