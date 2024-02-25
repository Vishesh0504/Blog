/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
          dark: "#00050a",
          light: "#f5faff",
        },
        text: {
          dark: "#d7eafe",
          light: "#011428",
        },
      },
      fontFamily: {
        content: "Graphik",
        heading: "Montserrat",
      },
    },
  },
  plugins: [],
};
