const path = require("path")
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        main: "#0C1B54",
        "main-focus": "#152C7D",
        "main-accent": "#1319A9"
      },
      boxShadow: {
        keep: "4px 4px 0 0",
        ios: "0 0 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -2px rgb(0 0 0 / 0.1)"
      },
      screens: {
        popup: { max: "480px" },
        ...defaultTheme.screens,
        "3xl": "1800px"
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
  daisyui: {
    themes: [
      {
        daidai: {
          primary: "#099FF3",
          secondary: "#828DF8",
          accent: "#F471B5",
          neutral: "#1D283A",
          "base-100": "#0F1729",
          info: "#0CA6E9",
          success: "#2BD4BD",
          warning: "#F4C152",
          error: "#FB6F84",

          "--rounded-btn": "0"
        }
      }
    ]
  }
}
