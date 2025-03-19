/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'pre': {
              backgroundColor: 'transparent',
              paddingLeft: '0',
              paddingRight: '0',
              paddingTop: '0',
              paddingBottom: '0',
              marginTop: '0',
              marginBottom: '0',
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
