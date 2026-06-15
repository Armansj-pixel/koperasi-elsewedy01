/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4f9',
          100: '#d9e4f0',
          200: '#b3c9e1',
          300: '#7aa4cc',
          400: '#4a7db0',
          500: '#1E4A73',
          600: '#163352',
          700: '#0D2137',
          800: '#091929',
          900: '#05101a',
        },
        gold: {
          50:  '#fdf9ee',
          100: '#FDF3DC',
          200: '#f5d98a',
          300: '#E8B84B',
          400: '#C9973A',
          500: '#a87a2a',
          600: '#7d5a1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
