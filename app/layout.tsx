import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  return {
    title: "Fischer Product Lab | Many paths. One laboratory.",
    description: "Independent products for clearer decisions, stronger trust, and better-operated systems.",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
        { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
    openGraph: {
      title: "Fischer Product Lab | Many paths. One laboratory.",
      description: "Independent products for clearer decisions, stronger trust, and better-operated systems.",
      images: [`${origin}/og-aurora.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: "Fischer Product Lab | Many paths. One laboratory.",
      description: "Independent products for clearer decisions, stronger trust, and better-operated systems.",
      images: [`${origin}/og-aurora.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
