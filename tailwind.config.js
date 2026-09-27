/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        navy: {
          950: "#0A1220",
          900: "#0E1A2E",
          850: "#122238",
          800: "#16283F",
          700: "#1C324C",
          600: "#28405E",
        },
        surface: {
          50: "#F5F7FA",
          100: "#EEF1F5",
          200: "#E3E8EE",
          300: "#D2D9E2",
        },
        ink: {
          900: "#0F1720",
          700: "#33404F",
          500: "#5B6675",
          400: "#7B8694",
        },
        accent: {
          blue: "#215CC9",
          blueDark: "#1A468F",
          red: "#C1272D",
          redDark: "#961E23",
          amber: "#B5730B",
          amberDark: "#8F5B08",
          green: "#1F7A4D",
          greenDark: "#175E3B",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 23, 32, 0.06), 0 1px 1px 0 rgba(15, 23, 32, 0.04)",
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
      },
    },
  },
  plugins: [],
};
