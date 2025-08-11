import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dramas.FM - Radio Drama Streaming Platform",
  description: "Discover and stream classic radio dramas from Archive.org. Create playlists, explore curated channels, and enjoy thousands of vintage radio shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-white text-black p-2"
        >
          Skip to content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
