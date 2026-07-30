/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ececf8',
          100: '#d0d0ef',
          200: '#a8a8e0',
          300: '#7070cc',
          400: '#3535b5',
          500: '#00008b',
          600: '#00007a',
          700: '#000063',
          800: '#00004d',
          900: '#000033',
          950: '#00001a'
        }
      },

      boxShadow: {
        soft: '0 2px 12px 0 rgb(0 0 0 / 0.08)'
      },

      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem'
      }
    }
  },

  plugins: []
};
