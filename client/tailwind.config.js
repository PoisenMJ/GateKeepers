/** @type {import('tailwindcss').Config} */

const breakpoints = require('./src/util/breakpoints');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // extend: {},
    screen: breakpoints
  },
  plugins: [],
}
