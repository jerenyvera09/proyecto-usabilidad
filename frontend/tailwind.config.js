/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#8b5cf6' }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}
