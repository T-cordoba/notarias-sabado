import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down-out": {
          "0%":   { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(8px)" },
        },
      },
      animation: {
        "fade-up":       "fade-up 0.22s ease-out both",
        "fade-down-out": "fade-down-out 0.15s ease-in both",
      },
    },
  },
  plugins: [],
};

export default config;
