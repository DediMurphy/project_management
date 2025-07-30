/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "var(--color-brand-500)",
        },
        error: {
          500: "var(--color-error-500)",
        },
        gray: {
          100: "var(--color-gray-100)",
          500: "var(--color-gray-500)",
          700: "var(--color-gray-700)",
        },
      },
    },
  },
  plugins: [],
}
