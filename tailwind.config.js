/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 🌙 Enable manual dark mode via class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-primary': '#34D399',
        'brand-secondary': '#60A5FA',
        'brand-dark': '#064E3B',
        'brand-light': '#F0FDF4',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-up-delay-1': 'slideUp 0.8s ease-out 0.2s forwards',
        'slide-up-delay-2': 'slideUp 0.8s ease-out 0.4s forwards',
        'slide-up-delay-3': 'slideUp 0.8s ease-out 0.6s forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
