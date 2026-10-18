import type { Metadata } from "next";
import { Inter, Oswald, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/lib/lenis-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Festiq — Your Taste. Your Festival.",
  description: "Transforme seus artistas mais ouvidos do Spotify em um festival personalizado e pôster 9:16 em alta resolução.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Festiq — Your Taste. Your Festival.",
    description: "Crie o pôster do seu festival de música personalizado com base no que você ouve no Spotify.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${oswald.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-brand-bg text-brand-text antialiased selection:bg-brand-accent selection:text-black">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
