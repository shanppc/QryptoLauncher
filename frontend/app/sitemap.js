// app/sitemap.js
//
// Next.js auto-generates /sitemap.xml from this file at build time.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

import { SITE_URL } from "@/lib/seo/constants";
import { blogPosts } from "./blog/posts";

export default function sitemap() {
  const staticRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/erc20", changeFrequency: "monthly", priority: 0.9 },
    { path: "/erc721", changeFrequency: "monthly", priority: 0.9 },
    { path: "/dashboard", changeFrequency: "monthly", priority: 0.6 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  ].map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
    lastModified: post.dateModified || post.datePublished,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
