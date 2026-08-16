import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: "#0a0a0f", secondary: "#0f1117", tertiary: "#151922" },
        surface: { DEFAULT: "#1a1d29", hover: "#1f2332", elevated: "#252a3c" },
        border: { DEFAULT: "rgba(255,255,255,0.06)", strong: "rgba(255,255,255,0.12)" },
        primary: { DEFAULT: "#00f0ff", dim: "rgba(0,240,255,0.1)", glow: "rgba(0,240,255,0.4)" },
        accent: { purple: "#7000ff", green: "#00ff88", red: "#ff3366", yellow: "#ffcc00", orange: "#ff7700" },
        text: { primary: "#e2e8f0", secondary: "#94a3b8", muted: "#64748b", disabled: "#475569" },
        cyber: { cyan: "#00f0ff", magenta: "#ff00ff", lime: "#00ff88", crimson: "#ff3366", amber: "#ffcc00" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "terminal-blink": "terminal-blink 1s step-end infinite",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        "pulse-glow": {
          "0%,100%": { opacity: "1", boxShadow: "0 0 20px rgba(0,240,255,0.3)" },
          "50%": { opacity: ".7", boxShadow: "0 0 10px rgba(0,240,255,0.1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "terminal-blink": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        shake: {
          "10%,90%": { transform: "translate3d(-1px,0,0)" },
          "20%,80%": { transform: "translate3d(2px,0,0)" },
          "30%,50%,70%": { transform: "translate3d(-4px,0,0)" },
          "40%,60%": { transform: "translate3d(4px,0,0)" },
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0,240,255,0.3), 0 0 40px rgba(0,240,255,0.1)",
        "glow-purple": "0 0 20px rgba(112,0,255,0.3), 0 0 40px rgba(112,0,255,0.1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
