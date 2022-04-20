const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#020A33",
        "background": "#1e2429",
        "pop-up": "#3636db",
        "button": {
          light:  "#E9ECEF",
          dark:   "#020A33",
        },
        "card": "#0070f3",
        "hoverCard": "#292841"
      },
      screens: {
        'xs': {min: '320px', max: '640px'},
        'sm': {min: '640px', max: '768px'},  
        'md': {min: '768px', max: '1024px'}, 
        'mdAndDown': {min: '320px', max: '1200px'},
        'mdAndUp': {min: '1024px', max: '9999px'},
        'lg': {min: '1024px', max: '1280px'},  
        'xl': {min: '1280px', max: '1536px'},  
        '2xl': '1536px',
      }
    },
  },
  plugins: [
    plugin(function({addUtilities}) {
      addUtilities({
        '.backface-visible': {
          'backface-visibility': 'visible',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        }
      })
    })
  ],
}
