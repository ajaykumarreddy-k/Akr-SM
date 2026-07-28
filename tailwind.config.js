/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          blue: '#0066FF',
          darkBlue: '#0052CC',
          lightBlue: '#E6F0FF',
          badgeCyan: '#D0F0FD',
          badgePurple: '#F0E6FF',
          badgePink: '#FFEBF0',
          badgeGreen: '#E6F8EF',
          badgeYellow: '#FFF6E6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
