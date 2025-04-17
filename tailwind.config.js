/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a82f39',
          DEFAULT: '#7b1e56',
          dark: '#5a1540',
        },
        accent: {
          light: '#f5b02e',
          DEFAULT: '#e7702e',
          dark: '#d45e1e',
        },
        background: '#ffffff',
        text: '#222222',
      },
      animation: {
        'pulsate': 'pulsate 12s ease-in-out infinite',
      },
      keyframes: {
        pulsate: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        }
      },
    },
  },
  plugins: [],
}