// lib/seo/buildMetadata.js
//
// Wraps Next.js's Metadata API so every page gets:
//   1. A correct <link rel="canonical"> pointing at www.qryptolauncher.com
//      (this is what stops Google from treating your Vercel preview domain
//      and your custom domain as duplicate sites).
//   2. Consistent Open Graph + X (Twitter) card tags.
//
// Usage in any app/**/page.js or app/**/layout.js:
//
//   import { buildMetadata } from "@/lib/seo/buildMetadata";
//
//   export const metadata = buildMetadata({
//     title: "About — QryptoLauncher",
//     description: "...",
//     path: "/about",
//   });

import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE } from "./constants";

export function buildMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}) {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    alternates: {
      // This is the actual canonical tag. Because metadataBase is set in the
      // root layout, a relative path here resolves against SITE_URL, so
      // every environment (Vercel preview, staging, production) still
      // canonicalizes to the one real domain.
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [image],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
      site: TWITTER_HANDLE,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
