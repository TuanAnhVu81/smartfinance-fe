/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#059669", // Emerald 600
          dark:    "#047857", // Emerald 700
          light:   "#dcfce7", // Emerald 100
        },
        secondary: {
          DEFAULT: "#0f172a", // Slate 900
          light:   "#1e293b", // Slate 800
        },
        surface: {
          DEFAULT: "#f8fafc", // Slate 50
          card:    "#ffffff",
          border:  "#e2e8f0", // Slate 200
        },
        income:  "#059669",
        expense: "#e11d48",
        budget: {
          safe:    "#10b981",
          warning: "#f59e0b",
          danger:  "#dc2626",
        },
        text: {
          primary:   "#0f172a",
          secondary: "#64748b",
          muted:     "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card:   "16px",
        modal:  "24px",
        button: "10px",
      },
      boxShadow: {
        card:  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        modal: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },
    },
  },
  plugins: [],
}
