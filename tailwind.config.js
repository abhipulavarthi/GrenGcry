/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#2E3A3F',   // dark teal
          steel: '#6b7f8eff',  // steel blue
          aqua: '#A7C2C6',   // aqua grey
          brown: '#8B6E5A',  // brown
          sand: '#E3D6BF',   // sand
        }
      }
    },
  },
  plugins: [],
}

