/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        cream: '#FAF7F2',
        blush: {
          DEFAULT: '#EAD5D2',
          light: '#F7EFEB',
          dark: '#D8BBB6',
        },
        rose: {
          50: '#FDF8F8',
          100: '#FAF0F1',
          200: '#F4DDE0',
          300: '#EABEC3',
          400: '#DD9DA4',
          500: '#C58E91', // Brand Dusty Rose
          600: '#A96B6E',
          700: '#8A4F52',
          800: '#693B3E',
          900: '#4D292B',
        },
        brand: {
          ivory: '#FAF7F2',
          blush: '#EAD5D2',
          rose: '#C58E91',
          brown: '#352A27',
          gray: '#817873',
          gold: '#C5A059',
        },
        deep: {
          DEFAULT: '#352A27',
          light: '#4E3E3A',
          dark: '#241C1A',
        },
        mutedText: '#817873',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(53, 42, 39, 0.05), 0 2px 6px -1px rgba(53, 42, 39, 0.03)',
        'luxury': '0 10px 30px -5px rgba(53, 42, 39, 0.08), 0 4px 10px -2px rgba(53, 42, 39, 0.04)',
        'card': '0 2px 12px 0 rgba(197, 142, 145, 0.08)',
      },
      borderRadius: {
        'luxury': '16px',
      }
    },
  },
  plugins: [],
}
