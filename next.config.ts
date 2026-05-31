import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const r2Host = (() => {
  const raw = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.trim() || process.env.R2_PUBLIC_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    ...(r2Host
      ? {
          remotePatterns: [
            {
              protocol: "https",
              hostname: r2Host,
              pathname: "/**",
            },
          ],
        }
      : {}),
  },
};

export default withBundleAnalyzer(nextConfig);
