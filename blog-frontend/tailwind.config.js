/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'#7cbbfd',
        secondary:'#4703a0',
        accent:'#c41dfc',
        background_dark:'#00050a',
        background_light:'#f5faff',
        text_dark:'#d7eafe',
        text_light:'#011428',
      },
      fontFamily:{
        heading:'Lora',
        content:'merriweather'
      }
    },
  },
  plugins: [],
}