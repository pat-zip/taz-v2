/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "0px 0px 10px 1px rgba(145,145,145,1)",
      },
    },
  },
  variants: {},
  plugins: [],
  purge: ["./components/**/*.tsx", "./pages/**/*.tsx"],
};
