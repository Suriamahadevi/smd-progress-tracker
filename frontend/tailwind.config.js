/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#05050a",
          secondary: "#0d0d14",
          card: "#111118",
          elevated: "#16161f",
          border: "rgba(255,255,255,0.06)",
          base: "#05050a",
          surface: "#0d0d14"
        },
        accent: {
          indigo: "#6366f1",
          "indigo-glow": "rgba(99,102,241,0.15)",
          cyan: "#22d3ee",
          "cyan-glow": "rgba(34,211,238,0.15)",
          purple: "#a855f7",
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444"
        }
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"]
      },
      boxShadow: {
        "glow-indigo": "0 0 20px rgba(99,102,241,0.25)",
        "glow-cyan": "0 0 20px rgba(34,211,238,0.25)",
        "glow-sm": "0 0 10px rgba(99,102,241,0.15)",
        card: "0 4px 24px rgba(0,0,0,0.4)"
      },
      keyframes: {
        fadeUp: { "0%": { opacity: 0, transform: "translateY(12px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        pulse_glow: {
          "0%,100%": { boxShadow: "0 0 8px rgba(99,102,241,0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(99,102,241,0.6)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.4s ease forwards",
        fadeIn: "fadeIn 0.3s ease forwards",
        pulse_glow: "pulse_glow 2s ease infinite"
      }
    }
  },
  plugins: []
};
