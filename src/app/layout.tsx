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
  metadataBase: new URL("https://festiq.lucasschwingel.com"),
  title: "Festiq · Seu Spotify em cartaz de festival",
  description:
    "Transforme os artistas mais ouvidos do seu Spotify em cartazes de festival em alta resolução para Stories (9:16) e Feed (1:1).",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Festiq · Seu Spotify em cartaz de festival",
    description:
      "Gere o pôster do seu festival com os artistas mais ouvidos do seu Spotify em temas visuais icônicos para Stories (9:16) e Feed (1:1).",
    url: "/",
    siteName: "Festiq Studio",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Festiq · Seu Spotify em cartaz de festival",
    description:
      "Gere o pôster do seu festival com os artistas mais ouvidos do seu Spotify em temas visuais icônicos para Stories (9:16) e Feed (1:1).",
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
