/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        login:
          "rgba(170, 3, 226, 0.05) 0px 54px 55px, rgba(170, 3, 226, 0.1) 0px -12px 30px, rgba(196, 29, 252,0.1) 0px 4px 6px, rgba(196, 29, 252, 0.1) 0px 12px 13px, rgba(196, 29, 252, 0.09) 0px -3px 5px;",
      },
      border: {
        1: "1px",
      },
      colors: {
        "light-beige": "#f5f5dc",
        primary: {
          dark: "#7cbbfd",
          light: "#024083",
        },
        secondary: {
          dark: "#6836a9",
          light: "#a35ffc",
        },
        accent: { dark: "#c41dfc", light: "#aa03e2" },
        bg: {
          dark: "#000212",

          light: "#f5faff",
        },
        editor: {
          dark: "#011428",
          light: "#f5faff",
        },
        text: {
          dark: "#d7eafe",
          light: "#011428",
        },
      },
      fontFamily: {
        content: "Graphik",
        heading: "Value-Serif",
      },
    },
  },
  plugins: [],
};
