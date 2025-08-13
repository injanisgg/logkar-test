/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      xs: "375px", // mobile m
      sm: "435px",   // mobile l
      md: "768px",   // tablet
      lg: "1024px",  // laptop large devices
      xl: "1440px",  // laptop extra large
    },
    extend: {
      fontFamily: {
        inter : ['Inter', 'Sans Serif'],
      },
      colors: {
      "btn-blue": "#003F62",
      },
    },
  },
  plugins: [],
}