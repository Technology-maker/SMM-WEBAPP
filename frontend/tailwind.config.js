export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#0f0f0f",
        panel: "#181826",
        panelSoft: "#202033",
        line: "#303044",
        brand: "#7c3aed",
        ocean: "#2563eb",
        mint: "#14b8a6",
        ember: "#f97316"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(37, 99, 235, 0.22)"
      }
    }
  },
  plugins: []
};
