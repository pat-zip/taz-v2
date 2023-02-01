/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        "rainbow-0": "#6A1B9A",
        "rainbow-1": "#4527A0",
        "rainbow-2": "#283593",
        "rainbow-3": "#1565C0",
        "rainbow-4": "#0277BD",
        "rainbow-5": "#00838F",
        "rainbow-6": "#00695C",
        "rainbow-7": "#2E7D32",
        "rainbow-8": "#558B2F",
        "rainbow-9": "#9E9D24",
        "rainbow-10": "#F9A825",
        success: "#558B2F",
        error: "#000000",
      },
    },
  },
  variants: {},
  plugins: [],
  purge: ["./components/**/*.tsx", "./pages/**/*.tsx"],
};
