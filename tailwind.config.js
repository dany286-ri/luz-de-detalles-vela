/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F1",
        ivory: "#F6EFE4",
        beige: "#EAE1D2",
        sand: "#DCD0B8",
        ink: "#2B2724",
        charcoal: "#3F3A35",
        gold: "#B08B4F",
        "gold-soft": "#C9A76A",
        cocoa: "#6B5642",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(43, 39, 36, 0.18)",
        card: "0 6px 24px -8px rgba(43, 39, 36, 0.14)",
      },
      maxWidth: {
        "8xl": "1440px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(18px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        popIn: {
          "0%": { opacity: 0, transform: "scale(0.92)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        flicker: {
          "0%, 100%": { transform: "scale(1) rotate(0deg)", filter: "drop-shadow(0 0 6px rgba(176,139,79,0.5))" },
          "25%": { transform: "scale(1.06) rotate(-3deg)", filter: "drop-shadow(0 0 10px rgba(201,167,106,0.75))" },
          "50%": { transform: "scale(0.96) rotate(2deg)", filter: "drop-shadow(0 0 4px rgba(176,139,79,0.35))" },
          "75%": { transform: "scale(1.03) rotate(-2deg)", filter: "drop-shadow(0 0 8px rgba(201,167,106,0.6))" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
        fadeIn: "fadeIn 0.5s ease both",
        slideIn: "slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        popIn: "popIn 0.25s ease both",
        flicker: "flicker 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
