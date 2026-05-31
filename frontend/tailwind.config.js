/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#1B4F72',
        secondary: '#F39C12',
        success:   '#27AE60',
        danger:    '#E74C3C',
        neutral:   '#F8F9FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

