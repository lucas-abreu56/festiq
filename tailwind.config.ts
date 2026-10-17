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
        "16/9": "16 / 9",
      },
      colors: {
        // Paleta Oficial do Design Bomb
        bomb: {
          bg: "#141414",
          surface: "#1A1A1A",
          border: "#282828",
          lime: "#CEFF00",
          pink: "#FF3EBA",
          blue: "#4A60FF",
          green: "#31A362",
          chalk: "#F7F6EB",
          muted: "rgba(247, 246, 235, 0.6)",
        },
        brand: {
          bg: "#141414",
          surface: "#1A1A1A",
          border: "#282828",
          text: "#F7F6EB",
          muted: "rgba(247, 246, 235, 0.65)",
          accent: "#CEFF00", // Acid Lime como cor de ação
          accentHover: "#b8e600",
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
        frama: ["'PP Frama Black Italic'", "'PP Frama Bold'", "var(--font-oswald)", "sans-serif"],
        framaExtra: ["'PP Frama Extrabold Italic'", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-oswald)", "'PP Frama Bold'", "Impact", "sans-serif"],
        lolla: ["var(--font-oswald)", "Impact", "'Arial Black'", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
