/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "../index.html",
    "../js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dc2645",
        "primary-dark": "#991b1b",
        "user-bubble": "#e9967a",
        "user-bubble-dark": "#b06d58",
        "background-light": "#f9fafb",
        "background-dark": "#0f172a",
        sidebar: {
          light: "#811d1d",
          dark: "#450a0a"
        }
      },
      fontFamily: {
        display: ["Inter", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.75rem"
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries")
  ]
};
