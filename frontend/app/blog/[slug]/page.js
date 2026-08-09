// app/blog/[slug]/page.js

import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { blogPosts } from "../posts";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";

// Pre-renders every known post at build time.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

function getPost(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: `${post.title} — QryptoLauncher Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            url: `${SITE_URL}/blog/${post.slug}`,
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
            datePublished: post.datePublished,
            dateModified: post.dateModified || post.datePublished,
            author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
            },
          }),
        }}
      />

      <h1 className="text-3xl font-bold mb-3">{post.title}</h1>
      <p className="text-sm text-slate-500 mb-10">
        Published{" "}
        {new Date(post.datePublished).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="space-y-5 text-slate-300">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
