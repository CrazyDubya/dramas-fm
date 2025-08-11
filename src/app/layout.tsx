import type { Metadata } from "next";
import "./globals.css";
import AudioPlayer from '@/components/AudioPlayer';
import { PlayerProvider } from '@/context/PlayerContext';

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
        <PlayerProvider>
          {children}
          <AudioPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
