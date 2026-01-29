/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fff",           // Main background/foreground
        secondary: "#1b1b1b",      // Dark text/primary accents
        basic: "#fb9c43"              // Orange accent/tertiary
      },
      textColor: {
        primary: "#fff",           // White text (on dark backgrounds)
        secondary: "#1b1b1b",      // Dark text (on light backgrounds)
        basic: "#fb9c43"              // Orange text (accents/highlights)
      },
      backgroundColor: {
        primary: "#fff",
        secondary: "#1b1b1b",
        basic: "#fb9c43"
      },
      borderColor: {
        primary: "#fff",
        secondary: "#1b1b1b",
        basic: "#fb9c43"
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xs: '2px',
        sm: '3px'
      }
    },
  },
  plugins: [],
}

