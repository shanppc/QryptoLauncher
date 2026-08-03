import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Pin the workspace root: an unrelated lockfile higher up the tree
  // otherwise makes Next infer the wrong root.
  turbopack: {
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
