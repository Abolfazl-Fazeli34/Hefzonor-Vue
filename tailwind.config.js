/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontSize: {
        'xs': ['0.75rem', { lineHeight: 'calc(1 / 0.75)' }],       // 12px
        'sm': ['0.875rem', { lineHeight: 'calc(1.25 / 0.875)' }],  // 14px
        'base': ['1rem', { lineHeight: 'calc(1.5 / 1)' }],         // 16px
        'lg': ['1.125rem', { lineHeight: 'calc(1.75 / 1.125)' }],  // 18px
        'xl': ['1.25rem', { lineHeight: 'calc(1.75 / 1.25)' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: 'calc(2 / 1.5)' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: 'calc(2.25 / 1.875)' }], // 30px
        '4xl': ['2.25rem', { lineHeight: 'calc(2.5 / 2.25)' }],    // 36px
        '5xl': ['3rem', { lineHeight: '1' }],                      // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],                   // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],                    // 72px
        '8xl': ['6rem', { lineHeight: '1' }],                      // 96px
        '9xl': ['8rem', { lineHeight: '1' }],                      // 128px
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
