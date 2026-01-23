/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#10b981',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
      },
    },
  },
  plugins: [],
}
