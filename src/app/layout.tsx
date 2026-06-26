import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteJsonLd } from "@/components/seo/JsonLd";
import { createRootMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteJsonLd />
        {children}
      </body>
    </html>
  );
}
