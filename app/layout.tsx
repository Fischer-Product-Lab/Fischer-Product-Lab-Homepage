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
    openGraph: {
      title: "Fischer Product Lab | Many paths. One laboratory.",
      description: "Independent products for clearer decisions, stronger trust, and better-operated systems.",
      images: [`${origin}/og.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: "Fischer Product Lab | Many paths. One laboratory.",
      description: "Independent products for clearer decisions, stronger trust, and better-operated systems.",
      images: [`${origin}/og.png`],
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
