import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "9/16": "9 / 16",
      },
      colors: {
        brand: {
          bg: "#0A0D14",
          surface: "#121824",
          border: "#1F293D",
          text: "#F8FAFC",
          muted: "#94A3B8",
          accent: "#1DB954", // Spotify Green
          accentHover: "#1ED760",
        },
        theme: {
          lolla: {
            yellow: "#FFE800",
            lime: "#D2F800",
            cyan: "#00E5FF",
            magenta: "#FF0055",
            orange: "#FF6B00",
            black: "#0D0D0D",
          },
          rock: {
            night: "#090D16",
            stage: "#04060A",
            cyan: "#29B6F6",
            amber: "#FFB300",
            silver: "#CFD8DC",
          },
          tropical: {
            turquoise: "#00A896",
            coral: "#FF6B6B",
            sand: "#F4D35E",
            mint: "#02C39A",
            navy: "#023047",
          },
          retro: {
            paper: "#F5EBE1",
            ink: "#1C1917",
            crimson: "#7F1D1D",
            ochre: "#92400E",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-oswald)", "Impact", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
