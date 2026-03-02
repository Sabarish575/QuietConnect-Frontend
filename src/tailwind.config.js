/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "bg-red-500",
    "bg-amber-500",
    "bg-green-500",
    "accent-red-500",
    "accent-amber-500",
    "accent-green-500",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
