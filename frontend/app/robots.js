// app/robots.js
//
// Next.js auto-generates /robots.txt from this file at build time.
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

import { SITE_URL } from "@/lib/seo/constants";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
